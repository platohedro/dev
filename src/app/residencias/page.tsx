import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ResidenciasPageClient } from "./ResidenciasPageClient";

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
  return <ResidenciasPageClient residents={residents} />;
}
