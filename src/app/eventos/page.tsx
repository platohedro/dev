import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { PublicEvent } from "@/lib/events";
import { EventosPageClient } from "./EventosPageClient";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  let events: PublicEvent[] = [];
  let loadError = false;

  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, slug, title, summary, content, starts_at, ends_at, venue, address, city, category, cover_image_url, registration_url")
      .eq("is_published", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true });
    events = (data ?? []) as PublicEvent[];
    loadError = Boolean(error);
  }

  return (
    <EventosPageClient events={events} isSupabaseConfigured={isSupabaseConfigured} loadError={loadError} />
  );
}
