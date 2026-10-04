"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/app/components/SiteHeader";

const programDetails = [
  { slug: "matinee", image: "/media/2026/09/photo_4992511006559284941_y.jpg", alt: "Encuentro de niñas, niños y acompañantes de Matinée en Platohedro" },
  { slug: "jaquer-escool", image: "/media/2025/07/Lokakarya_Squaresynth_01.jpg", alt: "Participantes explorando componentes electrónicos en un taller colectivo en Platohedro" },
  { slug: "ideatorio", image: "/media/2026/09/Ideatorio_evi_6.jpg", alt: "Participantes de Ideatorio compartiendo una actividad con proyección en Platohedro" },
  { slug: "amapolas", image: "/media/2026/09/IMG_20240712_160458.jpg", alt: "Participantes de Amapolas creando juntas alrededor de una mesa con materiales artísticos" },
  { slug: "comunidad", image: "/media/2022/04/c_buenvivir.jpg", alt: "Niñas y niños compartiendo una actividad creativa al aire libre con acompañantes" },
];

type Program = { id: number; title: string; tag: string; description: string };

export function DFormacionPageClient() {
  const { t } = useTranslation();
  const programs = t("programs.items", { returnObjects: true }) as Program[];

  return (
    <main className="min-h-screen bg-white text-[#0051A2]">
      <SiteHeader />
      <section className="border-b border-[#0051A2]/20 bg-[#99CC33] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'DM Mono', monospace" }}>{t("dFormacion.label")}</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-none md:text-7xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{t("dFormacion.title")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#0051A2]/75">{t("dFormacion.description")}</p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#0051A2]/75">{t("dFormacion.approach")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF46A2]" style={{ fontFamily: "'DM Mono', monospace" }}>{t("dFormacion.preliminary")}</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{t("dFormacion.programsTitle")}</h2>
          </div>
          <a href="/#programs" className="inline-flex items-center gap-2 text-sm font-bold text-[#0051A2] hover:text-[#FF46A2]">{t("dFormacion.homeCta")} <ArrowUpRight size={16} /></a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <article key={program.id} className="overflow-hidden border border-[#0051A2]/20 bg-white transition-shadow hover:shadow-lg">
              <img src={programDetails[index].image} alt={programDetails[index].alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <p className="mb-3 inline-flex bg-[#99CC33] px-2 py-1 text-xs font-bold text-[#0051A2]" style={{ fontFamily: "'DM Mono', monospace" }}>{program.tag}</p>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{program.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0051A2]/75">{program.description}</p>
                <Link href={`/d-formacion/${programDetails[index].slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold hover:text-[#FF46A2]">{t("programs.learnMore")} <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
