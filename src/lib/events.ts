export type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  address: string | null;
  city: string;
  category: string | null;
  cover_image_url: string | null;
  registration_url: string | null;
};

export function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));
}
