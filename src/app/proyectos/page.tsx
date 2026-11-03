import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: "Proyectos | Platohedro",
  description: "Proyectos de creación, investigación y pensamiento crítico de Platohedro.",
  alternates: { canonical: "/proyectos" },
};

const projects = [
  { title: "Hidropoéticas Ambientales", href: "https://hidropoeticas.platohedro.org/", text: "Un proceso de creación e investigación alrededor del agua, los territorios y las relaciones entre lo humano y lo no humano." },
  { title: "Juntxs", href: "https://juntxs.platohedro.org/", text: "Un micrositio para compartir un proceso colectivo de creación, pensamiento y colaboración." },
  { title: "Commoning", href: "https://curatingcommonwellbeing.platohedro.org/", text: "Una investigación sobre los comunes, el bienestar y las formas de construir futuro colectivamente." },
];

export default function ProjectsPage() {
  return <main className="min-h-screen bg-background text-foreground"><SiteHeader /><section className="bg-[#003d7a] px-6 py-20 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#99CC33]">Arte y pensamiento</p><h1 className="text-5xl font-bold md:text-7xl">Proyectos</h1><p className="mt-7 max-w-3xl text-xl text-white/80">Procesos de creación e investigación que conectan arte, pensamiento crítico, territorios y comunidades.</p></div></section><section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24"><div className="grid gap-6 md:grid-cols-3">{projects.map((project) => <a key={project.href} href={project.href} target="_blank" rel="noreferrer" className="group flex flex-col border border-border bg-card p-6 transition-transform hover:-translate-y-1"><h2 className="text-2xl font-bold text-[#0051A2]">{project.title}</h2><p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{project.text}</p><span className="mt-6 inline-flex items-center gap-2 font-bold text-[#0051A2] group-hover:text-[#FF46A2]">Visitar proyecto <ArrowUpRight size={16} /></span></a>)}</div></section></main>;
}
