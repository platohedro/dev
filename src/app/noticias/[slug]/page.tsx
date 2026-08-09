import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { SiteHeader } from "@/app/components/SiteHeader";
import { absoluteUrl, jsonLd, seoDescription } from "@/lib/seo";

export const revalidate = 300;

async function getNews(slug: string) {
  if (!isSupabasePublicConfigured) return null;
  const { data } = await createSupabasePublicClient().from("news").select("id,slug,title,summary,content,cover_image_url,published_at,created_at,updated_at").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = await getNews((await params).slug);
  if (!item) return { title: "Noticia no encontrada | Platohedro", robots: { index: false, follow: false } };
  const description = seoDescription(item.summary || item.content, "Noticias y aprendizajes de Platohedro.");
  return { title: `${item.title} | Platohedro`, description, alternates: { canonical: `/noticias/${item.slug}` }, openGraph: { type: "article", title: `${item.title} | Platohedro`, description, url: absoluteUrl(`/noticias/${item.slug}`), images: item.cover_image_url ? [{ url: item.cover_image_url, alt: item.title }] : undefined } };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getNews((await params).slug);
  if (!item) notFound();
  const description = seoDescription(item.summary || item.content, "Noticias y aprendizajes de Platohedro.");
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: item.title, description, datePublished: item.published_at || item.created_at, dateModified: item.updated_at || item.published_at || item.created_at, image: item.cover_image_url ? [item.cover_image_url] : undefined, author: { "@type": "Organization", name: "Platohedro", url: absoluteUrl("/") }, publisher: { "@type": "Organization", name: "Platohedro", url: absoluteUrl("/") }, mainEntityOfPage: absoluteUrl(`/noticias/${item.slug}`) };
  return <main className="min-h-screen bg-background text-foreground"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} /><SiteHeader /><article className="mx-auto max-w-4xl px-6 py-16 md:px-10">{item.cover_image_url && <img src={item.cover_image_url} alt={`Imagen de ${item.title}`} className="mb-8 max-h-[32rem] w-full object-cover" />}<p className="text-sm text-muted-foreground">{new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date(item.published_at || item.created_at))}</p><h1 className="mt-3 text-4xl font-bold md:text-6xl">{item.title}</h1>{item.summary && <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{item.summary}</p>}<div className="mt-10 whitespace-pre-line text-lg leading-relaxed">{item.content || item.summary}</div></article></main>;
}
