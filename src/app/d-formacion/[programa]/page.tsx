import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";

const programs = {
  matinee: {
    title: "Matinée",
    audience: "Niñas y niños de 5 a 13 años",
    tagline: "Un proceso donde crecer, crear y aprender van de la mano.",
    description: "Desde 2007, Matinée acompaña a niñas y niños en un camino de exploración, juego y creación colectiva a través del arte y la tecnología. A lo largo de los años, hemos visto crecer generaciones que hoy construyen sus propios caminos, mientras nuevas niñas y niños se suman a esta experiencia.",
    methodology: "Nuestra metodología combina experimentación artística, aprendizaje colaborativo y cuidado para cultivar la curiosidad, la expresión, la confianza y otras formas de relacionarnos. Una experiencia pedagógica construida desde la práctica, que sigue evolucionando y puede compartirse y adaptarse a distintos contextos educativos y comunitarios.",
    detail: "Cada sábado, Matinée se vive en dos espacios: la sede de Platohedro y la sede de El Faro. Allí, niñas y niños se encuentran para jugar, experimentar y crear colectivamente a través del arte y la tecnología. Cada encuentro propone nuevas formas de explorar, compartir ideas y aprender con otras personas, mediante experiencias que combinan la curiosidad, la colaboración y el cuidado.",
    image: "/media/2022/03/matinee.jpg",
  },
  ideatorio: {
    title: "Ideatorio",
    audience: "Adolescentes de 14 a 18 años",
    tagline: "Un espacio para descubrir lo que les mueve y explorar lo que quieren hacer.",
    description: "Ideatorio es un espacio abierto y seguro para adolescentes, donde pueden explorar sus intereses, descubrir habilidades y experimentar con distintas formas de crear, aprender y expresarse. A través del arte, la tecnología y el encuentro con otras personas, cada adolescente tiene la oportunidad de reconocer sus capacidades, probar nuevas ideas y encontrar caminos para convertir sus intereses en proyectos de vida.",
    detail: "Los viernes por la tarde, la sede de Platohedro abre sus puertas a las adolescentes para explorar, crear y aprender juntas.",
    image: "/media/2023/10/ideatorio.jpg",
  },
  "jaquer-escool": {
    title: "Jaquer EsCool",
    audience: "Formación, experimentación y autogestión",
    tagline: "Jaquer de jaque mate. EsCool porque sí se puede.",
    description: "La Jaquer EsCool es un proceso de formación dirigido a jóvenes y público abierto, que propone espacios de experimentación y aprendizaje alrededor de temas contemporáneos y de vanguardia.",
    methodology: "Jaquer es poner en jaque lo establecido, abrir la caja negra de la tecnología, explorar cómo funcionan las cosas y reconocer que también podemos revisar nuestras propias ideas, hábitos y formas de relacionarnos. EsCool reivindica nuestra capacidad de aprender, hacer, corregir(se) y autogestionar nuestros procesos. A través del arte, la tecnología y la experimentación colectiva, invitamos a cuestionar lo que damos por hecho, compartir conocimientos y desarrollar ideas que nos permitan crear, decidir y transformar nuestras realidades.",
    detail: "Los martes y jueves por la tarde, la sede de Platohedro abre sus puertas a talleres y experiencias de experimentación y aprendizaje. Consulta nuestra programación para conocer las actividades de cada semana.",
    image: "/media/2022/03/la-jaquer.jpg",
  },
  amapolas: {
    title: "Amapolas",
    audience: "Mujeres y madres cabeza de hogar",
    tagline: "Un espacio para crecer, crear y tejer redes entre mujeres.",
    description: "Amapolas es un proceso colectivo de mujeres, muchas de ellas madres cabeza de hogar, que se encuentran para compartir saberes, explorar sus capacidades y desarrollar iniciativas personales y económicas. A través de la creación, el aprendizaje y el acompañamiento, fortalecen sus proyectos de vida y construyen redes de apoyo y colaboración.",
    detail: "Los viernes cada quince días en la sede Platohedro.",
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

const matineeGallery = ["/media/2026/09/photo_4992511006559284941_y.jpg", "/media/2026/09/photo_4963045293230763216_y.jpg", "/media/2026/09/photo_4963045293230763215_y.jpg", "/media/2026/09/photo_4952179249310182880_y-1.jpg", "/media/2026/09/photo_4952179249310182868_y1.jpg", "/media/2026/09/photo_4952179249310182865_y.jpg", "/media/2026/09/photo_4951892173696118328_y.jpg", "/media/2026/09/photo_4951892173696118327_y.jpg", "/media/2026/09/photo_4951892173696118324_y.jpg", "/media/2026/09/photo_2025-10-20_21-25-52-7.jpg", "/media/2026/09/photo_2025-10-20_21-22-30-6.jpg", "/media/2026/09/photo_2025-10-01_10-19-16.jpg", "/media/2026/09/photo_2025-08-16_15-00-54.jpg", "/media/2026/09/photo_2025-08-16_15-00-51-2.jpg", "/media/2026/09/photo_2025-08-16_15-00-01.jpg", "/media/2026/09/photo_2025-08-02_15-18-45.jpg", "/media/2026/09/photo_2025-08-02_15-18-44.jpg", "/media/2026/09/photo_2025-07-21_11-56-52-2-1.jpg", "/media/2026/09/photo_2025-07-21_11-56-41.jpg", "/media/2026/09/photo_2025-07-21_11-56-40-2.jpg", "/media/2026/09/photo_2025-07-21_11-56-40-1.jpg", "/media/2026/09/photo_2025-07-21_11-56-39.jpg", "/media/2026/09/IMG_20240909_190329_451.jpg", "/media/2026/09/IMG_20240829_180711.jpg"];

type ProgramSlug = keyof typeof programs;

const programGalleries: Partial<Record<ProgramSlug, string[]>> = {
  matinee: matineeGallery,
  amapolas: [
    "/media/2026/09/6.jpg",
    "/media/2026/09/4967737824174517875.jpg",
    "/media/2026/09/5026567636200304483.jpg",
    "/media/2026/09/5149911048172711890.jpg",
    "/media/2026/09/5149911048172711907.jpg",
    "/media/2026/09/5149911048172711910.jpg",
    "/media/2026/09/Amapolas_2.jpg",
    "/media/2026/09/Amapolas_6.jpg",
    "/media/2026/09/Amapolas_7.jpg",
    "/media/2026/09/IMG_20240712_160458.jpg",
  ],
  ideatorio: [
    "/media/2026/09/6-1.jpg",
    "/media/2026/09/4997230286559358672.jpg",
    "/media/2026/09/5096209139335540964_I.jpg",
    "/media/2026/09/Ideatorio_evi_5.jpg",
    "/media/2026/09/Ideatorio_evi_6.jpg",
    "/media/2026/09/Ideatorio_evi_10.jpg",
    "/media/2026/09/IMG_20240726_025407_406.jpg",
    "/media/2026/09/IMG_20240726_034059_850.jpg",
    "/media/2026/09/IMG_20240827_183540.jpg",
    "/media/2026/09/InShot_20240616_223513893.jpg",
  ],
};

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
  const gallery = programGalleries[programa as ProgramSlug];

  return (
    <main className="min-h-screen bg-white text-[#0051A2]">
      <SiteHeader />
      <section className="bg-[#99CC33] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'DM Mono', monospace" }}>D-Formación · {program.audience}</p>
            <h1 className="text-5xl font-bold leading-none md:text-7xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{program.title}</h1>
            {"tagline" in program && <p className="mt-6 max-w-xl text-2xl leading-relaxed" style={{ fontFamily: "'DM Serif Display', serif" }}>{program.tagline}</p>}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0051A2]/80">{program.description}</p>
          </div>
          <img src={program.image} alt={`Participantes del proceso ${program.title} en Platohedro`} className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF46A2]" style={{ fontFamily: "'DM Mono', monospace" }}>¿Cómo sucede?</p>
          {"methodology" in program && <p className="mt-4 text-lg leading-relaxed text-[#0051A2]/80">{program.methodology}</p>}
          <p className="mt-4 text-2xl leading-relaxed md:text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>{program.detail}</p>
          <Link href="/d-formacion" className="mt-10 inline-flex items-center gap-2 border border-[#0051A2] px-5 py-3 text-sm font-bold transition-colors hover:bg-[#0051A2] hover:text-white">← Volver a D-Formación</Link>
        </div>
      </section>
      {gallery && (
        <section aria-labelledby={`${programa}-gallery-title`} className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
          <h2 id={`${programa}-gallery-title`} className="text-3xl font-bold md:text-4xl" style={{ fontFamily: "'DM Serif Display', serif" }}>Galería de {program.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#0051A2]/75">Imágenes de los talleres, encuentros y procesos de {program.title}.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {gallery.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden bg-[#99CC33]/20 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#0051A2]" aria-label={`Abrir imagen ${index + 1} de la galería de ${program.title}`}>
                <img src={url} alt={`Registro visual de ${program.title}, imagen ${index + 1}`} loading="lazy" decoding="async" className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
