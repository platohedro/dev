"use client";

import dynamic from "next/dynamic";
import type { ResidentMapItem } from "./ResidentsMap";

const ResidentsMap = dynamic(() => import("./ResidentsMap").then((module) => module.ResidentsMap), {
  ssr: false,
  loading: () => <div className="grid h-[460px] place-items-center bg-[#d7eff5] text-sm text-[#003d7a]">Cargando mapa…</div>,
});

export function ResidentsMapClient({ residents }: { residents: ResidentMapItem[] }) {
  return <ResidentsMap residents={residents} />;
}
