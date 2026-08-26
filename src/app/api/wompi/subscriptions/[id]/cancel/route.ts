import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({})) as { token?: unknown };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!/^[a-f0-9]{48}$/.test(token) || !/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  const { data: subscription } = await supabase.from("donation_subscriptions").select("id,status,wompi_payment_source_id").eq("id", id).eq("cancel_token_hash", createHash("sha256").update(token).digest("hex")).maybeSingle();
  if (!subscription) return NextResponse.json({ error: "Suscripción no encontrada." }, { status: 404 });
  if (subscription.status === "cancelled") return NextResponse.json({ cancelled: true });
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const baseUrl = process.env.WOMPI_API_BASE_URL || "https://api-sandbox.wompi.co/v1";
  if (!privateKey) return NextResponse.json({ error: "Wompi no está configurado." }, { status: 503 });
  const response = await fetch(`${baseUrl}/payment_sources/${subscription.wompi_payment_source_id}/void`, { method: "PUT", headers: { Authorization: `Bearer ${privateKey}` } });
  const wompiPayload = await response.json().catch(() => null) as { error?: { reason?: string; type?: string } } | null;
  if (!response.ok) {
    console.error("[wompi/subscriptions/cancel] void failed", { status: response.status, type: wompiPayload?.error?.type, reason: wompiPayload?.error?.reason });
    return NextResponse.json({
      error: "No fue posible cancelar el medio de pago.",
      ...(process.env.NODE_ENV === "development" ? { debug: { status: response.status, type: wompiPayload?.error?.type, reason: wompiPayload?.error?.reason } } : {}),
    }, { status: 502 });
  }
  await supabase.from("donation_subscriptions").update({ status: "cancelled", cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ cancelled: true });
}
