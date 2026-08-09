import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exists = async (relative) => access(path.join(root, relative));
const read = (relative) => readFile(path.join(root, relative), "utf8");

await Promise.all([
  exists("src/app/robots.ts"),
  exists("src/app/sitemap.ts"),
  exists("src/app/auth/layout.tsx"),
  exists("src/app/donacion/resultado/layout.tsx"),
  exists("src/app/noticias/page.tsx"),
  exists("src/app/noticias/[slug]/page.tsx"),
]);

const rootLayout = await read("src/app/layout.tsx");
assert.match(rootLayout, /metadataBase/);
assert.match(rootLayout, /openGraph/);
assert.match(rootLayout, /application\/ld\+json/);
assert.match(await read("src/app/robots.ts"), /sitemap\.xml/);
assert.match(await read("src/app/sitemap.ts"), /events/);
assert.match(await read("src/app/eventos/[slug]/page.tsx"), /generateMetadata/);
assert.match(await read("src/app/eventos/[slug]/page.tsx"), /application\/ld\+json/);
assert.match(await read("src/app/tienda/[slug]/page.tsx"), /generateMetadata/);
assert.match(await read("src/app/tienda/[slug]/page.tsx"), /application\/ld\+json/);
assert.match(await read("src/app/noticias/[slug]/page.tsx"), /generateMetadata/);
assert.match(await read("src/app/sitemap.ts"), /noticias/);

console.log("SEO OK: indexación, metadata, sitemap y datos estructurados validados.");
