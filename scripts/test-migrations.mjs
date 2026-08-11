import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = path.join(root, "supabase", "migrations");
const filenames = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

assert.ok(filenames.length > 0, "No hay migraciones SQL para validar.");
assert.ok(
  filenames.every((file) => /^(\d{8}|\d{14})_[a-z0-9_]+\.sql$/.test(file)),
  "Todas las migraciones deben usar YYYYMMDD_nombre.sql o YYYYMMDDHHMMSS_nombre.sql.",
);
assert.equal(new Set(filenames).size, filenames.length, "Hay nombres de migración duplicados.");

const position = (fragment) => {
  const index = filenames.findIndex((file) => file.includes(fragment));
  assert.notEqual(index, -1, `No existe la migración esperada: ${fragment}`);
  return index;
};

const before = (first, second) => {
  assert.ok(position(first) < position(second), `${first} debe ejecutarse antes que ${second}.`);
};

before("admin_roles", "events");
before("admin_roles", "news");
before("admin_roles", "store");
before("admin_roles", "residents");
before("events.sql", "event_content");
before("events.sql", "event_admin_roles");
before("store.sql", "product_gallery");
before("product_gallery", "wompi_orders");

const sql = await Promise.all(filenames.map(async (file) => [file, await readFile(path.join(migrationsDir, file), "utf8")]));
const content = new Map(sql);
assert.match(content.get(filenames[position("event_content")]), /public\.events/);
assert.match(content.get(filenames[position("product_gallery")]), /public\.products/);
assert.match(content.get(filenames[position("product_gallery")]), /public\.is_store_admin/);

const rolesMigration = content.get(filenames[position("admin_roles")]);
assert.match(rolesMigration, /'store_admin'/);
assert.match(rolesMigration, /'residency_admin'/);
assert.match(content.get(filenames[position("store")]), /'store_admin'::public\.app_role/);
assert.match(content.get(filenames[position("residents")]), /'residency_admin'::public\.app_role/);
assert.match(rolesMigration, /revoke execute on function public\.has_role.*from public/s);
assert.match(content.get(filenames[position("store")]), /revoke execute on function public\.is_store_admin.*from public/s);
assert.match(content.get(filenames[position("residents")]), /revoke execute on function public\.is_residency_admin.*from public/s);
const residentsPolicyFix = content.get(filenames[position("fix_residents_public_policy")]);
assert.match(residentsPolicyFix, /for select to anon, authenticated\s+using \(is_published\)/s);
assert.doesNotMatch(residentsPolicyFix, /is_residency_admin/);
const residentsImport = content.get(filenames[position("import_historical_residents")]);
assert.match(residentsImport, /where not exists/s);
assert.match(residentsImport, /is_published, created_by/s);
assert.notEqual(position("performance_indexes"), -1, "Falta la migración de índices de rendimiento.");
const wompiMigration = content.get(filenames[position("wompi_orders")]);
assert.match(wompiMigration, /create table public\.orders/);
assert.match(wompiMigration, /create table public\.payment_transactions/);
assert.match(wompiMigration, /finalize_wompi_order/);
assert.match(wompiMigration, /enable row level security/);

console.log(`Migrations OK: ${filenames.length} archivos, orden y dependencias validados.`);
