"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ResidentMapItem } from "./ResidentsMap";
import Link from "next/link";
import { residentSlug } from "@/lib/resident-slug";

export function ResidentsDirectory({ residents }: { residents: ResidentMapItem[] }) {
  const { t } = useTranslation();
  const years = useMemo(() => [...new Set(residents.map(({ residency_year }) => residency_year))].sort((a, b) => b - a), [residents]);
  const [year, setYear] = useState<number | "all">(years[0] ?? "all");
  const filtered = year === "all" ? residents : residents.filter((resident) => resident.residency_year === year);
  return <section className="mt-14">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.2em] text-[#99CC33] uppercase">{t("residentsDirectory.eyebrow")}</p><h2 className="mt-2 text-4xl font-bold">{t("residentsDirectory.title")}</h2></div>{years.length > 1 && <button onClick={() => setYear("all")} className="text-sm underline">{t("residentsDirectory.viewAll")}</button>}</div>
    {years.length ? <div className="mt-7 flex flex-wrap gap-2">{years.map((item) => <button key={item} onClick={() => setYear(item)} className={year === item ? "bg-[#ff466f] px-5 py-3 font-bold text-white" : "border border-border bg-card px-5 py-3 font-bold hover:border-[#ff466f]"}>{item}</button>)}</div> : null}
    <div className="mt-6 border border-border bg-card p-6 md:p-8">
      <h3 className="border-b border-[#ff466f] pb-3 text-3xl font-bold">{year === "all" ? t("residentsDirectory.allYears") : year}</h3>
      {filtered.length ? <ul className="mt-5 grid gap-x-8 md:grid-cols-2">{filtered.sort((a, b) => a.name.localeCompare(b.name)).map((resident) => <li key={resident.id} className="border-b border-border py-3"><Link href={`/residencias/Directorio/${residentSlug(resident.name)}`} className="font-bold underline decoration-[#ff466f] underline-offset-4 hover:text-[#0051A2]">{resident.name} →</Link><p className="mt-1 text-sm text-muted-foreground">{resident.nationality} · {resident.country}{year === "all" ? ` · ${resident.residency_year}` : ""}</p></li>)}</ul> : <p className="text-muted-foreground">{t("residentsDirectory.empty")}</p>}
    </div>
  </section>;
}
