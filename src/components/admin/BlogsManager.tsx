"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { revalidatePublic } from "@/app/admin/actions";
import Markdown from "@/components/Markdown";
import { useToast } from "@/components/Toast";
import { formatDate, parseList, slugifyClient } from "@/lib/format";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { BLOG_LIST_COLUMNS, type BlogListItem, type BlogRow } from "@/lib/types";
import { btnDanger, btnGhost, btnPrimary, cleanOptionalUrl, inputCls } from "./ui";

type Filter = "all" | "personal" | "auto";
type Draft = {
  id?: string;
  title: string;
  slug: string;
  slugTouched: boolean;
  summary: string;
  content: string;
  cover_image: string;
  tags: string;
  published: boolean;
};

type SyncResult = { ok: boolean; inserted?: number; skipped?: number; error?: string; feeds?: { source: string; fetched: number; error?: string }[] };

const PAGE = 25;
const emptyDraft: Draft = { title: "", slug: "", slugTouched: false, summary: "", content: "", cover_image: "", tags: "", published: true };

export default function BlogsManager() {
  const toast = useToast();
  const [rows, setRows] = useState<BlogListItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(PAGE);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [sync, setSync] = useState<SyncResult | null>(null);

  const load = useCallback(async () => {
    let q = getBrowserSupabase().from("blogs").select(BLOG_LIST_COLUMNS);
    if (filter !== "all") q = q.eq("source_type", filter);
    const { data, error } = await q.order("published_at", { ascending: false }).limit(limit + 1);
    if (error) toast(error.message, "error");
    else setRows((data ?? []) as BlogListItem[]);
    setLoading(false);
  }, [filter, limit, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function done(message: string) {
    toast(message, "success");
    await load();
    await revalidatePublic();
  }

  async function runSync() {
    setSyncing(true);
    setSync(null);
    try {
      const res = await fetch("/api/sync-blogs", { method: "POST" });
      const json = (await res.json()) as SyncResult;
      setSync(json);
      if (json.ok) {
        toast(`Sync complete: ${json.inserted ?? 0} new article(s)`, "success");
        await load();
      } else toast(json.error ?? "Sync failed", "error");
    } catch {
      toast("Sync request failed", "error");
    }
    setSyncing(false);
  }

  async function edit(id: string) {
    const { data, error } = await getBrowserSupabase().from("blogs").select("*").eq("id", id).single();
    if (error || !data) return toast(error?.message ?? "Not found", "error");
    const b = data as BlogRow;
    setPreview(false);
    setDraft({
      id: b.id,
      title: b.title,
      slug: b.slug,
      slugTouched: true,
      summary: b.summary,
      content: b.content ?? "",
      cover_image: b.cover_image ?? "",
      tags: b.tags.join(", "),
      published: b.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const cover = cleanOptionalUrl(draft.cover_image);
    if (cover === undefined) return toast("Cover image must be an http(s) URL", "error");
    const slug = slugifyClient(draft.slug || draft.title);
    if (!draft.title.trim() || !slug) return toast("Title is required", "error");
    if (!draft.content.trim()) return toast("Write some content first", "error");
    const payload = {
      title: draft.title.trim(),
      slug,
      summary: draft.summary.trim(),
      content: draft.content,
      cover_image: cover,
      tags: parseList(draft.tags.toLowerCase()),
      published: draft.published,
    };
    setBusy(true);
    const db = getBrowserSupabase().from("blogs");
    const { error } = draft.id
      ? await db.update(payload).eq("id", draft.id)
      : await db.insert({ ...payload, source_type: "personal", source_name: "Joy Dash", published_at: new Date().toISOString() });
    setBusy(false);
    if (error) return toast(error.code === "23505" ? "That slug is already used" : error.message, "error");
    setDraft(null);
    await done(draft.id ? "Post updated" : "Post created");
  }

  async function togglePublished(b: BlogListItem) {
    const { error } = await getBrowserSupabase().from("blogs").update({ published: !b.published }).eq("id", b.id);
    if (error) return toast(error.message, "error");
    await done(b.published ? "Post hidden" : "Post published");
  }

  async function remove(b: BlogListItem) {
    if (!window.confirm(`Delete "${b.title}"? ${b.source_type === "auto" ? "It may be re-imported by the next sync — hide it instead to keep it away." : "This cannot be undone."}`)) return;
    const { error } = await getBrowserSupabase().from("blogs").delete().eq("id", b.id);
    if (error) return toast(error.message, "error");
    await done("Post deleted");
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const visible = rows.slice(0, limit);

  return (
    <div>
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="min-w-0 flex-1 basis-60">
          <p className="font-semibold text-fg">Tech Feed</p>
          <p className="text-sm text-muted">Pull the latest articles from the curated RSS feeds. Runs automatically every day.</p>
        </div>
        <button type="button" className={btnPrimary} onClick={runSync} disabled={syncing}>
          {syncing ? "Syncing…" : "Sync Tech Blogs Now"}
        </button>
        {sync?.feeds && (
          <ul className="basis-full space-y-0.5 font-mono text-[11px] text-muted">
            {sync.feeds.map((f) => (
              <li key={f.source} className={f.error ? "text-red-300" : undefined}>
                {f.source}: {f.error ? `error — ${f.error}` : `${f.fetched} items`}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter posts">
          {(["all", "personal", "auto"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setLimit(PAGE);
                setLoading(true);
              }}
              className={`min-h-11 rounded-lg border px-4 text-sm transition ${filter === f ? "border-accent bg-accent/10 text-accent" : "border-line text-muted hover:text-fg"}`}
            >
              {f === "all" ? "All" : f === "personal" ? "My Posts" : "Tech Feed"}
            </button>
          ))}
        </div>
        <button type="button" className={btnPrimary} onClick={() => { setPreview(false); setDraft({ ...emptyDraft }); }}>
          New post
        </button>
      </div>

      {draft && (
        <form onSubmit={save} className="card mb-6 space-y-4 p-5">
          <h2 className="text-lg font-semibold text-fg">{draft.id ? "Edit post" : "New post"}</h2>
          <label className="block text-sm text-muted">
            Title *
            <input
              className={inputCls}
              value={draft.title}
              required
              maxLength={300}
              onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value, slug: d.slugTouched ? d.slug : slugifyClient(e.target.value) } : d))}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-muted">
              Slug
              <input className={`${inputCls} font-mono`} value={draft.slug} onChange={(e) => setDraft((d) => (d ? { ...d, slug: e.target.value, slugTouched: true } : d))} />
            </label>
            <label className="block text-sm text-muted">
              Cover image URL
              <input className={inputCls} value={draft.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://" />
            </label>
          </div>
          <label className="block text-sm text-muted">
            Summary (shown on cards and in search results)
            <textarea className={inputCls} rows={2} value={draft.summary} onChange={(e) => set("summary", e.target.value)} />
          </label>
          <label className="block text-sm text-muted">
            Tags (comma-separated)
            <input className={inputCls} value={draft.tags} onChange={(e) => set("tags", e.target.value)} placeholder="mikrotik, ospf" />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Content (Markdown) *</span>
              <button type="button" className="min-h-11 px-2 text-sm text-accent" onClick={() => setPreview((v) => !v)}>
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <div className="mt-1.5 min-h-48 rounded-lg border border-line p-4">
                <Markdown>{draft.content || "_Nothing to preview yet._"}</Markdown>
              </div>
            ) : (
              <textarea className={`${inputCls} font-mono text-sm`} rows={16} value={draft.content} onChange={(e) => set("content", e.target.value)} placeholder="# Heading&#10;&#10;Write in Markdown…" />
            )}
          </div>

          <label className="flex min-h-11 items-center gap-3 text-sm text-fg">
            <input type="checkbox" className="h-5 w-5 accent-sky-400" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
            Published
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnPrimary}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button type="button" className={btnGhost} onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="card p-6 text-center text-muted">No posts.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((b) => (
            <li key={b.id} className="card flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1 basis-60">
                <p className={`truncate font-semibold ${b.published ? "text-fg" : "text-muted line-through"}`}>{b.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  {b.source_type === "personal" ? "My post" : b.source_name} · {formatDate(b.published_at)}
                  {!b.published && " · hidden"}
                </p>
              </div>
              <label className="flex min-h-11 items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="h-5 w-5 accent-sky-400" checked={b.published} onChange={() => togglePublished(b)} />
                Published
              </label>
              {b.source_type === "personal" && (
                <button type="button" className={btnGhost} onClick={() => edit(b.id)}>
                  Edit
                </button>
              )}
              <button type="button" className={btnDanger} onClick={() => remove(b)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {rows.length > limit && (
        <div className="mt-6 flex justify-center">
          <button type="button" className={btnGhost} onClick={() => setLimit((n) => n + PAGE)}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
