import { SiteHeader } from "@/app/components/SiteHeader";
import { ResidentsDirectory } from "@/app/components/ResidentsDirectory";
import { ResidentsMapClient } from "@/app/components/ResidentsMapClient";
import { ArrowUpRight, Lightbulb, MapPin, Users } from "lucide-react";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Resident = {
  id: string; name: string; nationality: string; country: string;
  country_lat: number; country_lng: number; residency_year: number; profile_url?: string | null;
};

export default async function ResidenciasPage() {
  let residents: Resident[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("residents").select("id, name, nationality, country, country_lat, country_lng, residency_year, profile_url").eq("is_published", true).order("residency_year", { ascending: false });
    residents = (data ?? []) as Resident[];
  }
  return <main className="min-h-screen bg-background text-foreground"><SiteHeader />
    <section className="bg-[#003d7a] px-6 py-20 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="mb-4 text-xs font-bold tracking-[.2em] text-[#99CC33] uppercase">Arte, pensamiento y territorio</p><h1 className="max-w-4xl text-5xl font-bold md:text-7xl">Residencias Platohedro</h1><p className="mt-7 max-w-3xl text-xl text-white/80">Un espacio para investigar, crear, compartir saberes y desarrollar proyectos artísticos contemporáneos en conversación con Medellín y sus comunidades.</p></div></section>
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:px-10"><div><h2 className="text-3xl font-bold">Una práctica situada</h2><p className="mt-5 leading-relaxed text-muted-foreground">Las residencias fortalecen la práctica artística mediante el intercambio, la experimentación y la reflexión crítica. Acompañamos procesos que conectan arte, tecnología, educación y cultura libre.</p></div><div className="grid gap-4 sm:grid-cols-3"><Card icon={<MapPin />} title="Territorio" text="Medellín como laboratorio vivo" /><Card icon={<Users />} title="Comunidad" text="Intercambio de saberes" /><Card icon={<Lightbulb />} title="Experimentación" text="Procesos abiertos y críticos" /></div></section>
    <section className="bg-[#0051A2] px-6 py-16 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-[.2em] text-[#99CC33] uppercase">2014 — presente</p><h2 className="mt-2 text-4xl font-bold md:text-5xl">Mapa de residentes Platohedro</h2><p className="mt-4 max-w-2xl text-white/75">Cada punto reúne a las personas que han realizado una residencia, agrupadas por su país de nacionalidad.</p><div className="mt-9">{residents.length ? <ResidentsMapClient residents={residents} /> : <div className="border border-white/25 bg-white/10 p-8 text-white/80">El mapa aparecerá al publicar residentes desde el directorio administrativo.</div>}</div><ResidentsDirectory residents={residents} /></div></section>
    <section className="bg-[#99CC33] px-6 py-16 md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold tracking-widest text-[#0051A2] uppercase">Modalidades</p><div className="mt-8 grid gap-5 md:grid-cols-3"><Article title="Investigación y creación" text="Proyectos que exploran preguntas, lenguajes y metodologías." /><Article title="Residencia comunitaria" text="Procesos colaborativos arraigados en el territorio." /><Article title="Laboratorio abierto" text="Prototipos, aprendizajes y conversaciones públicas." /></div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-10"><h2 className="text-3xl font-bold">¿Quieres proponer una residencia?</h2><p className="mt-4 text-muted-foreground">Escríbenos con una descripción de tu proceso y tus preguntas de investigación.</p><a href="mailto:info@platohedro.org?subject=Propuesta%20de%20residencia" className="mt-7 inline-flex items-center gap-2 bg-[#0051A2] px-5 py-3 font-bold text-white">Enviar propuesta <ArrowUpRight size={17} /></a></section>
  </main>;
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="border border-border bg-card p-5"><div className="mb-5 text-[#FF46A2]">{icon}</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div>; }
function Article({ title, text }: { title: string; text: string }) { return <article className="bg-white p-6"><h3 className="text-xl font-bold text-[#0051A2]">{title}</h3><p className="mt-3 text-sm text-[#003d7a]/75">{text}</p></article>; }
