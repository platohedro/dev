import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WompiEvent = { event?: string; data?: { transaction?: Record<string, unknown> }; timestamp?: number; signature?: { properties?: string[]; checksum?: string } };

function readPath(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => current && typeof current === "object" && key in current ? (current as Record<string, unknown>)[key] : undefined, value);
}

function verifyEvent(event: WompiEvent, secret: string, headerChecksum: string | null) {
  const properties = event.signature?.properties;
  const checksum = headerChecksum || event.signature?.checksum;
  if (!event.data || !properties?.length || !checksum || !Number.isFinite(event.timestamp)) return false;
  const source = `${properties.map((property) => String(readPath(event.data, property) ?? "")).join("")}${event.timestamp}${secret}`;
  const expected = createHash("sha256").update(source).digest("hex").toUpperCase();
  const received = checksum.toUpperCase();
  return expected.length === received.length && timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export async function POST(request: NextRequest) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) return NextResponse.json({ error: "Secreto de eventos no configurado." }, { status: 503 });
  let event: WompiEvent;
  try { event = await request.json(); } catch { return NextResponse.json({ error: "Evento inválido." }, { status: 400 }); }
  if (!verifyEvent(event, secret, request.headers.get("x-event-checksum"))) return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  if (event.event !== "transaction.updated" || !event.data?.transaction) return NextResponse.json({ received: true });

  const transaction = event.data.transaction;
  const status = String(transaction.status ?? "");
  const reference = String(transaction.reference ?? "");
  const transactionId = String(transaction.id ?? "");
  const amountInCents = Number(transaction.amount_in_cents);
  const currency = String(transaction.currency ?? "");
  if (!reference || !transactionId || !Number.isSafeInteger(amountInCents) || !["APPROVED", "DECLINED", "VOIDED", "ERROR", "PENDING"].includes(status)) return NextResponse.json({ error: "Transacción inválida." }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("finalize_wompi_order", {
    p_reference: reference, p_transaction_id: transactionId, p_status: status,
    p_payment_method_type: String(transaction.payment_method_type ?? ""), p_amount_in_cents: amountInCents,
    p_currency: currency, p_finalized_at: transaction.finalized_at ? String(transaction.finalized_at) : null,
  });
  if (error && !["order_not_found", "payment_mismatch", "insufficient_stock"].includes(error.message)) return NextResponse.json({ error: "No fue posible procesar el evento." }, { status: 500 });
  if (error) return NextResponse.json({ error: "Evento rechazado." }, { status: 422 });
  return NextResponse.json({ received: true });
}
