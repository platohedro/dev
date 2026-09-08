import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const expectedNames = ["Semilla", "Raíz", "Árbol", "Fruto", "Bosque"];
const expectedAmounts = [3, 5, 10, 20, 70];

for (const lang of ["es", "en"]) {
  const { donate } = JSON.parse(await readFile(new URL(`../src/i18n/locales/${lang}.json`, import.meta.url), "utf8"));
  assert.deepEqual(donate.tiers.items.map((tier) => tier.label), expectedNames);
  assert.deepEqual(donate.tiers.items.map((tier) => tier.amount), expectedAmounts.map((amount) => `$${amount} USD/${lang === "es" ? "mes" : "month"}`));
  assert.match(donate.tiers.custom, /COP/);
  assert.ok(donate.tiers.paymentPending);
  assert.equal(donate.impact.items.length, expectedNames.length);
  donate.impact.items.forEach((item, index) => {
    assert.ok(item.startsWith(`${expectedNames[index]} · ${donate.tiers.items[index].amount}:`));
  });
}

// Ejecutar después del build para comprobar lo que recibe el visitante.
const html = await readFile(new URL("../.next/server/app/index.html", import.meta.url), "utf8");
const section = html.match(/<section id="donate"[\s\S]*?<\/section>/)?.[0];
assert.ok(section, "La página debe incluir la sección de donaciones");
for (const name of expectedNames) assert.ok(section.includes(name), `Falta el plan ${name}`);
for (const amount of expectedAmounts) assert.ok(section.includes(`$${amount} USD/mes`));
assert.doesNotMatch(section, /autoComplete="cc-number"/i, "Un plan USD pendiente no debe pedir tarjeta");
assert.match(section, /role="status"/);
assert.doesNotMatch(section, /\$(?:50k|150k|300k|1M)/, "No deben mostrarse los montos antiguos en donaciones");
console.log("Donaciones OK: cinco planes USD, traducciones y presentación sin cobro COP de planes USD.");
