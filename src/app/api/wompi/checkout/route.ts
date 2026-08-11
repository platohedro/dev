import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MINIMUM_COP = 1_000;
const MAXIMUM_COP = 50_000_000;

function getSiteUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== getSiteUrl(request)) return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`wompi-checkout:${ip}`, 8, 60_000)) return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });

  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  const missing = [
    !publicKey && "WOMPI_PUBLIC_KEY",
    !integritySecret && "WOMPI_INTEGRITY_SECRET",
    !(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY) && "SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY)",
  ].filter(Boolean);
  if (missing.length) return NextResponse.json({ error: `Configuración incompleta: faltan ${missing.join(", ")}.` }, { status: 503 });

  let payload: { amount?: unknown; productId?: unknown; items?: unknown; email?: unknown; fullName?: unknown };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 }); }

  const email = typeof payload.email === "string" ? payload.email.trim().slice(0, 254) : null;
  const fullName = typeof payload.fullName === "string" ? payload.fullName.trim().slice(0, 160) : null;
  const supabase = createSupabaseAdminClient();
  let amount = Number(payload.amount);
  let kind: "donation" | "product" = "donation";
  let items: { product_id: string; quantity: number; unit_price_cop: number; product_snapshot: Record<string, unknown> }[] = [];

  const requestedItems = Array.isArray(payload.items) ? payload.items : typeof payload.productId === "string" ? [{ productId: payload.productId, quantity: 1 }] : [];
  if (requestedItems.length) {
    const normalized = requestedItems.map((entry) => ({ productId: typeof entry === "object" && entry !== null && "productId" in entry ? String((entry as { productId: unknown }).productId) : "", quantity: typeof entry === "object" && entry !== null && "quantity" in entry ? Number((entry as { quantity: unknown }).quantity) : 0 })).filter((entry) => entry.productId && Number.isSafeInteger(entry.quantity) && entry.quantity > 0 && entry.quantity <= 99);
    if (!normalized.length || normalized.length !== requestedItems.length) return NextResponse.json({ error: "Carrito inválido." }, { status: 400 });
    const { data: products } = await supabase.from("products").select("id,name,slug,description,price_cop,image_url,stock,is_published").in("id", normalized.map((entry) => entry.productId)).eq("is_published", true);
    if (!products || products.length !== normalized.length) return NextResponse.json({ error: "Uno o más productos no están disponibles." }, { status: 404 });
    amount = 0;
    for (const requested of normalized) { const product = products.find((entry) => entry.id === requested.productId); if (!product || product.stock < requested.quantity) return NextResponse.json({ error: `Stock insuficiente para ${product?.name ?? "un producto"}.` }, { status: 409 }); amount += product.price_cop * requested.quantity; items.push({ product_id: product.id, quantity: requested.quantity, unit_price_cop: product.price_cop, product_snapshot: { name: product.name, slug: product.slug, description: product.description, image_url: product.image_url } }); }
    kind = "product";
  }
  if (!Number.isSafeInteger(amount) || amount < MINIMUM_COP || amount > MAXIMUM_COP) return NextResponse.json({ error: "El monto no es válido." }, { status: 400 });

  const reference = `${kind === "product" ? "ORD" : "DON"}-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  const amountInCents = amount * 100;
  const signature = createHash("sha256").update(`${reference}${amountInCents}COP${integritySecret!}`).digest("hex");
  const { data: order, error: orderError } = await supabase.rpc("create_wompi_order", {
    p_reference: reference,
    p_kind: kind,
    p_total_cop: amount,
    p_customer_email: email,
    p_customer_name: fullName,
    p_items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
  });
  if (orderError || !order || typeof order !== "object" || !("id" in order)) {
    const status = orderError?.message === "insufficient_stock" ? 409 : orderError?.message === "product_unavailable" ? 404 : 500;
    return NextResponse.json({ error: status === 409 ? "El stock cambió. Revisa el carrito e inténtalo nuevamente." : "No fue posible preparar la orden." }, { status });
  }

  const fields: Record<string, string> = {
    "public-key": publicKey!, currency: "COP", "amount-in-cents": String(amountInCents), reference,
    "signature:integrity": signature,
  };
  const siteUrl = getSiteUrl(request);
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(siteUrl)) fields["redirect-url"] = `${siteUrl}/pago/resultado?reference=${encodeURIComponent(reference)}`;
  if (email) fields["customer-data:email"] = email;
  if (fullName) fields["customer-data:full-name"] = fullName;
  return NextResponse.json({ checkoutUrl: "https://checkout.wompi.co/p/", fields, orderReference: reference });
}
