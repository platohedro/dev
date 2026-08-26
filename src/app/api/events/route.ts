import { NextResponse } from "next/server";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";

// La consulta depende de la hora actual; una respuesta estática puede seguir
// ocultando un evento recién publicado durante varios minutos en la portada.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabasePublicConfigured) return NextResponse.json({ events: [] }, { headers: { "Cache-Control": "no-store" } });
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, slug, title, summary, content, starts_at, ends_at, venue, address, city, category, cover_image_url, registration_url")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(5);
  if (error) return NextResponse.json({ error: "No fue posible cargar los eventos." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ events: data }, { headers: { "Cache-Control": "no-store" } });
}
