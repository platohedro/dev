import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WompiEvent = {
  event?: string;
  data?: Record<string, unknown>;
  timestamp?: number;
  signature?: { properties?: string[]; checksum?: string };
};

function readPath(data: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => (
    value && typeof value === "object" && key in value
      ? (value as Record<string, unknown>)[key]
      : undefined
  ), data);
}

function verifyEvent(event: WompiEvent, eventsSecret: string, headerChecksum: string | null) {
  const properties = event.signature?.properties;
  const checksum = headerChecksum || event.signature?.checksum;
  if (!event.data || !properties?.length || !checksum || !Number.isFinite(event.timestamp)) return false;

  const source = `${properties.map((property) => String(readPath(event.data!, property) ?? "")).join("")}${event.timestamp}${eventsSecret}`;
  const expected = createHash("sha256").update(source).digest("hex").toUpperCase();
  const received = checksum.toUpperCase();
  return expected.length === received.length && timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export async function POST(request: NextRequest) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) {
    return NextResponse.json({ error: "Secreto de eventos no configurado." }, { status: 503 });
  }

  let event: WompiEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  if (!verifyEvent(event, eventsSecret, request.headers.get("x-event-checksum"))) {
    return NextResponse.json({ error: "Firma de evento inválida." }, { status: 401 });
  }

  // Conecta aquí una base de datos antes de producción para registrar el estado
  // de forma idempotente y emitir comprobantes. Nunca confirmes el pago desde la URL de retorno.
  if (event.event === "transaction.updated") {
    const transaction = (event.data?.transaction ?? {}) as Record<string, unknown>;
    console.info("Wompi transaction.updated", {
      id: transaction.id,
      reference: transaction.reference,
      status: transaction.status,
      amountInCents: transaction.amount_in_cents,
    });
  }

  return NextResponse.json({ received: true });
}
