import type { Metadata } from "next";
import Link from "next/link";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { SiteHeader } from "@/app/components/SiteHeader";

export const revalidate = 300;
export const metadata: Metadata = { title: "Noticias | Platohedro", description: "Noticias, aprendizajes y novedades de Platohedro.", alternates: { canonical: "/noticias" } };

export default async function NewsPage() {
  const { data: news } = isSupabasePublicConfigured
    ? await createSupabasePublicClient().from("news").select("id,slug,title,summary,cover_image_url,published_at,created_at").eq("is_published", true).order("published_at", { ascending: false }).limit(50)
    : { data: [] };

  return <main className="min-h-screen bg-background text-foreground"><SiteHeader /><section className="bg-[#003d7a] px-6 py-16 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#99CC33] uppercase">Platohedro</p><h1 className="text-4xl font-bold md:text-6xl">Noticias</h1><p className="mt-5 max-w-2xl text-lg text-white/75">Historias, aprendizajes y novedades de arte, tecnología y educación.</p></div></section><section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-2 lg:grid-cols-3 md:px-10">{(news ?? []).map((item) => <article key={item.id} className="overflow-hidden border border-border bg-card">{item.cover_image_url && <img src={item.cover_image_url} alt={`Imagen de ${item.title}`} className="h-52 w-full object-cover" />}<div className="p-6"><p className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date(item.published_at || item.created_at))}</p><h2 className="mt-3 text-2xl font-bold"><Link href={`/noticias/${item.slug}`} className="hover:text-[#FF46A2]">{item.title}</Link></h2>{item.summary && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>}</div></article>)}{!news?.length && <p className="border border-border p-6 text-muted-foreground">Próximamente publicaremos nuevas noticias.</p>}</section></main>;
}
