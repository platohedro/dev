import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Image as ImageIcon, MapPin } from "lucide-react";
import { SiteHeader } from "@/app/components/SiteHeader";
import { absoluteUrl, seoDescription } from "@/lib/seo";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { residentSlug } from "@/lib/resident-slug";

type Resident = {
  id: string;
  name: string;
  nationality: string;
  country: string | null;
  residency_year: number;
  project: string | null;
  profile_url: string | null;
  image_url: string | null;
};

async function getResident(slug: string) {
  if (!isSupabasePublicConfigured) return null;
  const supabase = createSupabasePublicClient();
  const { data: residents } = await supabase
    .from("residents")
    .select("id, name, nationality, country, residency_year, project, profile_url")
    .eq("is_published", true);
  const resident = (residents as Omit<Resident, "image_url">[] | null)?.find((item) => residentSlug(item.name) === slug);
  if (!resident) return null;

  // La imagen es opcional para que la página siga funcionando antes de aplicar la migración nueva.
  const { data: imageData } = await supabase.from("residents").select("image_url").eq("id", resident.id).maybeSingle();
  return { ...resident, image_url: imageData?.image_url ?? null } as Resident;
}

async function getReferenceData(url: string | null) {
  if (!url) return { description: null, image: null };
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return { description: null, image: null };
    const html = await response.text();
    const value = (property: string) => html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1] || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i"))?.[1] || null;
    return { description: value("og:description") || value("description"), image: value("og:image") || value("twitter:image") };
  } catch {
    return { description: null, image: null };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ nombre: string }> }): Promise<Metadata> {
  const resident = await getResident((await params).nombre);
  if (!resident) return { title: "Residente no encontrado | Platohedro" };
  const description = seoDescription(resident.project, `${resident.name} participó en una residencia artística de Platohedro en ${resident.residency_year}.`);
  return {
    title: `${resident.name} | Directorio de residencias | Platohedro`,
    description,
    alternates: { canonical: `/residencias/Directorio/${residentSlug(resident.name)}` },
    openGraph: { title: resident.name, description, type: "profile", images: resident.image_url ? [{ url: resident.image_url, alt: resident.name }] : undefined },
  };
}

export default async function ResidentProfilePage({ params }: { params: Promise<{ nombre: string }> }) {
  const resident = await getResident((await params).nombre);
  if (!resident) notFound();
  const reference = await getReferenceData(resident.profile_url);
  const image = resident.image_url || reference.image;
  const description = resident.project && !resident.project.startsWith("Importado del directorio") ? resident.project : reference.description;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="bg-[#003d7a] px-6 py-16 text-white md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <Link href="/residencias" className="inline-flex items-center gap-2 text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"><ArrowLeft size={16} /> Volver al directorio</Link>
          <p className="mt-14 text-xs font-bold tracking-[.2em] text-[#99CC33] uppercase">Directorio de residencias</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold md:text-7xl">{resident.name}</h1>
          <p className="mt-6 text-xl text-white/80">{resident.nationality}{resident.country ? ` · ${resident.country}` : ""} · Residencia {resident.residency_year}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)] md:px-10 md:py-20">
        <article>
          <p className="text-xs font-bold tracking-[.2em] text-[#0051A2] uppercase">Sobre la residencia</p>
          <h2 className="mt-3 text-3xl font-bold">{resident.project ? "Proyecto y proceso" : "Perfil del artista"}</h2>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{description || "La información ampliada de este proceso de residencia se publicará próximamente."}</p>
          {resident.profile_url && <a href={resident.profile_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-bold text-[#0051A2] underline decoration-[#FF46A2] underline-offset-4">Ver página de referencia <ExternalLink size={16} /></a>}
        </article>
        <aside className="border border-[#0051A2]/20 bg-[#eaf4fb] p-4">
          {image ? <img src={image} alt={`Imagen de ${resident.name}`} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center bg-[#d7eafa] text-center text-[#0051A2]"><div><ImageIcon className="mx-auto mb-3" size={38} /><p className="font-bold">Imagen próximamente</p><p className="mt-1 text-sm">Este espacio está reservado para una imagen del artista o su proceso.</p></div></div>}
          <div className="mt-4 flex items-center gap-2 border-t border-[#0051A2]/15 pt-4 text-sm text-[#003d7a]"><MapPin size={16} /> {resident.country || "País por confirmar"}</div>
        </aside>
      </section>
    </main>
  );
}
