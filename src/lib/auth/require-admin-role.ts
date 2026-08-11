import { redirect } from "next/navigation";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

const roleMessages = {
  is_store_admin: "No tienes permiso para administrar la tienda.",
  is_news_admin: "No tienes permiso para administrar las noticias.",
  is_residency_admin: "No tienes permiso para administrar las residencias.",
  is_event_admin: "No tienes permiso para administrar los eventos.",
} as const;

export async function requireAdminRole(
  supabase: SupabaseServerClient,
  roleFunction: keyof typeof roleMessages,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const { data: allowed, error } = await supabase.rpc(roleFunction);
  if (error || allowed !== true) throw new Error(roleMessages[roleFunction]);
  return user;
}
