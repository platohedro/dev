/** Keep ongoing events in the agenda until their end time. */
export function eventPeriodFilter(period: "upcoming" | "past", now: string) {
  const operator = period === "past" ? "lt" : "gte";
  return `ends_at.${operator}.${now},and(ends_at.is.null,starts_at.${operator}.${now})`;
}
