import Link from "next/link";
import { requestPasswordReset } from "../actions";

export default async function RecoverPasswordPage({ searchParams }: { searchParams: Promise<{ mensaje?: string }> }) {
  const { mensaje } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#003d7a] p-6 text-white">
      <form action={requestPasswordReset} className="w-full max-w-md space-y-5 border border-white/20 bg-[#0051A2] p-8">
        <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
        <p className="text-sm text-white/75">Ingresa el correo de tu cuenta. Recibirás un enlace para crear una contraseña nueva.</p>
        {mensaje === "correo-enviado" && <p className="border border-[#99CC33]/60 bg-[#99CC33]/20 p-3 text-sm">Si el correo está registrado, recibirás un enlace de recuperación.</p>}
        {mensaje === "enlace-vencido" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">El enlace venció o ya fue utilizado. Solicita uno nuevo.</p>}
        {mensaje === "correo-invalido" && <p className="border border-[#FF46A2]/50 bg-[#FF46A2]/20 p-3 text-sm">Ingresa un correo válido.</p>}
        <label className="grid gap-2 text-sm font-semibold">Correo<input name="email" type="email" autoComplete="email" required className="border border-white/30 bg-white p-3 text-[#003d7a]" /></label>
        <button className="w-full bg-[#99CC33] p-3 font-bold text-[#003d7a]">Enviar enlace</button>
        <Link href="/admin" className="block text-center text-sm underline">Volver al inicio de sesión</Link>
      </form>
    </main>
  );
}
