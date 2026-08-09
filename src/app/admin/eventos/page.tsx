import Link from "next/link";
import type { InputHTMLAttributes } from "react";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createEvent, signInWithPassword, signOut, updateEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventosPage({ searchParams }: { searchParams: Promise<{ mensaje?: string; editar?: string }> }) {
  const { mensaje, editar } = await searchParams;
  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: eventAdmin } = user
    ? await supabase.from("event_admins").select("user_id").eq("user_id", user.id).maybeSingle()
    : { data: null };
  const { data: roles } = user
    ? await supabase.from("user_roles").select("role").eq("user_id", user.id)
    : { data: [] };
  const canManageEvents = Boolean(eventAdmin) || roles?.some(({ role }) => role === "super_admin" || role === "events_admin");
  const { data: eventHistory } = user && canManageEvents
    ? await supabase.from("events").select("id, slug, title, starts_at, is_published, created_at").order("created_at", { ascending: false }).limit(50)
    : { data: [] };
  const { data: editingEvent } = editar && canManageEvents
    ? await supabase.from("events").select("*").eq("id", editar).maybeSingle()
    : { data: null };

  if (!user) return <Login mensaje={mensaje} />;
  if (!canManageEvents) return <Forbidden email={user.email ?? ""} />;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div><p className="text-xs font-bold tracking-widest text-[#0051A2] uppercase">Administración</p><h1 className="text-3xl font-bold">{editingEvent ? "Editar evento" : "Nuevo evento"}</h1></div>
          <div className="flex gap-4"><Link href="/admin" className="text-sm underline">Panel</Link><form action={signOut}><button className="text-sm underline">Cerrar sesión</button></form></div>
        </div>
        {(mensaje === "evento-guardado" || mensaje === "evento-actualizado") && <p className="mb-5 border border-[#99CC33] bg-[#99CC33]/15 p-4 text-sm">Evento guardado correctamente.</p>}
        <form action={editingEvent ? updateEvent : createEvent} className="grid gap-5 rounded-lg border border-border bg-card p-6 shadow-sm">
          {editingEvent && <input type="hidden" name="id" value={editingEvent.id} />}
          <Field name="title" label="Título" required defaultValue={editingEvent?.title ?? ""} />
          <label className="grid gap-2 text-sm font-semibold">Descripción breve<textarea name="summary" rows={4} defaultValue={editingEvent?.summary ?? ""} className="border border-border bg-background p-3 font-normal" /></label>
          <label className="grid gap-2 text-sm font-semibold">Información completa<textarea name="content" rows={8} defaultValue={editingEvent?.content ?? ""} className="border border-border bg-background p-3 font-normal" placeholder="Programa, participantes, accesibilidad, recomendaciones…" /></label>
          <div className="grid gap-5 md:grid-cols-2"><Field name="starts_at" label="Inicio" type="datetime-local" required defaultValue={editingEvent?.starts_at?.slice(0, 16)} /><Field name="ends_at" label="Finalización" type="datetime-local" defaultValue={editingEvent?.ends_at?.slice(0, 16) ?? ""} /></div>
          <div className="grid gap-5 md:grid-cols-2"><Field name="venue" label="Lugar" defaultValue={editingEvent?.venue ?? ""} /><Field name="address" label="Dirección" defaultValue={editingEvent?.address ?? ""} /></div>
          <div className="grid gap-5 md:grid-cols-2"><Field name="city" label="Ciudad" defaultValue={editingEvent?.city ?? "Medellín"} /><Field name="category" label="Categoría" placeholder="Taller, exposición…" defaultValue={editingEvent?.category ?? ""} /></div>
          <Field name="cover_image_url" label="URL de imagen de portada" type="url" defaultValue={editingEvent?.cover_image_url ?? ""} />
          <Field name="registration_url" label="URL de inscripción (opcional)" type="url" defaultValue={editingEvent?.registration_url ?? ""} />
          <div className="flex flex-wrap gap-3"><button name="publication" value="draft" className="border border-[#0051A2] px-5 py-3 font-bold text-[#0051A2] hover:bg-[#0051A2] hover:text-white">Guardar borrador</button><button name="publication" value="published" className="bg-[#0051A2] px-5 py-3 font-bold text-white hover:bg-[#FF46A2]">Publicar evento</button>{editingEvent && <Link href="/admin/eventos" className="px-5 py-3 text-sm underline">Cancelar</Link>}</div>
        </form>
        <section id="historial" className="mt-12"><h2 className="mb-5 text-2xl font-bold">Historial de eventos</h2>
          {eventHistory?.length ? <div className="divide-y border border-border">{eventHistory.map((event) => <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-bold">{event.title}</p><p className="text-xs text-muted-foreground">{new Date(event.starts_at).toLocaleString("es-CO")}</p></div><div className="flex items-center gap-4"><span className={event.is_published ? "text-xs font-bold text-[#0051A2]" : "text-xs font-bold text-[#FF46A2]"}>{event.is_published ? "Publicado" : "Borrador"}</span><Link href={`/admin/eventos?editar=${event.id}`} className="text-sm underline">Editar</Link>{event.is_published && <Link href={`/eventos/${event.slug}`} className="text-sm underline">Ver</Link>}</div></div>)}</div> : <p className="border border-border p-5 text-sm text-muted-foreground">Aún no se han creado eventos.</p>}
        </section>
      </div>
    </main>
  );
}

function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input {...props} className="border border-border bg-background p-3 font-normal" /></label>;
}

function Login({ mensaje }: { mensaje?: string }) {
  return <main className="grid min-h-screen place-items-center bg-[#003d7a] p-6 text-white"><form action={signInWithPassword} className="w-full max-w-md space-y-5 border border-white/20 bg-[#0051A2] p-8"><input type="hidden" name="next" value="/admin/eventos" /><h1 className="text-3xl font-bold">Acceso a eventos</h1><p className="text-sm text-white/75">Ingresa con tu correo y contraseña.</p>{mensaje === "credenciales-invalidas" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">El correo o la contraseña no son correctos.</p>}<Field name="email" label="Correo" type="email" required /><Field name="password" label="Contraseña" type="password" required /><button className="w-full bg-[#99CC33] p-3 font-bold text-[#003d7a]">Iniciar sesión</button><Link href="/auth/recuperar-clave" className="block text-center text-sm underline">¿Olvidaste tu contraseña?</Link><Link href="/eventos" className="block text-center text-sm underline">Ver agenda pública</Link></form></main>;
}

function Forbidden({ email }: { email: string }) {
  return <main className="grid min-h-screen place-items-center p-6"><div className="max-w-md space-y-4 border border-border p-8"><h1 className="text-2xl font-bold">Acceso pendiente</h1><p className="text-muted-foreground">La cuenta {email} inició sesión, pero aún no tiene permisos de comunicaciones. Pide a administración que la agregue como gestora de eventos.</p><Link href="/" className="underline">Volver al inicio</Link></div></main>;
}

function SetupNotice() {
  return <main className="grid min-h-screen place-items-center p-6"><div className="max-w-xl space-y-4 border border-border p-8"><h1 className="text-2xl font-bold">Configura Supabase para activar el panel</h1><p className="text-muted-foreground">Agrega las variables de Supabase y ejecuta la migración incluida en el repositorio. No hay credenciales configuradas todavía.</p></div></main>;
}
