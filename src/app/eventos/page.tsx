import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import type { PublicEvent } from "@/lib/events";
import { EventosPageClient } from "./EventosPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eventos | Platohedro", description: "Consulta talleres, encuentros y actividades de arte, tecnología y educación en Platohedro.", alternates: { canonical: "/eventos" } };

export const revalidate = 300;

export default async function EventosPage() {
  let events: PublicEvent[] = [];
  let loadError = false;

  if (isSupabasePublicConfigured) {
    const supabase = createSupabasePublicClient();
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
    <EventosPageClient events={events} isSupabaseConfigured={isSupabasePublicConfigured} loadError={loadError} />
  );
}
