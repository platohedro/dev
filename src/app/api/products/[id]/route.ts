import { NextResponse } from "next/server";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";

export const revalidate = 60;
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabasePublicConfigured) return NextResponse.json({ error: "Supabase no configurado." }, { status: 503 });
  const { id } = await params;
  const { data, error } = await createSupabasePublicClient().from("products").select("id,name,price_cop,image_url,stock").eq("id", id).eq("is_published", true).maybeSingle();
  return error || !data ? NextResponse.json({ error: "Producto no encontrado." }, { status: 404 }) : NextResponse.json(data);
}
