import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import type { PublicEvent } from "@/lib/events";
import { eventPeriodFilter } from "@/lib/event-filters";
import { EventosPageClient } from "./EventosPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eventos | Platohedro", description: "Consulta talleres, encuentros y actividades de arte, tecnología y educación en Platohedro.", alternates: { canonical: "/eventos" } };

export const revalidate = 300;

export default async function EventosPage() {
  let events: PublicEvent[] = [];
  let pastEvents: PublicEvent[] = [];
  let loadError = false;

  if (isSupabasePublicConfigured) {
    const supabase = createSupabasePublicClient();
    const now = new Date().toISOString();
    const results = await Promise.all((["upcoming", "past"] as const).map((period) => supabase
      .from("events")
      .select("id, slug, title, summary, content, starts_at, ends_at, venue, address, city, category, cover_image_url, registration_url")
      .eq("is_published", true)
      .or(eventPeriodFilter(period, now))
      .order("starts_at", { ascending: period === "upcoming" })
      .limit(100)));
    events = (results[0].data ?? []) as PublicEvent[];
    pastEvents = (results[1].data ?? []) as PublicEvent[];
    loadError = results.some(({ error }) => Boolean(error));
  }

  return (
    <EventosPageClient events={events} pastEvents={pastEvents} isSupabaseConfigured={isSupabasePublicConfigured} loadError={loadError} />
  );
}
