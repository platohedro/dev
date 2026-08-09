import { createClient } from "@supabase/supabase-js";

export const isSupabasePublicConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

/** Cliente sin cookies para contenido público cacheable. */
export function createSupabasePublicClient() {
  if (!isSupabasePublicConfigured) {
    throw new Error("Supabase no está configurado.");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  );
}
