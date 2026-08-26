import type { Metadata } from "next";
import { DFormacionPageClient } from "./DFormacionPageClient";

export const metadata: Metadata = {
  title: "D-Formación | Platohedro",
  description: "Conoce los procesos de D-Formación de Platohedro: Matinée, La Jaquer EsCool, Ideatorio, Amapolas y Comunidad.",
  alternates: { canonical: "/d-formacion" },
  openGraph: {
    title: "D-Formación | Platohedro",
    description: "Procesos de educación, arte y tecnología construidos con las comunidades de Platohedro.",
    url: "/d-formacion",
  },
};

export const revalidate = 3600;

export default function DFormacionPage() {
  return <DFormacionPageClient />;
}
