"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/app/components/SiteHeader";

type Result = { transaction?: { id: string; reference: string; status: string; payment_method_type?: string }; order?: { kind: string; status: string; total_cop: number }; error?: string };

export default function PaymentResultPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const reference = searchParams.get("reference");
    if (!id || !reference) { setLoading(false); return; }
    fetch(`/api/wompi/transactions/${encodeURIComponent(id)}?reference=${encodeURIComponent(reference)}`).then((response) => response.json()).then(setResult).catch(() => setResult({ error: "No fue posible consultar el pago." })).finally(() => setLoading(false));
  }, []);
  const status = result?.transaction?.status;
  const title = loading ? "Consultando tu pago…" : status === "APPROVED" ? "Pago aprobado" : status === "PENDING" ? "Pago en proceso" : "No pudimos aprobar el pago";
  return <div className="min-h-screen bg-[#003d7a] text-white"><SiteHeader /><main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6"><section className="w-full max-w-xl border border-white/20 bg-[#0051A2] p-8 text-center shadow-2xl md:p-12"><p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#99CC33]">PLATOHEDRO · WOMPI</p><h1 className="text-3xl font-bold md:text-4xl">{title}</h1><p className="mt-5 leading-relaxed text-white/80">{result?.error || (status === "APPROVED" ? "Recibimos tu pago. Gracias por apoyar a Platohedro." : "Puedes consultar nuevamente en unos momentos o contactarnos si necesitas ayuda.")}</p>{result?.transaction?.reference && <p className="mt-5 break-all text-xs text-white/50">Referencia: {result.transaction.reference}</p>}<Link href="/" className="mt-8 inline-flex bg-[#99CC33] px-5 py-3 font-bold text-[#003d7a] transition-colors hover:bg-white">Volver a Platohedro</Link></section></main></div>;
}
