"use client";

import { useTranslation } from "react-i18next";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/app/components/SiteHeader";
import { formatEventDate, type PublicEvent } from "@/lib/events";

export function EventDetailClient({ event }: { event: PublicEvent }) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <article>
        <section className="bg-[#003d7a] px-6 py-16 text-white md:px-10">
          <div className="mx-auto max-w-4xl">
            {event.category && <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#99CC33] uppercase">{event.category}</p>}
            <h1 className="text-4xl font-bold md:text-6xl">{event.title}</h1>
            {event.summary && <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/80">{event.summary}</p>}
          </div>
        </section>
        <div className="mx-auto grid max-w-4xl gap-10 px-6 py-12 md:grid-cols-[1fr_18rem] md:px-10">
          <div>
            {event.cover_image_url && <img src={event.cover_image_url} alt="" className="mb-8 w-full object-cover" />}
            <div className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {event.content || event.summary || t("eventosPage.detail.fallbackContent")}
            </div>
          </div>
          <aside className="h-fit space-y-5 border border-border bg-card p-6 text-sm">
            <h2 className="text-lg font-bold">{t("eventosPage.detail.info")}</h2>
            <p className="flex gap-2"><CalendarDays size={17} className="shrink-0 text-[#FF46A2]" />{formatEventDate(event.starts_at)}</p>
            <p className="flex gap-2"><MapPin size={17} className="shrink-0 text-[#FF46A2]" />{[event.venue, event.address, event.city].filter(Boolean).join(" · ")}</p>
            {event.registration_url && (
              <a href={event.registration_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#99CC33] px-4 py-3 font-bold text-[#003d7a] hover:bg-[#FF46A2] hover:text-white">
                {t("eventosPage.register")} <ArrowUpRight size={16} />
              </a>
            )}
          </aside>
        </div>
      </article>
    </main>
  );
}
