import { XMLParser } from "fast-xml-parser";
import type { FeedSource } from "./feeds";
import type { NewAutoBlog } from "./types";
import { decodeEntities, shortHash, slugify, stripHtml, truncate } from "./text";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  // Dev.to feeds contain >1000 entities (default limit). Feed URLs are fixed and trusted, so a higher cap is safe.
  processEntities: { enabled: true, maxTotalExpansions: 10_000 },
  trimValues: true,
});

type Node = Record<string, unknown> | string | number | undefined | null;

type FeedDoc = {
  rss?: { channel?: { item?: Record<string, unknown> | Record<string, unknown>[] } };
  feed?: { entry?: Record<string, unknown> | Record<string, unknown>[] };
  "rdf:RDF"?: { item?: Record<string, unknown> | Record<string, unknown>[] };
};

const arr = <T>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

/** Reads text from a parsed XML node (plain string, {#text}, or CDATA-wrapped). */
function text(node: Node): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  const t = (node as Record<string, unknown>)["#text"];
  return t == null ? "" : String(t);
}

/** Removes tracking params and fragments so the same article always yields the same URL. */
export function cleanUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    [...u.searchParams.keys()].forEach((k) => {
      if (/^(utm_|fbclid|gclid|mc_|ref$|source$)/i.test(k)) u.searchParams.delete(k);
    });
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

function atomLink(links: Node): string {
  const list = arr<Node>(links as Node | Node[]);
  const pick =
    list.find((l) => typeof l === "object" && l && (l as Record<string, string>)["@_rel"] === "alternate") ??
    list.find((l) => typeof l === "object" && l && !(l as Record<string, string>)["@_rel"]) ??
    list[0];
  if (typeof pick === "string") return pick;
  if (pick && typeof pick === "object") return String((pick as Record<string, unknown>)["@_href"] ?? "");
  return "";
}

function firstImage(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!m) return null;
  const src = decodeEntities(m[1]);
  return /^https:\/\//i.test(src) ? src : null;
}

function mediaImage(item: Record<string, unknown>): string | null {
  const candidates: Node[] = [
    ...arr<Node>(item["media:thumbnail"] as Node | Node[]),
    ...arr<Node>(item["media:content"] as Node | Node[]),
    ...arr<Node>(item["enclosure"] as Node | Node[]),
  ];
  for (const c of candidates) {
    if (c && typeof c === "object") {
      const o = c as Record<string, string>;
      const url = o["@_url"];
      const type = o["@_type"] ?? "";
      if (url && /^https:\/\//i.test(url) && (!type || type.startsWith("image/"))) return url;
    }
  }
  return null;
}

function toIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  // never allow dates in the future
  return (d.getTime() > Date.now() ? new Date() : d).toISOString();
}

export function parseFeed(xml: string, source: FeedSource): NewAutoBlog[] {
  const doc = parser.parse(xml) as FeedDoc;
  const rssItems = arr(doc?.rss?.channel?.item);
  const atomEntries = arr(doc?.feed?.entry);
  const rdfItems = arr(doc?.["rdf:RDF"]?.item);
  const limit = source.limit ?? 8;
  const out: NewAutoBlog[] = [];

  for (const item of [...rssItems, ...rdfItems, ...atomEntries]) {
    const title = decodeEntities(stripHtml(text(item.title as Node)));
    const rawLink = typeof item.link === "string" ? item.link : atomLink(item.link as Node);
    const url = cleanUrl(rawLink) ?? cleanUrl(text(item.guid as Node));
    if (!title || !url) continue;

    const html =
      text(item["content:encoded"] as Node) ||
      text(item.description as Node) ||
      text(item.summary as Node) ||
      text(item.content as Node);
    const summary = truncate(stripHtml(html), 280);
    const published =
      toIso(text(item.pubDate as Node)) ??
      toIso(text(item.published as Node)) ??
      toIso(text(item.updated as Node)) ??
      toIso(text(item["dc:date"] as Node)) ??
      new Date().toISOString();

    out.push({
      title: truncate(title, 300),
      slug: `${slugify(title).slice(0, 80).replace(/-+$/, "") || "post"}-${shortHash(url)}`,
      summary,
      content: null,
      cover_image: mediaImage(item) ?? firstImage(html),
      tags: source.tags,
      source_type: "auto",
      source_name: source.name,
      external_url: url,
      published: true,
      published_at: published,
    });
    if (out.length >= limit) break;
  }
  return out;
}

export type FeedResult = { source: string; fetched: number; error?: string };

export async function fetchFeed(source: FeedSource): Promise<{ items: NewAutoBlog[]; result: FeedResult }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "joydash.me-feed-sync/1.0 (+https://joydash.me)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseFeed(xml, source);
    return { items, result: { source: source.name, fetched: items.length } };
  } catch (e) {
    const msg = e instanceof Error ? (e.name === "AbortError" ? "timeout" : e.message) : "failed";
    return { items: [], result: { source: source.name, fetched: 0, error: msg } };
  } finally {
    clearTimeout(timer);
  }
}
