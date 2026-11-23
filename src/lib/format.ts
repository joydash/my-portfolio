/** Small, client-safe formatting helpers (no Node-only imports). */

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function readingMinutes(markdown: string | null | undefined): number {
  if (!markdown) return 1;
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugifyClient(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "a, b ,c" → ["a","b","c"] (trimmed, de-duplicated, empties removed). */
export function parseList(input: string): string[] {
  return Array.from(new Set(input.split(",").map((s) => s.trim()).filter(Boolean)));
}
