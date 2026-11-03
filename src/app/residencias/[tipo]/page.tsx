import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ResidencyApplicationForm } from "./ResidencyApplicationForm";

const residencies = {
  "residencia-artistica": {
    title: "Residencia artística",
    description: "Residencias abiertas nacionales e internacionales (autogestionadas)",
    content: [
      "Esta modalidad está dirigida a artistas, investigadorxs, creadorxs y nómadas digitales de cualquier lugar del mundo que deseen desarrollar un proceso de investigación, creación o intercambio en Medellín.",
      "En esta modalidad, cada residente asume los gastos de movilidad, alojamiento, alimentación y producción de su proyecto.",
      "Las residencias abiertas nacionales e internacionales no tienen una fecha límite única de postulación. Revisamos las propuestas de acuerdo con los intereses de investigación, las fechas solicitadas y las posibilidades de alojamiento y acompañamiento de nuestro equipo. Por ello, podemos conversar conjuntamente sobre las fechas y la duración de tu estancia, buscando una opción que se ajuste tanto a tu proceso como a nuestra disponibilidad.",
    ],
    image: "/media/2025/07/on.jpg",
  },
  "residencia-de-investigacion": {
    title: "Residencia de investigación",
    description: "Residencias con apoyo de terceros",
    content: [
      "Esta modalidad está dirigida a artistas e investigadorxs que cuentan con financiación externa o desean postular a becas, fondos de movilidad, programas de cooperación cultural, universidades u otras instituciones que puedan cubrir total o parcialmente los gastos de su residencia.",
      "Desde Platohedro podemos acompañar estos procesos mediante cartas de invitación, aceptación o respaldo institucional, que faciliten la presentación de propuestas a convocatorias y fondos externos.",
      "Podríamos explorar esta posibilidad para buscar apoyos que contribuyan a cubrir movilidad, alojamiento, manutención y otros gastos asociados a tu investigación.",
      "Aunque actualmente no contamos con un fondo permanente para financiar viajes internacionales, estipendios o presupuestos de producción en las residencias abiertas, estamos dispuestxs a conversar sobre posibles alternativas de colaboración.",
    ],
    image: "/media/2025/07/IMG_4154-1024x768-1.jpg",
  },
  "residencia-tecnologica": {
    title: "Residencia tecnológica",
    description: "Residencias vinculadas a proyectos y convocatorias de Platohedro",
    content: [
      "Cada año desarrollamos residencias articuladas a nuestras líneas de investigación, creación y trabajo territorial.",
      "Por ejemplo, durante 2025 trabajamos alrededor de Hidropoéticas Ambientales y en 2026 con la residencia Conectadxs por la Montaña, procesos que exploran las relaciones entre los comunes, lo Humano y lo No-Humano, la memoria, el arte, los territorios y las comunidades.",
      "Estas residencias pueden contar con apoyos de Platohedro o de organizaciones aliadas, que incluyen alojamiento, acompañamiento y otros recursos, dependiendo de las condiciones de cada proyecto.",
      "Su participación se define mediante convocatorias específicas, invitaciones directas, intercambios o procesos de colaboración.",
      "Actualmente esta modalidad no tiene una convocatoria abierta para 2027, pues nos encontramos definiendo las iniciativas y posibilidades de articulación para el próximo año.",
    ],
    image: "/media/2025/07/Lokakarya_Squaresynth_01.jpg",
  },
} as const;

type ResidencySlug = keyof typeof residencies;

function getResidency(slug: string) {
  return residencies[slug as ResidencySlug];
}

export function generateStaticParams() {
  return Object.keys(residencies).map((tipo) => ({ tipo }));
}

export async function generateMetadata({ params }: { params: Promise<{ tipo: string }> }): Promise<Metadata> {
  const { tipo } = await params;
  const residency = getResidency(tipo);
  if (!residency) return {};

  return {
    title: `${residency.title} | Platohedro`,
    description: residency.description,
    alternates: { canonical: `/residencias/${tipo}` },
    openGraph: { title: `${residency.title} | Platohedro`, description: residency.description, url: `/residencias/${tipo}`, images: [{ url: residency.image }] },
  };
}

export default async function ResidencyApplicationPage({ params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params;
  const residency = getResidency(tipo);
  if (!residency) notFound();

  return (
    <main className="min-h-screen bg-white text-[#0051A2]">
      <SiteHeader />
      <section className="bg-[#0051A2] px-6 py-16 text-white md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#99CC33]">Residencias · información preliminar</p>
            <h1 className="text-5xl font-bold leading-none md:text-7xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{residency.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{residency.description}</p>
          </div>
          <img src={residency.image} alt={`Proceso creativo de ${residency.title} en Platohedro`} className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        <div className="space-y-6 text-lg leading-relaxed text-[#0051A2]/80">
          {residency.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF46A2]">Postulación</p>
          <h2 className="mt-3 text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Aplica a esta residencia</h2>
          <p className="mt-5 leading-relaxed text-[#0051A2]/75">Por ahora, las postulaciones para todas las modalidades de residencia se reciben a través del mismo formulario de Google Forms.</p>
          <a href="/residencias" className="mt-7 inline-flex text-sm font-bold text-[#0051A2] hover:text-[#FF46A2]">← Volver a Residencias</a>
        </div>

        <ResidencyApplicationForm />
      </section>
    </main>
  );
}
