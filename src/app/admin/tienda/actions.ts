"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveProduct(form: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/admin");
  const name = String(form.get("name") ?? "").trim(); const cop = Number(form.get("price_cop")); const usd = Number(form.get("price_usd"));
  if (!name || !Number.isSafeInteger(cop) || cop < 1 || !Number.isFinite(usd) || usd <= 0) throw new Error("Completa nombre y precios válidos.");
  let imageUrl = String(form.get("image_url") ?? "").trim() || String(form.get("current_image_url") ?? "").trim() || null;
  const galleryUrls = String(form.get("gallery_image_urls") ?? "").split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
  for (const url of galleryUrls) { try { const parsed = new URL(url); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); } catch { throw new Error("Cada URL de galería debe comenzar por http:// o https://."); } }
  const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  const uploaded: string[] = [];
  for (const file of files) { if (file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Cada imagen debe ser JPG, PNG o WebP y pesar máximo 2 MB."); const path=`${user.id}/${crypto.randomUUID()}.${file.type.split("/")[1]}`; const {error}=await supabase.storage.from("product-images").upload(path,await file.arrayBuffer(),{contentType:file.type}); if(error)throw new Error(`No fue posible subir la imagen: ${error.message}`); uploaded.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl); }
  if (uploaded[0]) imageUrl = uploaded[0];
  if (!imageUrl && galleryUrls[0]) imageUrl = galleryUrls.shift() ?? null;
  const published = form.get("publication") === "published"; const id = String(form.get("id") ?? "");
  const values = { name, description: String(form.get("description") ?? "").trim() || null, image_url: imageUrl, price_cop: cop, price_usd: usd, stock: Math.max(0, Number(form.get("stock")) || 0), is_published: published };
  const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "producto";
  const result = id ? await supabase.from("products").update({ ...values, exchange_rate: Number(form.get("exchange_rate")) || 4000 }).eq("id", id).select("id").single() : await supabase.from("products").insert({ ...values, exchange_rate: Number(form.get("exchange_rate")) || 4000, slug: `${slug}-${crypto.randomUUID().slice(0, 8)}` }).select("id").single();
  const { error } = result;
  if (error) throw new Error(`No fue posible guardar el producto: ${error.message}`);
  const additionalImages = [...uploaded.slice(1), ...galleryUrls];
  if (additionalImages.length) {
    const { data: lastImage, error: galleryError } = await supabase.from("product_images").select("position").eq("product_id", result.data.id).order("position", { ascending: false }).limit(1).maybeSingle();
    if (galleryError) throw new Error(`No fue posible leer la galería: ${galleryError.message}`);
    const nextPosition = (lastImage?.position ?? -1) + 1;
    const { error } = await supabase.from("product_images").insert(additionalImages.map((image_url, index) => ({ product_id: result.data.id, image_url, position: nextPosition + index })));
    if (error) throw new Error(`No fue posible guardar la galería: ${error.message}`);
  }
  revalidatePath("/tienda"); redirect("/admin/tienda?mensaje=guardado");
}

export async function deleteProduct(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!id) throw new Error("Producto inválido.");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(`No fue posible borrar el producto: ${error.message}`);
  revalidatePath("/tienda");
  redirect("/admin/tienda?mensaje=eliminado");
}
