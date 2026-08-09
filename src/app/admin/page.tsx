import Link from "next/link";
import { CalendarDays, FileText, ShieldCheck, ShoppingBag, MapPinned } from "lucide-react";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signInWithPassword, signOut } from "./eventos/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mensaje?: string }> }) {
  const { mensaje } = await searchParams;
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Login mensaje={mensaje} />;

  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const { data: eventAdmin } = await supabase.from("event_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  const roleNames = new Set((roles ?? []).map(({ role }) => role));
  const isSuperAdmin = roleNames.has("super_admin");
  const canManageEvents = isSuperAdmin || roleNames.has("events_admin") || Boolean(eventAdmin);
  const canManageNews = isSuperAdmin || roleNames.has("news_admin");

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div><p className="text-xs font-bold tracking-widest text-[#0051A2] uppercase">Platohedro</p><h1 className="text-4xl font-bold">Panel de administración</h1><p className="mt-2 text-sm text-muted-foreground">Sesión: {user.email}</p></div>
          <form action={signOut}><button className="border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">Cerrar sesión</button></form>
        </header>
        {!canManageEvents && !canManageNews && <p className="border border-[#FF46A2]/40 bg-[#FF46A2]/10 p-5">Tu cuenta inició sesión, pero no tiene un rol editorial asignado.</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {canManageEvents && <Link href="/admin/eventos#historial" className="group border border-border bg-card p-7 transition hover:border-[#0051A2]"><CalendarDays className="mb-5 text-[#FF46A2]" size={30} /><h2 className="text-2xl font-bold">Eventos</h2><p className="mt-2 text-sm text-muted-foreground">Crear borradores, publicar y consultar historial.</p><span className="mt-6 inline-block font-bold text-[#0051A2] group-hover:text-[#FF46A2]">Gestionar eventos →</span></Link>}
          {canManageNews && <Link href="/admin/noticias" className="group border border-border bg-card p-7 transition hover:border-[#0051A2]"><FileText className="mb-5 text-[#FF46A2]" size={30} /><h2 className="text-2xl font-bold">Noticias</h2><p className="mt-2 text-sm text-muted-foreground">Crear borradores, publicar y editar contenido editorial.</p><span className="mt-6 inline-block font-bold text-[#0051A2] group-hover:text-[#FF46A2]">Gestionar noticias →</span></Link>}
          {canManageEvents && <Link href="/admin/tienda" className="group border border-border bg-card p-7 transition hover:border-[#0051A2]"><ShoppingBag className="mb-5 text-[#FF46A2]" size={30}/><h2 className="text-2xl font-bold">Tienda</h2><p className="mt-2 text-sm text-muted-foreground">Productos, inventario, fotos y publicación.</p><span className="mt-6 inline-block font-bold text-[#0051A2]">Gestionar tienda →</span></Link>}
          {canManageEvents && <Link href="/admin/residencias" className="group border border-border bg-card p-7 transition hover:border-[#0051A2]"><MapPinned className="mb-5 text-[#FF46A2]" size={30}/><h2 className="text-2xl font-bold">Residencias</h2><p className="mt-2 text-sm text-muted-foreground">Directorio de artistas y mapa de países de origen.</p><span className="mt-6 inline-block font-bold text-[#0051A2]">Gestionar directorio →</span></Link>}
          {isSuperAdmin && <div className="border border-[#99CC33] bg-[#99CC33]/10 p-7"><ShieldCheck className="mb-5 text-[#0051A2]" size={30} /><h2 className="text-2xl font-bold">Superadministración</h2><p className="mt-2 text-sm text-muted-foreground">Tienes acceso a todos los módulos administrativos.</p></div>}
        </div>
      </div>
    </main>
  );
}

function Login({ mensaje }: { mensaje?: string }) {
  return <main className="grid min-h-screen place-items-center bg-[#003d7a] p-6 text-white"><form action={signInWithPassword} className="w-full max-w-md space-y-5 border border-white/20 bg-[#0051A2] p-8"><input type="hidden" name="next" value="/admin" /><h1 className="text-3xl font-bold">Acceso administrativo</h1><p className="text-sm text-white/75">Ingresa con el correo y la contraseña de tu cuenta administrativa.</p>{mensaje === "credenciales-invalidas" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">El correo o la contraseña no son correctos.</p>}<label className="grid gap-2 text-sm font-semibold">Correo<input name="email" type="email" autoComplete="username" required className="border border-white/30 bg-white p-3 text-[#003d7a]" /></label><label className="grid gap-2 text-sm font-semibold">Contraseña<input name="password" type="password" autoComplete="current-password" required minLength={8} className="border border-white/30 bg-white p-3 text-[#003d7a]" /></label><button className="w-full bg-[#99CC33] p-3 font-bold text-[#003d7a]">Iniciar sesión</button><Link href="/" className="block text-center text-sm underline">Volver al sitio</Link></form></main>;
}

function SetupNotice() {
  return <main className="grid min-h-screen place-items-center p-6"><div className="max-w-xl space-y-4 border border-border p-8"><h1 className="text-2xl font-bold">Falta conectar Supabase</h1><p className="text-muted-foreground">Configura las variables de Supabase para activar el acceso administrativo.</p></div></main>;
}
