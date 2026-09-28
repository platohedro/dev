"use client";

import { ArrowUpRight, Building2, Clapperboard, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/app/components/SiteHeader";

const source = "https://web3wasi.platohedro.org";
const sections = [
  { key: "content", Icon: Clapperboard, links: [
    { key: "cypherRadio", href: "https://podcast.platohedro.org/radiocypher" },
    { key: "spaces", href: `${source}/spaces` },
    { key: "blog", href: `${source}/blog` },
  ] },
  { key: "education", Icon: GraduationCap, links: [
    { key: "firstSteps", href: `${source}/products` },
    { key: "glossary", href: `${source}/glosario` },
  ] },
  { key: "infrastructure", Icon: Building2, links: [
    { key: "resources", href: `${source}/services` },
    { key: "github", href: "https://github.com/platohedro" },
  ] },
];

const educationTopics = ["firstSteps", "pedagogy", "blockchain", "privacy"] as const;
const galleryImages = [
  "photo_4979147598069869959_y.jpg",
  "photo_2025-10-20_22-37-12-6.jpg",
  "InShot_20240708_104407739.jpg",
  "IMG_20240909_123137.jpg",
  "IMG_20240904_185343_272.jpg",
  "IMG_20240815_104324_329.jpg",
  "IMG_20240726_030217_094.jpg",
  "IMG_20240726_030207_965.jpg",
  "IMG_20240620_105506_449.jpg",
  "IMG_20240614_204730_802.jpg",
  "4967784149691772998.jpg",
].map((filename) => `https://backup.platohedro.org/wp-content/uploads/2026/09/${filename}`);

export function TecnologiaPageClient() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-background text-[#0051A2] dark:text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <SiteHeader />
      <section className="bg-[#99CC33] px-6 py-20 dark:bg-card md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] dark:text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>{t("nav.technology")} · Web3Wasi</p>
          <h1 className="max-w-4xl font-sans text-5xl font-bold md:text-7xl">{t("technologyPage.title")}</h1>
          <dl className="mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
            {(["web3", "wasi"] as const).map((term) => (
              <div key={term} className="border-l-4 border-[#0051A2] pl-4">
                <dt className="font-bold">{t(`technologyPage.${term}.title`)}</dt>
                <dd className="mt-1 leading-relaxed">{t(`technologyPage.${term}.description`)}</dd>
              </div>
            ))}
          </dl>
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
              {key === "education" && <dl className="mt-6 grid gap-4 sm:grid-cols-2">{educationTopics.map((topic) => <div key={topic} className="border-l-4 border-[#99CC33] py-2 pl-4"><dt className="font-semibold">{t(`technologyPage.educationTopics.${topic}.title`)}</dt><dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`technologyPage.educationTopics.${topic}.description`)}</dd></div>)}</dl>}
              <div className="mt-8 flex flex-wrap gap-3">
                {links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0051A2] px-5 py-3 font-bold text-white transition-colors hover:bg-[#003d7a] dark:bg-primary dark:text-primary-foreground dark:hover:bg-white">{t(`technologyPage.${link.key}`)} <ArrowUpRight size={18} aria-hidden="true" /></a>)}
              </div>
            </div>
          </section>
        ))}
        <section aria-labelledby="web3wasi-gallery-title" className="pt-16">
          <h2 id="web3wasi-gallery-title" className="font-sans text-4xl font-bold md:text-5xl">{t("technologyPage.gallery.title")}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">{t("technologyPage.gallery.description")}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {galleryImages.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden bg-[#99CC33]/20 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#0051A2]" aria-label={t("technologyPage.gallery.open", { number: index + 1 })}>
                <img src={url} alt={t("technologyPage.gallery.image", { number: index + 1 })} loading="lazy" decoding="async" className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </a>
            ))}
          </div>
        </section>
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
