import App from "../App";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre Platohedro | Arte, tecnología y educación", description: "Conoce la historia, el equipo y la forma de trabajo de Platohedro en Medellín.", alternates: { canonical: "/about" } };

export const revalidate = 3600;

export default function AboutRoute() {
  return <App initialPage="about" />;
}
