import { NextResponse } from "next/server";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";

export const revalidate = 300;

export async function GET() { if (!isSupabasePublicConfigured) return NextResponse.json({ products: [] }); const supabase = createSupabasePublicClient(); const { data, error } = await supabase.from("products").select("id,slug,name,description,image_url,price_cop,price_usd,stock").eq("is_published", true).order("created_at", { ascending: false }).limit(50); return error ? NextResponse.json({ products: [] }, { status: 500 }) : NextResponse.json({ products: data }); }
