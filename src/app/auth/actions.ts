"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function value(formData: FormData, field: string) {
  const result = formData.get(field);
  return typeof result === "string" ? result.trim() : "";
}

export async function requestPasswordReset(formData: FormData) {
  const email = value(formData, "email");
  if (!email) redirect("/auth/recuperar-clave?mensaje=correo-invalido");

  const requestHeaders = await headers();
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const requestOrigin = requestHeaders.get("origin")?.replace(/\/$/, "");
  const origin = configuredOrigin || requestOrigin || "http://localhost:3000";
  const supabase = await createSupabaseServerClient();

  // Se responde igual aunque la cuenta no exista para no revelar usuarios.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/restablecer-clave`,
  });
  redirect("/auth/recuperar-clave?mensaje=correo-enviado");
}

export async function updatePassword(formData: FormData) {
  const password = value(formData, "password");
  const confirmation = value(formData, "password_confirmation");

  if (password.length < 8) redirect("/auth/restablecer-clave?mensaje=clave-corta");
  if (password !== confirmation) redirect("/auth/restablecer-clave?mensaje=no-coinciden");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/recuperar-clave?mensaje=enlace-vencido");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/auth/restablecer-clave?mensaje=no-actualizada");

  await supabase.auth.signOut();
  redirect("/admin?mensaje=clave-actualizada");
}
