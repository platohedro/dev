import manifest from "../../docs/media-manifest.json" with { type: "json" };

const recoveredMedia = new Map(manifest.map(asset => [asset.source, asset.path]));

// Existing CMS records can still contain an archive URL. Only resolve files
// actually bundled with this deployment; unrelated URLs remain unchanged.
export function mediaUrl(value: string): string {
  return recoveredMedia.get(value) ?? value;
}
