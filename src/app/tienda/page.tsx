import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { TiendaPageClient } from "./TiendaPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tienda | Platohedro", description: "Productos y publicaciones para apoyar el trabajo de Platohedro.", alternates: { canonical: "/tienda" } };

export const revalidate = 300;

export default async function Store() {
  if (!isSupabasePublicConfigured) return <TiendaPageClient items={[]} />;
  const s = createSupabasePublicClient();
  const { data: items } = await s.from("products").select("id,slug,name,description,image_url,price_cop,price_usd,stock,exchange_rate,created_at").eq("is_published", true).order("created_at", { ascending: false }).limit(50);
  return <TiendaPageClient items={items ?? []} />;
}
