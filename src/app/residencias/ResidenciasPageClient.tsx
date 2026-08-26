"use client";

import { useTranslation } from "react-i18next";
import { ArrowUpRight, Lightbulb, MapPin, Users } from "lucide-react";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ResidentsDirectory } from "@/app/components/ResidentsDirectory";
import { ResidentsMapClient } from "@/app/components/ResidentsMapClient";

type Resident = {
  id: string;
  name: string;
  nationality: string;
  country: string;
  country_lat: number;
  country_lng: number;
  residency_year: number;
  profile_url?: string | null;
};

export function ResidenciasPageClient({ residents, loadError }: { residents: Resident[]; loadError: boolean }) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="bg-[#003d7a] px-6 py-20 text-white md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold tracking-[.2em] text-[#99CC33] uppercase">{t("residenciasPage.hero.eyebrow")}</p>
          <h1 className="max-w-4xl text-5xl font-bold md:text-7xl">{t("residenciasPage.hero.title")}</h1>
          <p className="mt-7 max-w-3xl text-xl text-white/80">{t("residenciasPage.hero.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="text-3xl font-bold">{t("residenciasPage.practice.title")}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{t("residenciasPage.practice.description")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card icon={<MapPin />} title={t("residenciasPage.cards.territory.title")} text={t("residenciasPage.cards.territory.text")} />
          <Card icon={<Users />} title={t("residenciasPage.cards.community.title")} text={t("residenciasPage.cards.community.text")} />
          <Card icon={<Lightbulb />} title={t("residenciasPage.cards.experimentation.title")} text={t("residenciasPage.cards.experimentation.text")} />
        </div>
      </section>

      <section className="bg-[#0051A2] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[.2em] text-[#99CC33] uppercase">{t("residenciasPage.map.eyebrow")}</p>
          <h2 className="mt-2 text-4xl font-bold md:text-5xl">{t("residenciasPage.map.title")}</h2>
          <p className="mt-4 max-w-2xl text-white/75">{t("residenciasPage.map.subtitle")}</p>
          <div className="mt-9">
            {loadError ? (
              <div className="border border-[#FF46A2]/60 bg-[#FF46A2]/15 p-8 text-white">{t("residenciasPage.map.loadError")}</div>
            ) : residents.length ? (
              <ResidentsMapClient residents={residents} />
            ) : (
              <div className="border border-white/25 bg-white/10 p-8 text-white/80">{t("residenciasPage.map.empty")}</div>
            )}
          </div>
          <ResidentsDirectory residents={residents} />
        </div>
      </section>

      <section className="bg-[#99CC33] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-widest text-[#0051A2] uppercase">{t("residenciasPage.modalities.eyebrow")}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Article href="/residencias/residencia-artistica" title="Residencia artística" text={t("residenciasPage.modalities.research.text")} />
            <Article href="/residencias/residencia-de-investigacion" title="Residencia de investigación" text={t("residenciasPage.modalities.community.text")} />
            <Article href="/residencias/residencia-tecnologica" title="Residencia tecnológica" text={t("residenciasPage.modalities.lab.text")} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <h2 className="text-3xl font-bold">{t("residenciasPage.propose.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("residenciasPage.propose.description")}</p>
        <a href="mailto:info@platohedro.org?subject=Propuesta%20de%20residencia" className="mt-7 inline-flex items-center gap-2 bg-[#0051A2] px-5 py-3 font-bold text-white">
          {t("residenciasPage.propose.cta")} <ArrowUpRight size={17} />
        </a>
      </section>
    </main>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="mb-5 text-[#FF46A2]">{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function Article({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <a href={href} className="group bg-white p-6 transition-transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-[#0051A2]">{title}</h3>
      <p className="mt-3 text-sm text-[#003d7a]/75">{text}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#0051A2] group-hover:text-[#FF46A2]">Conocer residencia <ArrowUpRight size={15} /></span>
    </a>
  );
}
