import { NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json({ events: [] });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, slug, title, summary, content, starts_at, ends_at, venue, address, city, category, cover_image_url, registration_url")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(5);
  if (error) return NextResponse.json({ error: "No fue posible cargar los eventos." }, { status: 500 });
  return NextResponse.json({ events: data });
}
