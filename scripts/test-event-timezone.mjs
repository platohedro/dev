import assert from "node:assert/strict";
import { eventDateTimeInput, eventDateTimeToIso, formatEventDate } from "../src/lib/events.ts";

const originalZone = process.env.TZ;
try {
  for (const zone of ["UTC", "America/Bogota", "Asia/Tokyo"]) {
    process.env.TZ = zone;
    for (const [local, iso] of [
      ["2026-09-12T10:00", "2026-09-12T15:00:00.000Z"],
      ["2026-09-12T00:00", "2026-09-12T05:00:00.000Z"],
      ["2026-12-31T23:30", "2027-01-01T04:30:00.000Z"],
      ["2028-02-29T10:00", "2028-02-29T15:00:00.000Z"],
    ]) {
      assert.equal(eventDateTimeToIso(local), iso, zone);
      assert.equal(eventDateTimeInput(iso), local, zone);
      assert.equal(eventDateTimeToIso(eventDateTimeInput(iso)), iso, "Editing must preserve the instant");
    }
    assert.match(formatEventDate(eventDateTimeToIso("2026-09-12T10:00")), /10:00/);
    assert.equal(eventDateTimeInput("2026-09-12T10:00:00-05:00"), "2026-09-12T10:00");
    assert.equal(eventDateTimeInput(null), "");
    assert.equal(eventDateTimeInput(undefined), "");
    for (const invalid of ["", "2026-02-30T10:00", "2026-09-12T24:00", "2026-09-12T10:60", "2026-09-12T10:00Z"]) {
      assert.throws(() => eventDateTimeToIso(invalid), /no son válidas/);
    }
  }
} finally {
  if (originalZone === undefined) delete process.env.TZ;
  else process.env.TZ = originalZone;
}
console.log("Event timezone: creation, editing, midnight and validation passed in 3 server zones.");
