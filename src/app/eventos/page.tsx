import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatEventDate, type PublicEvent } from "@/lib/events";
import { SiteHeader } from "@/app/components/SiteHeader";

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
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <SiteHeader />

      <section className="bg-[#003d7a] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#99CC33] uppercase">Agenda</p>
          <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">Eventos y calendario</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">Encuentra talleres, exposiciones, encuentros y actividades de Platohedro.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {!isSupabaseConfigured && (
          <p className="rounded-lg border border-[#99CC33]/40 bg-[#99CC33]/10 p-5 text-sm">La agenda estará disponible pronto.</p>
        )}
        {loadError && <p className="rounded-lg border border-[#FF46A2]/40 bg-[#FF46A2]/10 p-5 text-sm">No fue posible cargar los eventos. Inténtalo nuevamente.</p>}
        {isSupabaseConfigured && !loadError && events.length === 0 && (
          <p className="rounded-lg border border-border bg-card p-8 text-muted-foreground">No hay eventos próximos publicados por ahora. Vuelve pronto.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="overflow-hidden border border-border bg-card shadow-sm">
              {event.cover_image_url && <img src={event.cover_image_url} alt="" className="h-52 w-full object-cover" />}
              <div className="p-6">
                {event.category && <p className="mb-3 text-xs font-bold tracking-widest text-[#0051A2] uppercase">{event.category}</p>}
                <h2 className="text-2xl font-bold"><a href={`/eventos/${event.slug}`} className="hover:text-[#FF46A2]">{event.title}</a></h2>
                {event.summary && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.summary}</p>}
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p className="flex gap-2"><CalendarDays size={16} className="shrink-0 text-[#FF46A2]" />{formatEventDate(event.starts_at)}</p>
                  <p className="flex gap-2"><MapPin size={16} className="shrink-0 text-[#FF46A2]" />{[event.venue, event.address, event.city].filter(Boolean).join(" · ")}</p>
                </div>
                {event.registration_url && <a href={event.registration_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 bg-[#99CC33] px-4 py-2 text-sm font-bold text-[#003d7a] hover:bg-[#FF46A2] hover:text-white">Inscribirme <ArrowUpRight size={16} /></a>}
                <a href={`/eventos/${event.slug}`} className="mt-4 inline-block text-sm font-bold text-[#0051A2] hover:text-[#FF46A2]">Ver evento →</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
