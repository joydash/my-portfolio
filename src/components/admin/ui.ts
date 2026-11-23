export const inputCls =
  "mt-1.5 block min-h-11 w-full rounded-lg border border-line bg-white/[0.03] px-3 py-2 text-fg outline-none transition focus:border-accent";
export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-ink transition hover:bg-sky-300 disabled:opacity-60";
export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm text-fg transition hover:border-accent/50 disabled:opacity-50";
export const btnDanger =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50";

/** Empty string → null; keeps only http(s) URLs (blocks javascript: etc). */
export function cleanOptionalUrl(v: string): string | null | undefined {
  const t = v.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}
