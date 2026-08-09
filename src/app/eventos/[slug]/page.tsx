import { notFound } from "next/navigation";
import type { PublicEvent } from "@/lib/events";
import { EventDetailClient } from "./EventDetailClient";
import type { Metadata } from "next";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { absoluteUrl, jsonLd, seoDescription } from "@/lib/seo";

export const revalidate = 300;

async function getEvent(slug: string) {
  if (!isSupabasePublicConfigured) return null;
  const { data } = await createSupabasePublicClient().from("events").select("id, slug, title, summary, content, starts_at, ends_at, venue, address, city, category, cover_image_url, registration_url").eq("slug", slug).eq("is_published", true).maybeSingle();
  return data as PublicEvent | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return { title: "Evento no encontrado | Platohedro", robots: { index: false, follow: false } };
  const description = seoDescription(event.summary || event.content, "Eventos de arte, tecnología y educación en Platohedro.");
  return { title: `${event.title} | Platohedro`, description, alternates: { canonical: `/eventos/${event.slug}` }, openGraph: { type: "article", title: `${event.title} | Platohedro`, description, url: absoluteUrl(`/eventos/${event.slug}`), images: event.cover_image_url ? [{ url: event.cover_image_url, alt: event.title }] : undefined } };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const structuredData = { "@context": "https://schema.org", "@type": "Event", name: event.title, description: seoDescription(event.summary || event.content, "Evento de Platohedro."), startDate: event.starts_at, endDate: event.ends_at || undefined, eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", eventStatus: "https://schema.org/EventScheduled", location: { "@type": "Place", name: event.venue || "Platohedro", address: { "@type": "PostalAddress", streetAddress: event.address || undefined, addressLocality: event.city, addressCountry: "CO" } }, image: event.cover_image_url ? [event.cover_image_url] : undefined, url: absoluteUrl(`/eventos/${event.slug}`), organizer: { "@type": "Organization", name: "Platohedro", url: absoluteUrl("/") } };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} /><EventDetailClient event={event} /></>;
}
