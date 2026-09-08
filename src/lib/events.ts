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

export const EVENT_TIME_ZONE = "America/Bogota";

export function eventDateTimeInput(value: string | null | undefined) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

// Administrative event times are Colombian wall-clock times (UTC-05:00).
export function eventDateTimeToIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("La fecha y hora del evento no son válidas.");
  }
  const date = new Date(`${value}:00-05:00`);
  if (Number.isNaN(date.getTime()) || eventDateTimeInput(date.toISOString()) !== value) {
    throw new Error("La fecha y hora del evento no son válidas.");
  }
  return date.toISOString();
}

export function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: EVENT_TIME_ZONE,
  }).format(new Date(value));
}
