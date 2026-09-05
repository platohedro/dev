import assert from "node:assert/strict";
import { eventPeriodFilter } from "../src/lib/event-filters.ts";

const now = "2026-09-05T12:00:00.000Z";
const before = "2026-09-05T11:00:00.000Z";
const after = "2026-09-05T13:00:00.000Z";

// Evaluate the generated PostgREST expression against representative records.
function matches(filter, event) {
  const parts = filter.match(/^ends_at\.(lt|gte)\.(.+),and\(ends_at.is.null,starts_at\.(lt|gte)\.(.+)\)$/);
  assert.ok(parts, "Expected a valid end-time / null fallback expression");
  const [, endOp, endTime, startOp, startTime] = parts;
  const compare = (value, op, time) => value !== null && (op === "lt" ? value < time : value >= time);
  return compare(event.ends_at, endOp, endTime) ||
    (event.ends_at === null && compare(event.starts_at, startOp, startTime));
}

for (const [label, starts_at, ends_at, expected] of [
  ["future", after, null, "upcoming"],
  ["ongoing", before, after, "upcoming"],
  ["finished", before, before, "past"],
  ["past without end", before, null, "past"],
  ["starts now", now, null, "upcoming"],
  ["ends now", before, now, "upcoming"],
]) {
  const event = { starts_at, ends_at };
  const periods = ["upcoming", "past"].filter(period => matches(eventPeriodFilter(period, now), event));
  assert.deepEqual(periods, [expected], `${label} must appear in exactly one section`);
}
console.log("Event history: 6 classification cases passed.");
