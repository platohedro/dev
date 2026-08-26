import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmDeleteForm } from "@/app/admin/ConfirmDeleteForm";
import { deleteProduct, deleteProductImage, deleteProductMainImage, saveProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function StoreAdmin({ searchParams }: { searchParams: Promise<{ editar?: string; mensaje?: string }> }) {
  const { editar, mensaje } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <main className="p-10">Inicia sesión en <Link href="/admin">/admin</Link>.</main>;
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  if (!roles?.some(({ role }) => role === "super_admin" || role === "store_admin")) return <main className="p-10">Sin permiso.</main>;
  const { data: items } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const { data: item } = editar ? await supabase.from("products").select("*").eq("id", editar).maybeSingle() : { data: null };
  const { data: gallery } = item
    ? await supabase.from("product_images").select("id,image_url,position").eq("product_id", item.id).order("position")
    : { data: [] };
  return <main className="min-h-screen bg-background p-8 md:p-10"><div className="mx-auto max-w-4xl">
    <Link href="/admin" className="underline">← Panel</Link><h1 className="mt-4 text-3xl font-bold">{item ? "Editar producto" : "Nuevo producto"}</h1>
    {mensaje && <p className="my-4 border border-[#99CC33] p-3">{mensaje === "eliminado" ? "Producto eliminado." : "Producto guardado."}</p>}
    <form action={saveProduct} className="mt-5 grid gap-4 border p-6">
      {item && <input type="hidden" name="id" value={item.id} />}<input type="hidden" name="product_id" value={item?.id ?? ""} /><input type="hidden" name="current_image_url" value={item?.image_url ?? ""} />
      <label>Nombre<input name="name" defaultValue={item?.name ?? ""} required className="mt-1 w-full border p-3" /></label>
      <label>Descripción<textarea name="description" defaultValue={item?.description ?? ""} rows={4} className="mt-1 w-full border p-3" /></label>
      <div className="grid gap-4 md:grid-cols-4"><label>Precio COP<input name="price_cop" type="number" min="1" defaultValue={item?.price_cop ?? ""} required className="mt-1 w-full border p-3" /></label><label>Precio USD<input name="price_usd" type="number" min="0.01" step="0.01" defaultValue={item?.price_usd ?? ""} required className="mt-1 w-full border p-3" /></label><label>Tasa COP/USD<input name="exchange_rate" type="number" min="1" defaultValue={item?.exchange_rate ?? 4000} className="mt-1 w-full border p-3" /></label><label>Stock<input name="stock" type="number" min="0" defaultValue={item?.stock ?? 0} className="mt-1 w-full border p-3" /></label></div>
      <label>URL de imagen principal<input name="image_url" type="url" placeholder="https://ejemplo.org/imagen-producto.jpg" defaultValue={item?.image_url ?? ""} className="mt-1 w-full border p-3" /></label>
      {item?.image_url && <div className="flex items-center gap-3 text-sm"><a href={item.image_url} target="_blank" rel="noreferrer" className="underline">Abrir imagen principal</a><button type="submit" formAction={deleteProductMainImage} className="text-red-600 underline">Borrar imagen principal</button></div>}
      <label>URLs de fotos adicionales <span className="font-normal">(una por línea)</span><textarea name="gallery_image_urls" rows={4} placeholder="https://ejemplo.org/bolso-frente.jpg\nhttps://ejemplo.org/bolso-lateral.jpg" className="mt-1 w-full border p-3" /></label>
      <label>Agregar archivos adicionales (JPG, PNG o WebP · máximo 2 MB cada una)<input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="mt-1 block" /></label>
      {item && <div className="grid gap-3"><p className="text-sm font-semibold">Fotos actuales de la galería</p>{gallery?.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{gallery.map((image) => <div key={image.id} className="border p-2"><a href={image.image_url} target="_blank" rel="noreferrer"><img src={image.image_url} alt={`Foto adicional de ${item.name}`} className="h-28 w-full object-cover" /><span className="mt-1 block truncate text-xs underline">Abrir imagen</span></a><button type="submit" formAction={deleteProductImage.bind(null, image.id, item.id)} className="mt-2 text-xs text-red-600 underline">Borrar foto</button></div>)}</div> : <p className="text-sm text-muted-foreground">Este producto aún no tiene fotos adicionales.</p>}</div>}
      <div className="flex gap-3"><button name="publication" value="draft" className="border px-4 py-3">Guardar borrador</button><button name="publication" value="published" className="bg-[#0051A2] px-4 py-3 text-white">Publicar</button></div>
    </form>
    <h2 className="mt-10 text-2xl font-bold">Productos</h2><div className="mt-4 divide-y border">{items?.map((product) => <div key={product.id} className="flex items-center justify-between gap-4 p-4"><span>{product.name} · {product.is_published ? "Publicado" : "Borrador"}</span><div className="flex gap-4"><Link href={`/admin/tienda?editar=${product.id}`} className="underline">Editar</Link><ConfirmDeleteForm action={deleteProduct} id={product.id} message={`¿Borrar definitivamente el producto “${product.name}”? Si tiene órdenes registradas no podrá eliminarse.`} /></div></div>)}</div>
  </div></main>;
}
