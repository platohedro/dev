import type { Metadata } from "next";
import { TecnologiaPageClient } from "./TecnologiaPageClient";

export const metadata: Metadata = {
  title: "Tecnología | Platohedro",
  description: "Explora Web3Wasi: contenidos, educación e infraestructura para aprender y crear en comunidad con Platohedro.",
  alternates: { canonical: "/tecnologia" },
  openGraph: {
    title: "Tecnología | Platohedro",
    description: "Web3Wasi: tecnología y aprendizaje en comunidad.",
    url: "/tecnologia",
  },
};

export const revalidate = 3600;

export default function TecnologiaPage() {
  return <TecnologiaPageClient />;
}
