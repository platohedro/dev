"use client";

import { useEffect, useState } from "react";

export function ResidencyApplicationForm() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // Los gestores de contraseñas pueden insertar controles dentro de formularios
  // antes de que React hidrate. No renderizarlo en SSR evita ese desfase.
  if (!isMounted) return <div className="min-h-[34rem] border border-[#0051A2]/20 bg-[#0051A2]/5 p-6" aria-hidden="true" />;

  return (
    <form className="grid gap-5 border border-[#0051A2]/20 bg-[#0051A2]/5 p-6 md:grid-cols-2" aria-describedby="temporary-form-note">
      <label className="grid gap-2 text-sm font-bold">Nombre completo
        <input type="text" placeholder="Tu nombre" autoComplete="name" className="border border-[#0051A2]/20 bg-white p-3 font-normal outline-none focus:border-[#0051A2]" />
      </label>
      <label className="grid gap-2 text-sm font-bold">Correo electrónico
        <input type="email" placeholder="nombre@ejemplo.com" autoComplete="email" className="border border-[#0051A2]/20 bg-white p-3 font-normal outline-none focus:border-[#0051A2]" />
      </label>
      <label className="grid gap-2 text-sm font-bold">Ciudad y país
        <input type="text" placeholder="Medellín, Colombia" autoComplete="address-level2" className="border border-[#0051A2]/20 bg-white p-3 font-normal outline-none focus:border-[#0051A2]" />
      </label>
      <label className="grid gap-2 text-sm font-bold">Enlace a portafolio
        <input type="url" placeholder="https://..." className="border border-[#0051A2]/20 bg-white p-3 font-normal outline-none focus:border-[#0051A2]" />
      </label>
      <label className="grid gap-2 text-sm font-bold md:col-span-2">Cuéntanos sobre tu propuesta
        <textarea rows={6} placeholder="Describe brevemente tu interés y propuesta de residencia." className="resize-y border border-[#0051A2]/20 bg-white p-3 font-normal outline-none focus:border-[#0051A2]" />
      </label>
      <p id="temporary-form-note" className="text-xs text-[#0051A2]/70 md:col-span-2">Formulario temporal: los datos ingresados no se enviarán ni se guardarán todavía.</p>
      <button type="button" disabled className="w-fit bg-[#0051A2] px-6 py-3 text-sm font-bold text-white opacity-60 md:col-span-2">Envío próximamente</button>
    </form>
  );
}
