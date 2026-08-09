import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePassword } from "../actions";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ mensaje?: string }> }) {
  const { mensaje } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/recuperar-clave?mensaje=enlace-vencido");

  return (
    <main className="grid min-h-screen place-items-center bg-[#003d7a] p-6 text-white">
      <form action={updatePassword} className="w-full max-w-md space-y-5 border border-white/20 bg-[#0051A2] p-8">
        <h1 className="text-3xl font-bold">Crear contraseña nueva</h1>
        <p className="text-sm text-white/75">La contraseña debe tener al menos ocho caracteres.</p>
        {mensaje === "clave-corta" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">La contraseña debe tener al menos ocho caracteres.</p>}
        {mensaje === "no-coinciden" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">Las contraseñas no coinciden.</p>}
        {mensaje === "no-actualizada" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">No fue posible actualizar la contraseña. Solicita otro enlace.</p>}
        <label className="grid gap-2 text-sm font-semibold">Contraseña nueva<input name="password" type="password" autoComplete="new-password" minLength={8} required className="border border-white/30 bg-white p-3 text-[#003d7a]" /></label>
        <label className="grid gap-2 text-sm font-semibold">Confirmar contraseña<input name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required className="border border-white/30 bg-white p-3 text-[#003d7a]" /></label>
        <button className="w-full bg-[#99CC33] p-3 font-bold text-[#003d7a]">Guardar contraseña</button>
        <Link href="/admin" className="block text-center text-sm underline">Cancelar</Link>
      </form>
    </main>
  );
}
