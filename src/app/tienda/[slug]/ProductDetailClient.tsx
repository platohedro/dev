"use client";

import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ProductGallery } from "@/app/components/ProductGallery";

type Product = {
  name: string;
  description: string | null;
  price_cop: number;
  price_usd: number;
  exchange_rate: number;
};

export function ProductDetailClient({ product, images }: { product: Product; images: string[] }) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-10 p-8 md:grid-cols-2">
        <ProductGallery images={images} />
        <section>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-5 text-muted-foreground">{product.description}</p>
          <p className="mt-8 text-2xl font-bold">${Number(product.price_cop).toLocaleString("es-CO")} COP</p>
          <p className="text-muted-foreground">US$ {product.price_usd} · {t("tiendaPage.detail.rate")}: ${product.exchange_rate} COP/USD</p>
          <p className="mt-8 border border-[#99CC33] bg-[#99CC33]/10 p-4 text-sm">{t("tiendaPage.detail.comingSoon")}</p>
        </section>
      </div>
    </main>
  );
}
