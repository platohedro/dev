import type { MetadataRoute } from "next";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { absoluteUrl } from "@/lib/seo";
import { residentSlug } from "@/lib/resident-slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/d-formacion"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/tecnologia"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/eventos"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/tienda"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/residencias"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/residencias/residencia-artistica"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/residencias/residencia-de-investigacion"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/residencias/residencia-tecnologica"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/noticias"), changeFrequency: "weekly", priority: 0.8 },
  ];
  if (!isSupabasePublicConfigured) return entries;
  const supabase = createSupabasePublicClient();
  const [{ data: events }, { data: products }, { data: news }, { data: residents }] = await Promise.all([
    supabase.from("events").select("slug,updated_at,starts_at").eq("is_published", true),
    supabase.from("products").select("slug,updated_at,created_at").eq("is_published", true),
    supabase.from("news").select("slug,updated_at,published_at,created_at").eq("is_published", true),
    supabase.from("residents").select("name,updated_at").eq("is_published", true),
  ]);
  entries.push(...(events ?? []).map((event) => ({ url: absoluteUrl(`/eventos/${event.slug}`), lastModified: event.updated_at || event.starts_at, changeFrequency: "weekly" as const, priority: 0.8 })));
  entries.push(...(products ?? []).map((product) => ({ url: absoluteUrl(`/tienda/${product.slug}`), lastModified: product.updated_at || product.created_at, changeFrequency: "weekly" as const, priority: 0.7 })));
  entries.push(...(news ?? []).map((item) => ({ url: absoluteUrl(`/noticias/${item.slug}`), lastModified: item.updated_at || item.published_at || item.created_at, changeFrequency: "weekly" as const, priority: 0.7 })));
  entries.push(...(residents ?? []).map((resident) => ({ url: absoluteUrl(`/residencias/Directorio/${residentSlug(resident.name)}`), lastModified: resident.updated_at, changeFrequency: "monthly" as const, priority: 0.5 })));
  return entries;
}
