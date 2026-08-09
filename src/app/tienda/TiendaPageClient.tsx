"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/app/components/SiteHeader";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_cop: number;
  price_usd: number;
};

export function TiendaPageClient({ items }: { items: Product[] }) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-[#003d7a] px-8 py-16 text-white">
        <h1 className="mx-auto max-w-7xl text-5xl font-bold">{t("tiendaPage.title")}</h1>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 p-8 md:grid-cols-3">
        {items.map((p) => (
          <Link href={`/tienda/${p.slug}`} key={p.id} className="group border bg-card p-5 transition hover:border-[#FF46A2]">
            {p.image_url && <img src={p.image_url} alt={p.name} className="mb-4 h-56 w-full object-cover transition-transform group-hover:scale-[1.02]" />}
            <h2 className="text-2xl font-bold">{p.name}</h2>
            <p className="mt-2 text-muted-foreground">{p.description}</p>
            <p className="mt-4 font-bold">${Number(p.price_cop).toLocaleString("es-CO")} COP · US$ {p.price_usd}</p>
            <span className="mt-5 inline-block font-bold text-[#0051A2]">{t("tiendaPage.viewProduct")}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
