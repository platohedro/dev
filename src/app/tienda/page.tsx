import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TiendaPageClient } from "./TiendaPageClient";

export const dynamic = "force-dynamic";

export default async function Store() {
  const s = await createSupabaseServerClient();
  const { data: items } = await s.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
  return <TiendaPageClient items={items ?? []} />;
}
