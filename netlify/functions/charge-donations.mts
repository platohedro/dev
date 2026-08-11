export const config = { schedule: "0 5 * * *" };

export default async function chargeDonations() {
  const siteUrl = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL;
  const cronSecret = process.env.CRON_SECRET;
  if (!siteUrl || !cronSecret) throw new Error("URL y CRON_SECRET son obligatorios para el cobro recurrente.");
  const response = await fetch(`${siteUrl.replace(/\/$/, "")}/api/cron/wompi-donations`, { method: "POST", headers: { Authorization: `Bearer ${cronSecret}` } });
  if (!response.ok) throw new Error(`El cobro recurrente falló con HTTP ${response.status}.`);
}
