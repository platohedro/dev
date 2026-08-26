import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Frequency = "monthly" | "annual";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function nextChargeAt(frequency: Frequency, from = new Date()) {
  const next = new Date(from);
  if (frequency === "monthly") next.setUTCMonth(next.getUTCMonth() + 1);
  else next.setUTCFullYear(next.getUTCFullYear() + 1);
  return next.toISOString();
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin;
  if (origin && origin !== siteUrl) return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });

  const form = await request.formData();
  const token = String(form.get("token") ?? "").trim();
  const frequency = String(form.get("frequency") ?? "") as Frequency;
  const email = String(form.get("email") ?? "").trim().slice(0, 254);
  const fullName = String(form.get("fullName") ?? "").trim().slice(0, 160);
  const acceptanceToken = String(form.get("acceptance_token") ?? "").trim();
  const personalAuthToken = String(form.get("accept_personal_auth") ?? "").trim();
  const amount = Number(form.get("amount"));
  if (!token || !["monthly", "annual"].includes(frequency) || !email.includes("@") || !fullName || !acceptanceToken || !personalAuthToken || !Number.isSafeInteger(amount) || amount < 1_000 || amount > 50_000_000) {
    return NextResponse.json({ error: "Datos de suscripción inválidos." }, { status: 400 });
  }

  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  const baseUrl = process.env.WOMPI_API_BASE_URL || "https://api-sandbox.wompi.co/v1";
  if (!privateKey || !integritySecret) return NextResponse.json({ error: "Wompi recurrente no está configurado." }, { status: 503 });

  const sourceResponse = await fetch(`${baseUrl}/payment_sources`, {
    method: "POST",
    headers: { Authorization: `Bearer ${privateKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "CARD", token, customer_email: email, acceptance_token: acceptanceToken, accept_personal_auth: personalAuthToken }),
  });
  const sourcePayload = await sourceResponse.json().catch(() => null) as { data?: { id?: number; status?: string } } | null;
  const sourceId = sourcePayload?.data?.id;
  if (!sourceResponse.ok || !sourceId || sourcePayload?.data?.status !== "AVAILABLE") return NextResponse.json({ error: "Wompi no pudo guardar la fuente de pago." }, { status: 422 });

  const reference = `DON-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  const amountInCents = amount * 100;
  const cancelToken = randomBytes(24).toString("hex");
  const supabase = createSupabaseAdminClient();
  const { data: subscription, error: subscriptionError } = await supabase.from("donation_subscriptions").insert({
    donor_email: email,
    donor_name: fullName,
    amount_cop: amount,
    frequency,
    status: "active",
    wompi_payment_source_id: sourceId,
    wompi_payment_source_type: "CARD",
    cancel_token_hash: hashToken(cancelToken),
    next_charge_at: nextChargeAt(frequency),
  }).select("id").single();
  if (subscriptionError || !subscription) return NextResponse.json({ error: "No fue posible crear la suscripción." }, { status: 500 });

  const { data: order, error: orderError } = await supabase.from("orders").insert({ reference, kind: "donation", total_cop: amount, customer_email: email, customer_name: fullName }).select("id").single();
  if (orderError || !order) return NextResponse.json({ error: "No fue posible crear la donación." }, { status: 500 });
  const { error: donationError } = await supabase.from("donations").insert({ order_id: order.id, frequency, subscription_id: subscription.id });
  if (donationError) return NextResponse.json({ error: "No fue posible registrar la donación." }, { status: 500 });

  const signature = createHash("sha256").update(`${reference}${amountInCents}COP${integritySecret}`).digest("hex");
  const transactionResponse = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${privateKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount_in_cents: amountInCents, currency: "COP", customer_email: email, reference, signature, payment_method: { installments: 1 }, payment_source_id: sourceId, recurrent: true }),
  });
  const transactionPayload = await transactionResponse.json().catch(() => null) as { data?: { id?: string }; error?: { reason?: string; type?: string } } | null;
  const transactionId = transactionPayload?.data?.id;
  if (!transactionResponse.ok || !transactionId) {
    await supabase.from("donation_subscriptions").update({ status: "past_due" }).eq("id", subscription.id);
    const reason = transactionPayload?.error?.reason;
    console.error("[wompi/recurring] first charge failed", { type: transactionPayload?.error?.type, reason });
    return NextResponse.json({
      error: "No fue posible iniciar el primer cobro.",
      ...(process.env.NODE_ENV === "development" && reason ? { debug: { type: transactionPayload?.error?.type, reason } } : {}),
    }, { status: 422 });
  }
  await supabase.from("orders").update({ wompi_transaction_id: transactionId }).eq("id", order.id);
  return NextResponse.redirect(`${siteUrl}/pago/resultado?id=${encodeURIComponent(transactionId)}&reference=${encodeURIComponent(reference)}&subscription_id=${encodeURIComponent(subscription.id)}&cancel_token=${encodeURIComponent(cancelToken)}`, 303);
}
