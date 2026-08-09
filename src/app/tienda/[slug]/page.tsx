import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { absoluteUrl, jsonLd, seoDescription } from "@/lib/seo";
import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = 300;

async function getProduct(slug: string) {
  if (!isSupabasePublicConfigured) return null;
  const s = createSupabasePublicClient();
  const { data: product } = await s.from("products").select("id,slug,name,description,image_url,price_cop,price_usd,exchange_rate,stock,created_at,updated_at").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!product) return null;
  const { data: gallery } = await s.from("product_images").select("image_url,position").eq("product_id", product.id).order("position");
  return { product, images: [product.image_url, ...(gallery ?? []).map((i) => i.image_url)].filter(Boolean) as string[] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const result = await getProduct((await params).slug);
  if (!result) return { title: "Producto no encontrado | Platohedro", robots: { index: false, follow: false } };
  const description = seoDescription(result.product.description, `Compra ${result.product.name} en la tienda de Platohedro.`);
  return { title: `${result.product.name} | Tienda Platohedro`, description, alternates: { canonical: `/tienda/${result.product.slug}` }, openGraph: { type: "website", title: `${result.product.name} | Tienda Platohedro`, description, url: absoluteUrl(`/tienda/${result.product.slug}`), images: result.product.image_url ? [{ url: result.product.image_url, alt: result.product.name }] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProduct(slug);
  if (!result) notFound();
  const { product, images } = result;
  const structuredData = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: seoDescription(product.description, "Producto de Platohedro."), image: images, sku: product.id, brand: { "@type": "Brand", name: "Platohedro" }, offers: { "@type": "Offer", url: absoluteUrl(`/tienda/${product.slug}`), priceCurrency: "COP", price: product.price_cop, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} /><ProductDetailClient product={product} images={images} /></>;
}
