import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await createSupabaseServerClient();
  const { data: p } = await s.from("products").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (!p) notFound();
  const { data: gallery } = await s.from("product_images").select("image_url,position").eq("product_id", p.id).order("position");
  const images = [p.image_url, ...(gallery ?? []).map((i) => i.image_url)].filter(Boolean) as string[];
  return <ProductDetailClient product={p} images={images} />;
}
