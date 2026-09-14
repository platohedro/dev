import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";

const programs = {
  matinee: {
    title: "Matinée",
    audience: "Niñas y niños entre los 5 y 13 años",
    description: "Matinée es un proyecto pedagógico dirigido a niñas y niños entre los 5 y 13 años, orientado al desarrollo de habilidades psicosociales, comunicativas y herramientas para la prevención de violencias a través del arte y la tecnología.",
    detail: "Cada sábado se desarrollan talleres en la sede de Platohedro y en el barrio El Faro, generando espacios seguros, creativos y participativos que favorecen el aprendizaje, la expresión y la convivencia.",
    image: "/media/2022/03/matinee.jpg",
  },
  ideatorio: {
    title: "Ideatorio",
    audience: "Adolescentes entre los 14 y 18 años",
    description: "Ideatorio es un proyecto dirigido a adolescentes entre los 14 y 18 años, que busca fortalecer habilidades socioemocionales, artísticas, tecnológicas y comunicativas como herramientas para la resolución pacífica de conflictos y la prevención de diferentes formas de violencia.",
    detail: "Los talleres se desarrollan cada viernes en la sede de Platohedro, propiciando espacios de encuentro, creación y reflexión en los que las y los adolescentes pueden explorar sus intereses, expresar sus ideas y fortalecer sus capacidades para relacionarse de manera más consciente y colaborativa.",
    image: "/media/2023/10/ideatorio.jpg",
  },
  "jaquer-escool": {
    title: "Jaquer EsCool",
    audience: "Jóvenes y público abierto",
    description: "Jaquer EsCool es un proceso de formación dirigido a jóvenes y público abierto, que propone espacios de experimentación y aprendizaje alrededor de diferentes temas contemporáneos y de vanguardia.",
    detail: "Entre martes y jueves se desarrollan talleres abiertos que articulan tecnología, medio ambiente, artes, política, memoria y territorio, promoviendo el pensamiento crítico, la creatividad, la participación y el intercambio de saberes.",
    image: "/media/2022/03/la-jaquer.jpg",
  },
  amapolas: {
    title: "Amapolas",
    audience: "Mujeres y madres cabeza de hogar",
    description: "Amapolas es un proyecto dirigido a mujeres y madres cabeza de hogar, orientado al fortalecimiento de habilidades para el desarrollo personal, familiar y económico.",
    detail: "A través de espacios formativos y de acompañamiento, las participantes desarrollan habilidades técnicas, psicosociales y de crecimiento personal que contribuyen a ampliar sus oportunidades, fortalecer su autonomía y potenciar sus capacidades para la construcción de proyectos de vida y bienestar.",
    image: "/media/2023/10/amapolas.jpg",
  },
  comunidad: {
    title: "Comunidad",
    audience: "Acciones comunitarias en los territorios",
    description: "El componente de Comunidad desarrolla acciones orientadas al encuentro, la participación y la construcción colectiva en los territorios.",
    detail: "Se realizan actividades como encuentros comunitarios, convites, sancochos, tomas artísticas e intervenciones territoriales, generando espacios de integración y participación que fortalecen los vínculos comunitarios, promueven la apropiación del territorio e impulsan procesos colectivos de transformación social.",
    image: "/media/2023/11/1697073676568-scaled.jpg",
  },
} as const;

type ProgramSlug = keyof typeof programs;

function getProgram(slug: string) {
  return programs[slug as ProgramSlug];
}

export function generateStaticParams() {
  return Object.keys(programs).map((programa) => ({ programa }));
}

export async function generateMetadata({ params }: { params: Promise<{ programa: string }> }): Promise<Metadata> {
  const { programa } = await params;
  const program = getProgram(programa);
  if (!program) return {};

  return {
    title: `${program.title} | D-Formación | Platohedro`,
    description: program.description,
    alternates: { canonical: `/d-formacion/${programa}` },
    openGraph: { title: `${program.title} | D-Formación | Platohedro`, description: program.description, url: `/d-formacion/${programa}`, images: [{ url: program.image }] },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ programa: string }> }) {
  const { programa } = await params;
  const program = getProgram(programa);
  if (!program) notFound();

  return (
    <main className="min-h-screen bg-white text-[#0051A2]">
      <SiteHeader />
      <section className="bg-[#99CC33] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'DM Mono', monospace" }}>D-Formación · {program.audience}</p>
            <h1 className="text-5xl font-bold leading-none md:text-7xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{program.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0051A2]/80">{program.description}</p>
          </div>
          <img src={program.image} alt={`Participantes del proceso ${program.title} en Platohedro`} className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF46A2]" style={{ fontFamily: "'DM Mono', monospace" }}>¿Cómo sucede?</p>
          <p className="mt-4 text-2xl leading-relaxed md:text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{program.detail}</p>
          <Link href="/d-formacion" className="mt-10 inline-flex items-center gap-2 border border-[#0051A2] px-5 py-3 text-sm font-bold transition-colors hover:bg-[#0051A2] hover:text-white">← Volver a D-Formación</Link>
        </div>
      </section>
    </main>
  );
}
