import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function nextChargeAt(frequency: "monthly" | "annual", from = new Date()) {
  const next = new Date(from);
  if (frequency === "monthly") next.setUTCMonth(next.getUTCMonth() + 1);
  else next.setUTCFullYear(next.getUTCFullYear() + 1);
  return next.toISOString();
}

export async function POST(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  const baseUrl = process.env.WOMPI_API_BASE_URL || "https://api-sandbox.wompi.co/v1";
  if (!privateKey || !integritySecret) return NextResponse.json({ error: "Wompi no está configurado." }, { status: 503 });

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data: due } = await supabase.from("donation_subscriptions").select("id,donor_email,amount_cop,frequency,wompi_payment_source_id,next_charge_at").eq("status", "active").lte("next_charge_at", now).limit(25);
  const results: Array<{ id: string; status: string }> = [];
  for (const subscription of due ?? []) {
    const claimedUntil = new Date(Date.now() + 10 * 60_000).toISOString();
    const { data: claimed } = await supabase.from("donation_subscriptions").update({ next_charge_at: claimedUntil, updated_at: new Date().toISOString() }).eq("id", subscription.id).eq("status", "active").lte("next_charge_at", now).select("id").maybeSingle();
    if (!claimed) continue;
    const reference = `DON-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
    const amountInCents = subscription.amount_cop * 100;
    const { data: order, error: orderError } = await supabase.from("orders").insert({ reference, kind: "donation", total_cop: subscription.amount_cop, customer_email: subscription.donor_email }).select("id").single();
    if (orderError || !order) { await supabase.from("donation_subscriptions").update({ status: "past_due" }).eq("id", subscription.id); results.push({ id: subscription.id, status: "past_due" }); continue; }
    const { error: donationError } = await supabase.from("donations").insert({ order_id: order.id, frequency: subscription.frequency, subscription_id: subscription.id });
    if (donationError) { await supabase.from("donation_subscriptions").update({ status: "past_due" }).eq("id", subscription.id); results.push({ id: subscription.id, status: "past_due" }); continue; }
    const signature = createHash("sha256").update(`${reference}${amountInCents}COP${integritySecret}`).digest("hex");
    const response = await fetch(`${baseUrl}/transactions`, { method: "POST", headers: { Authorization: `Bearer ${privateKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount_in_cents: amountInCents, currency: "COP", customer_email: subscription.donor_email, reference, signature, payment_source_id: subscription.wompi_payment_source_id, recurrent: true }) });
    const payload = await response.json().catch(() => null) as { data?: { id?: string } } | null;
    if (!response.ok || !payload?.data?.id) { await supabase.from("donation_subscriptions").update({ status: "past_due" }).eq("id", subscription.id); results.push({ id: subscription.id, status: "past_due" }); continue; }
    await supabase.from("orders").update({ wompi_transaction_id: payload.data.id }).eq("id", order.id);
    await supabase.from("donation_subscriptions").update({ last_transaction_id: order.id, next_charge_at: nextChargeAt(subscription.frequency), updated_at: new Date().toISOString() }).eq("id", subscription.id);
    results.push({ id: subscription.id, status: "charged" });
  }
  return NextResponse.json({ processed: results.length, results });
}
