import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const transactionIdPattern = /^[A-Za-z0-9-]{8,80}$/;
const referencePattern = /^(ORD|DON)-[a-z0-9]+-[a-f0-9]{12}$/;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const reference = request.nextUrl.searchParams.get("reference")?.trim() ?? "";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(`wompi-transaction:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });
  }
  if (!transactionIdPattern.test(id) || !referencePattern.test(reference)) {
    return NextResponse.json({ error: "Consulta de pago inválida." }, { status: 400 });
  }

  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const baseUrl = process.env.WOMPI_API_BASE_URL || "https://sandbox.wompi.co/v1";
  if (!privateKey) return NextResponse.json({ error: "Consulta de Wompi no configurada." }, { status: 503 });

  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("reference,kind,status,total_cop")
    .eq("reference", reference)
    .maybeSingle();
  if (orderError || !order) return NextResponse.json({ error: "Transacción no encontrada." }, { status: 404 });

  const response = await fetch(`${baseUrl}/transactions/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${privateKey}` }, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "Transacción no encontrada." }, { status: response.status === 404 ? 404 : 502 });
  const payload = await response.json() as { data?: Record<string, unknown> };
  const transaction = payload.data;
  if (!transaction) return NextResponse.json({ error: "Transacción no encontrada." }, { status: 404 });

  const transactionReference = String(transaction.reference ?? "");
  const amountInCents = Number(transaction.amount_in_cents);
  const currency = String(transaction.currency ?? "");
  if (transactionReference !== reference || amountInCents !== order.total_cop * 100 || currency !== "COP") {
    return NextResponse.json({ error: "Transacción no encontrada." }, { status: 404 });
  }

  return NextResponse.json(
    { transaction: { id: transaction.id, reference: transactionReference, status: transaction.status, amount_in_cents: amountInCents, payment_method_type: transaction.payment_method_type }, order },
    { headers: { "Cache-Control": "no-store" } },
  );
}
