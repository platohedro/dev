import { notFound } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { PublicEvent } from "@/lib/events";
import { EventDetailClient } from "./EventDetailClient";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured) notFound();
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("events")
    .select("id, slug, title, summary, content, starts_at, ends_at, venue, address, city, category, cover_image_url, registration_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) notFound();
  const event = data as PublicEvent;

  return <EventDetailClient event={event} />;
}
