"use client";

import { ArrowUpRight, Building2, Clapperboard, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/app/components/SiteHeader";

const source = "https://web3wasi.platohedro.org";
const sections = [
  { key: "content", Icon: Clapperboard, links: [
    { label: "RadioCypher", href: "https://podcast.platohedro.org/radiocypher" },
    { label: "Spaces × Platohedro", href: `${source}/spaces` },
    { key: "blog", href: `${source}/blog` },
  ] },
  { key: "education", Icon: GraduationCap, links: [
    { label: "Web3 EsCool", href: `${source}/products` },
    { key: "glossary", href: `${source}/glosario` },
  ] },
  { key: "infrastructure", Icon: Building2, links: [
    { key: "resources", href: `${source}/services` },
    { label: "GitHub", href: "https://github.com/platohedro" },
  ] },
];

export function TecnologiaPageClient() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-background text-[#0051A2] dark:text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <SiteHeader />
      <section className="bg-[#99CC33] px-6 py-20 dark:bg-card md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] dark:text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>{t("nav.technology")} · Web3Wasi</p>
          <h1 className="max-w-4xl font-sans text-5xl font-bold md:text-7xl">{t("technologyPage.title")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">{t("technologyPage.intro")}</p>
          <nav aria-label={t("technologyPage.sections")} className="mt-10 flex flex-wrap gap-3">
            {sections.map(({ key }) => <a key={key} href={`#${key}`} className="border border-current px-5 py-3 font-bold transition-colors hover:bg-[#0051A2] hover:text-white dark:hover:bg-primary dark:hover:text-primary-foreground">{t(`technologyPage.${key}.title`)}</a>)}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        {sections.map(({ key, Icon, links }, index) => (
          <section id={key} key={key} className="scroll-mt-24 border-b border-[#0051A2]/20 py-12 first:pt-0 dark:border-border md:grid md:grid-cols-[1fr_2fr] md:gap-12">
            <div className="mb-6">
              <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-6 text-sm text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>0{index + 1}</p>
              <h2 className="mt-2 font-sans text-4xl font-bold md:text-5xl">{t(`technologyPage.${key}.title`)}</h2>
            </div>
            <div>
              <p className="max-w-2xl text-lg leading-relaxed">{t(`technologyPage.${key}.description`)}</p>
              {key === "education" && <ul className="mt-6 grid gap-3 sm:grid-cols-2">{["Onboarding", t("technologyPage.pedagogy"), "Blockchain al Barrio", "Privacy Love Company"].map(label => <li key={label} className="border-l-4 border-[#99CC33] py-2 pl-4 font-semibold">{label}</li>)}</ul>}
              <div className="mt-8 flex flex-wrap gap-3">
                {links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0051A2] px-5 py-3 font-bold text-white transition-colors hover:bg-[#003d7a] dark:bg-primary dark:text-primary-foreground dark:hover:bg-white">{"label" in link ? link.label : t(`technologyPage.${link.key}`)} <ArrowUpRight size={18} aria-hidden="true" /></a>)}
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="bg-[#99CC33] px-6 py-12 dark:bg-card md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <p className="max-w-xl">{t("technologyPage.source")}</p>
          <a href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold underline">Web3Wasi <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </footer>
    </main>
  );
}
