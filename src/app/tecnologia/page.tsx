import type { Metadata } from "next";
import { TecnologiaPageClient } from "./TecnologiaPageClient";

export const metadata: Metadata = {
  title: "Web3Wasi | Tecnología | Platohedro",
  description: "Web3Wasi explora tecnologías digitales desde una mirada comunitaria, crítica y creativa.",
  alternates: { canonical: "/tecnologia" },
  openGraph: {
    title: "Web3Wasi | Tecnología | Platohedro",
    description: "Tecnología, aprendizaje y creación en comunidad con Platohedro.",
    url: "/tecnologia",
  },
};

export const revalidate = 3600;

export default function TecnologiaPage() {
  return <TecnologiaPageClient />;
}
