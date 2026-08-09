import { NextResponse } from "next/server";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";

export const revalidate = 300;

export async function GET() {
  if (!isSupabasePublicConfigured) return NextResponse.json({ events: [] });
  const supabase = createSupabasePublicClient();
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
