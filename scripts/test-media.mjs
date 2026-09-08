import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { mediaUrl } from "../src/lib/media.ts";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(path.join(root, "docs/media-manifest.json"), "utf8"));
const paths = new Set(manifest.map(asset => asset.path));
assert.equal(paths.size, manifest.length, "Media paths must be unique");
for (const asset of manifest) {
  assert.equal(mediaUrl(asset.source), asset.path, "Existing CMS URLs must use recovered files");
  assert.ok(asset.path.startsWith("/media/") && !asset.path.includes(".."));
  const data = await readFile(path.join(root, "public", asset.path));
  assert.equal(data.length, asset.bytes, asset.path);
  assert.equal(createHash("sha256").update(data).digest("hex"), asset.sha256, asset.path);
}
for (const value of ["/logos/ph.png", "https://example.org/photo.jpg", "https://backup.platohedro.org/not-recovered.jpg"]) {
  assert.equal(mediaUrl(value), value, "Unknown URLs must stay unchanged");
}
async function checkSources(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await checkSources(filename);
    else if (/\.(tsx?|css)$/.test(entry.name)) {
      const source = await readFile(filename, "utf8");
      assert.doesNotMatch(source, /https?:\/\/backup\.platohedro\.org\/wp-content\/uploads\//, filename);
      for (const [asset] of source.matchAll(/\/media\/[^"'\s)]+/g)) {
        assert.ok(paths.has(asset), `${filename}: untracked asset ${asset}`);
      }
    }
  }
}
await checkSources(path.join(root, "src"));
console.log(`Media OK: ${manifest.length} original assets verified; no archive upload dependencies.`);
