"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/auth/require-admin-role";
import { residentSlug } from "@/lib/resident-slug";

function text(formData: FormData, key: string, required = false) {
  const value = String(formData.get(key) ?? "").trim();
  if (required && !value) throw new Error(`El campo ${key} es obligatorio.`);
  return value;
}

function number(formData: FormData, key: string, min: number, max: number) {
  const value = Number(text(formData, key, true));
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`El valor de ${key} no es válido.`);
  return value;
}

function residentValues(formData: FormData) {
  const isPublished = formData.get("publication") === "published";
  const country = text(formData, "country");
  const countryLat = text(formData, "country_lat");
  const countryLng = text(formData, "country_lng");
  if (isPublished && (!country || !countryLat || !countryLng)) {
    throw new Error("Para publicar un residente debes completar país, latitud y longitud.");
  }
  return {
    name: text(formData, "name", true),
    nationality: text(formData, "nationality", true),
    country: country || null,
    country_lat: countryLat ? number(formData, "country_lat", -90, 90) : null,
    country_lng: countryLng ? number(formData, "country_lng", -180, 180) : null,
    residency_year: Math.trunc(number(formData, "residency_year", 2000, 2100)),
    project: text(formData, "project") || null,
    profile_url: text(formData, "profile_url") || null,
    image_url: text(formData, "image_url") || null,
    is_published: isPublished,
  };
}

export async function saveResident(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await requireAdminRole(supabase, "is_residency_admin");
  const id = text(formData, "id");
  const values = residentValues(formData);
  const query = id ? supabase.from("residents").update(values).eq("id", id) : supabase.from("residents").insert(values);
  const { error } = await query;
  if (error) throw new Error(error.code === "42P01" ? "Falta ejecutar la migración 20260806060000_residents.sql en Supabase." : `No fue posible guardar el residente: ${error.message}`);
  revalidatePath("/residencias");
  redirect("/admin/residencias?mensaje=residente-guardado");
}

export async function deleteResident(formData: FormData) {
  const id = text(formData, "id", true);
  const supabase = await createSupabaseServerClient();
  await requireAdminRole(supabase, "is_residency_admin");
  const { data: resident } = await supabase.from("residents").select("name").eq("id", id).maybeSingle();
  if (!resident) throw new Error("No fue posible encontrar el residente para borrarlo.");
  const { error } = await supabase.from("residents").delete().eq("id", id);
  if (error) throw new Error(`No fue posible borrar el residente: ${error.message}`);
  revalidatePath("/residencias");
  revalidatePath(`/residencias/Directorio/${residentSlug(resident.name)}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/residencias?mensaje=residente-eliminado");
}
