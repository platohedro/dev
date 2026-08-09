import { NextResponse } from "next/server";
import { createSupabasePublicClient, isSupabasePublicConfigured } from "@/lib/supabase/public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "error" | "skipped"> = {
    application: "ok",
    supabase: "skipped",
  };

  if (isSupabasePublicConfigured) {
    const { error } = await createSupabasePublicClient().from("events").select("id").limit(1);
    checks.supabase = error ? "error" : "ok";
  }

  const healthy = Object.values(checks).every((value) => value !== "error");
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", environment: process.env.NEXT_PUBLIC_APP_ENV ?? "unknown", checks, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
