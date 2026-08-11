import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const baseUrl = process.env.WOMPI_API_BASE_URL || "https://sandbox.wompi.co/v1";
  if (!privateKey) return NextResponse.json({ error: "Consulta de Wompi no configurada." }, { status: 503 });
  const response = await fetch(`${baseUrl}/transactions/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${privateKey}` }, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "No fue posible consultar la transacción." }, { status: response.status });
  const payload = await response.json() as { data?: Record<string, unknown> };
  const transaction = payload.data;
  if (!transaction) return NextResponse.json({ error: "Transacción no encontrada." }, { status: 404 });
  const supabase = createSupabaseAdminClient();
  const { data: order } = await supabase.from("orders").select("reference,kind,status,total_cop").eq("reference", transaction.reference).maybeSingle();
  return NextResponse.json({ transaction: { id: transaction.id, reference: transaction.reference, status: transaction.status, amount_in_cents: transaction.amount_in_cents, payment_method_type: transaction.payment_method_type }, order });
}
