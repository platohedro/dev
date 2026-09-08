import { RESIDENCY_APPLICATION_EMBED_URL, RESIDENCY_APPLICATION_URL } from "@/lib/residencies";

export function ResidencyApplicationForm() {
  return (
    <div className="min-w-0 border border-[#0051A2]/20 bg-[#0051A2]/5 p-3 md:p-6">
      <iframe
        src={RESIDENCY_APPLICATION_EMBED_URL}
        title="Formulario de postulación a residencias de Platohedro"
        width="640"
        height="383"
        className="w-full border-0"
      >
        Cargando…
      </iframe>
      <a href={RESIDENCY_APPLICATION_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex bg-[#0051A2] px-6 py-3 text-sm font-bold text-white hover:bg-[#003d7a]">
        Abrir formulario de postulación ↗
      </a>
      <p className="mt-3 text-xs text-[#0051A2]/70">Se abre en una nueva pestaña.</p>
    </div>
  );
}
