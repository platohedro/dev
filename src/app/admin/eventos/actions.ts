"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requiredText(formData: FormData, field: string) {
  const value = formData.get(field);
  if (typeof value !== "string" || !value.trim()) throw new Error(`El campo ${field} es obligatorio.`);
  return value.trim();
}

export async function requestMagicLink(formData: FormData) {
  const email = requiredText(formData, "email");
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  const requestedNext = formData.get("next");
  const next = requestedNext === "/admin" ? "/admin" : "/admin/eventos";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${next}` },
  });
  if (error) throw new Error("No fue posible enviar el enlace de acceso.");
  redirect(`${next}?mensaje=revisa-tu-correo`);
}

export async function createEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/eventos");

  const startsAt = requiredText(formData, "starts_at");
  const endsAt = String(formData.get("ends_at") ?? "").trim();
  const title = requiredText(formData, "title");
  const isPublished = formData.get("publication") === "published";
  const slugBase = title
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    .slice(0, 80) || "evento";

  const { error } = await supabase.from("events").insert({
    slug: `${slugBase}-${crypto.randomUUID().slice(0, 8)}`,
    title,
    summary: String(formData.get("summary") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim() || null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    venue: String(formData.get("venue") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    city: String(formData.get("city") ?? "Medellín").trim() || "Medellín",
    category: String(formData.get("category") ?? "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    registration_url: String(formData.get("registration_url") ?? "").trim() || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  });

  if (error) {
    console.error("Supabase no pudo crear el evento", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    if (error.code === "42P01") {
      throw new Error("Falta crear la tabla de eventos en Supabase. Ejecuta la migración 20260806_events.sql.");
    }
    if (error.code === "42501") {
      throw new Error("Tu cuenta no tiene permiso para publicar eventos. Revisa el rol y las políticas RLS.");
    }
    throw new Error(`No fue posible guardar el evento: ${error.message}`);
  }
  revalidatePath("/eventos");
  redirect("/admin/eventos?mensaje=evento-guardado");
}

export async function updateEvent(formData: FormData) {
  const id = requiredText(formData, "id");
  const supabase = await createSupabaseServerClient();
  const title = requiredText(formData, "title");
  const startsAt = requiredText(formData, "starts_at");
  const endsAt = String(formData.get("ends_at") ?? "").trim();
  const isPublished = formData.get("publication") === "published";
  const { error } = await supabase.from("events").update({
    title,
    summary: String(formData.get("summary") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim() || null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    venue: String(formData.get("venue") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    city: String(formData.get("city") ?? "Medellín").trim() || "Medellín",
    category: String(formData.get("category") ?? "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    registration_url: String(formData.get("registration_url") ?? "").trim() || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  }).eq("id", id);
  if (error) throw new Error(`No fue posible actualizar el evento: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/eventos");
  redirect("/admin/eventos?mensaje=evento-actualizado");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin");
}
