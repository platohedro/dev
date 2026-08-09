import { DonationResultClient } from "./DonationResultClient";

export const dynamic = "force-dynamic";

export default async function DonationResultPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;

  return <DonationResultClient id={id} />;
}
