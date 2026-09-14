import { permanentRedirect } from "next/navigation";

const programs = ["matinee", "ideatorio", "jaquer-escool", "amapolas", "comunidad"];

export function generateStaticParams() {
  return programs.map((programa) => ({ programa }));
}

export default async function LegacyProgramPage({ params }: { params: Promise<{ programa: string }> }) {
  const { programa } = await params;
  permanentRedirect(`/d-formacion/${programa}`);
}
