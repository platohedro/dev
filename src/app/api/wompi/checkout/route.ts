import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MINIMUM_DONATION_COP = 1_000;
const MAXIMUM_DONATION_COP = 50_000_000;

function getSiteUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return configuredUrl || new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expectedOrigin = getSiteUrl(request);
  if (origin && origin !== expectedOrigin) {
    return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  }
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`wompi-checkout:${clientIp}`, 8, 60_000)) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." }, { status: 429, headers: { "Retry-After": "60" } });
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!publicKey || !integritySecret) {
    return NextResponse.json(
      { error: "Wompi aún no está configurado. Agrega las credenciales del ambiente correspondiente." },
      { status: 503 },
    );
  }

  let payload: { amount?: unknown; productId?: unknown; email?: unknown; fullName?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  let amount = Number(payload.amount);
  if (typeof payload.productId === "string") {
    const supabase = await createSupabaseServerClient();
    const { data: product } = await supabase.from("products").select("price_cop, stock, is_published").eq("id", payload.productId).eq("is_published", true).maybeSingle();
    if (!product || product.stock < 1) return NextResponse.json({ error: "Producto no disponible." }, { status: 404 });
    amount = product.price_cop;
  }
  if (!Number.isSafeInteger(amount) || amount < MINIMUM_DONATION_COP || amount > MAXIMUM_DONATION_COP) {
    return NextResponse.json(
      { error: `El aporte debe estar entre ${MINIMUM_DONATION_COP.toLocaleString("es-CO")} y ${MAXIMUM_DONATION_COP.toLocaleString("es-CO")} COP.` },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const fullName = typeof payload.fullName === "string" ? payload.fullName.trim() : "";
  const amountInCents = amount * 100;
  const reference = `PH-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  const signature = createHash("sha256")
    .update(`${reference}${amountInCents}COP${integritySecret}`)
    .digest("hex");

  const fields: Record<string, string> = {
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": String(amountInCents),
    reference,
    "signature:integrity": signature,
    "redirect-url": `${getSiteUrl(request)}/donacion/resultado`,
  };

  if (email) fields["customer-data:email"] = email;
  if (fullName) fields["customer-data:full-name"] = fullName;

  return NextResponse.json({
    checkoutUrl: "https://checkout.wompi.co/p/",
    fields,
  });
}
