import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";
import { ResidenciasPageClient } from "./ResidenciasPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Residencias artísticas | Platohedro", description: "Conoce las residencias artísticas, sus participantes y procesos de intercambio en Platohedro.", alternates: { canonical: "/residencias" } };

export const revalidate = 300;

type Resident = {
  id: string; name: string; nationality: string; country: string;
  country_lat: number; country_lng: number; residency_year: number; profile_url?: string | null;
};

export default async function ResidenciasPage() {
  let residents: Resident[] = [];
  if (isSupabasePublicConfigured) {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase.from("residents").select("id, name, nationality, country, country_lat, country_lng, residency_year, profile_url").eq("is_published", true).order("residency_year", { ascending: false });
    residents = (data ?? []) as Resident[];
  }
  return <ResidenciasPageClient residents={residents} />;
}
