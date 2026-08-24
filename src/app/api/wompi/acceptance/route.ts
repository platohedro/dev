import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const baseUrl = process.env.WOMPI_API_BASE_URL || "https://api-sandbox.wompi.co/v1";
  if (!publicKey) return NextResponse.json({ error: "Wompi no está configurado." }, { status: 503 });

  const response = await fetch(`${baseUrl}/merchants/${encodeURIComponent(publicKey)}`, { cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "No fue posible cargar los términos de Wompi." }, { status: 502 });
  const payload = await response.json() as { data?: { presigned_acceptance?: { acceptance_token?: string; permalink?: string }; presigned_personal_data_auth?: { acceptance_token?: string; permalink?: string } } };
  const acceptance = payload.data?.presigned_acceptance;
  const personal = payload.data?.presigned_personal_data_auth;
  if (!acceptance?.acceptance_token || !personal?.acceptance_token || !acceptance.permalink || !personal.permalink) {
    return NextResponse.json({ error: "Wompi no devolvió los términos de aceptación." }, { status: 502 });
  }
  return NextResponse.json({ publicKey, acceptance, personalAuth: personal }, { headers: { "Cache-Control": "no-store" } });
}
