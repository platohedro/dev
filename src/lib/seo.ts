export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://platohedro.org").replace(/\/$/, "");

export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${siteUrl}/`).toString();
}

export function seoDescription(value: string | null | undefined, fallback: string) {
  const text = (value || fallback).replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
