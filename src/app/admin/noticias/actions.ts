"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
export async function saveNews(form: FormData) {
  const supabase = await createSupabaseServerClient();
  const title = text(form, "title");
  if (!title) throw new Error("El título es obligatorio.");
  const published = form.get("publication") === "published";
  const id = text(form, "id");
  const values = { title, summary: text(form, "summary") || null, content: text(form, "content") || null, cover_image_url: text(form, "cover_image_url") || null, is_published: published, published_at: published ? new Date().toISOString() : null };
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "noticia";
  const { error } = id ? await supabase.from("news").update(values).eq("id", id) : await supabase.from("news").insert({ ...values, slug: `${slug}-${crypto.randomUUID().slice(0, 8)}` });
  if (error) throw new Error(`No fue posible guardar la noticia: ${error.message}`);
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias?mensaje=guardada");
}
