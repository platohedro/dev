import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ResidencyApplicationForm } from "./ResidencyApplicationForm";

const residencies = {
  "residencia-artistica": {
    title: "Residencia artística",
    description: "Un espacio preliminar para desarrollar procesos de creación, experimentación y diálogo con las comunidades de Platohedro.",
    image: "https://backup.platohedro.org/wp-content/uploads/2025/07/on.jpg",
  },
  "residencia-de-investigacion": {
    title: "Residencia de investigación",
    description: "Una propuesta preliminar para investigar prácticas artísticas, territorio y pensamiento crítico en conversación con Medellín.",
    image: "https://backup.platohedro.org/wp-content/uploads/2025/07/IMG_4154-1024x768-1.jpg",
  },
  "residencia-tecnologica": {
    title: "Residencia tecnológica",
    description: "Un espacio preliminar para explorar arte, tecnología y conocimiento libre desde la experimentación colectiva.",
    image: "https://backup.platohedro.org/wp-content/uploads/2025/07/Lokakarya_Squaresynth_01.jpg",
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

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF46A2]">Postulación</p>
          <h2 className="mt-3 text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Aplica a esta residencia</h2>
          <p className="mt-5 leading-relaxed text-[#0051A2]/75">Este es un formulario temporal para visualizar el proceso de postulación. Aún no envía ni almacena información.</p>
          <a href="/residencias" className="mt-7 inline-flex text-sm font-bold text-[#0051A2] hover:text-[#FF46A2]">← Volver a Residencias</a>
        </div>

        <ResidencyApplicationForm />
      </section>
    </main>
  );
}
