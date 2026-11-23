"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { revalidatePublic } from "@/app/admin/actions";
import { useToast } from "@/components/Toast";
import { parseList } from "@/lib/format";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { ProjectRow } from "@/lib/types";
import { btnDanger, btnGhost, btnPrimary, cleanOptionalUrl, inputCls } from "./ui";

type Draft = {
  id?: string;
  title: string;
  summary: string;
  tech: string;
  live_url: string;
  github_url: string;
  image_url: string;
  featured: boolean;
};

const empty: Draft = { title: "", summary: "", tech: "", live_url: "", github_url: "", image_url: "", featured: false };

export default function ProjectsManager() {
  const toast = useToast();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await getBrowserSupabase()
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast(error.message, "error");
    else setRows((data ?? []) as ProjectRow[]);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  async function done(message: string) {
    toast(message, "success");
    await load();
    await revalidatePublic();
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const live = cleanOptionalUrl(draft.live_url);
    const gh = cleanOptionalUrl(draft.github_url);
    const img = cleanOptionalUrl(draft.image_url);
    if (live === undefined || gh === undefined || img === undefined) {
      toast("URLs must start with http:// or https://", "error");
      return;
    }
    const payload = {
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      tech_stack: parseList(draft.tech),
      live_url: live,
      github_url: gh,
      image_url: img,
      featured: draft.featured,
    };
    if (!payload.title) return toast("Title is required", "error");
    setBusy(true);
    const db = getBrowserSupabase().from("projects");
    const { error } = draft.id
      ? await db.update(payload).eq("id", draft.id)
      : await db.insert({ ...payload, display_order: (rows.at(-1)?.display_order ?? 0) + 10 });
    setBusy(false);
    if (error) return toast(error.message, "error");
    setDraft(null);
    await done(draft.id ? "Project updated" : "Project created");
  }

  async function toggleFeatured(p: ProjectRow) {
    const { error } = await getBrowserSupabase().from("projects").update({ featured: !p.featured }).eq("id", p.id);
    if (error) return toast(error.message, "error");
    await done(p.featured ? "Removed from featured" : "Marked as featured");
  }

  async function remove(p: ProjectRow) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await getBrowserSupabase().from("projects").delete().eq("id", p.id);
    if (error) return toast(error.message, "error");
    await done("Project deleted");
  }

  /** Swap with the neighbour, then renumber everything 10, 20, 30… so order is always unambiguous. */
  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[index], next[j]] = [next[j], next[index]];
    setBusy(true);
    const db = getBrowserSupabase().from("projects");
    const results = await Promise.all(
      next.map((r, i) => (r.display_order === (i + 1) * 10 ? null : db.update({ display_order: (i + 1) * 10 }).eq("id", r.id))),
    );
    setBusy(false);
    const failed = results.find((r) => r && r.error);
    if (failed?.error) return toast(failed.error.message, "error");
    await done("Order updated");
  }

  function edit(p: ProjectRow) {
    setDraft({
      id: p.id,
      title: p.title,
      summary: p.summary,
      tech: p.tech_stack.join(", "),
      live_url: p.live_url ?? "",
      github_url: p.github_url ?? "",
      image_url: p.image_url ?? "",
      featured: p.featured,
    });
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Featured projects appear on the homepage (first 4, in this order). Use the arrows to reorder.
        </p>
        <button type="button" className={btnPrimary} onClick={() => setDraft({ ...empty })}>
          New project
        </button>
      </div>

      {draft && (
        <form onSubmit={save} className="card mb-6 space-y-4 p-5">
          <h2 className="text-lg font-semibold text-fg">{draft.id ? "Edit project" : "New project"}</h2>
          <label className="block text-sm text-muted">
            Title *
            <input className={inputCls} value={draft.title} onChange={(e) => set("title", e.target.value)} required maxLength={160} />
          </label>
          <label className="block text-sm text-muted">
            Summary
            <textarea className={inputCls} rows={4} value={draft.summary} onChange={(e) => set("summary", e.target.value)} />
          </label>
          <label className="block text-sm text-muted">
            Tech stack (comma-separated)
            <input className={inputCls} value={draft.tech} onChange={(e) => set("tech", e.target.value)} placeholder="MikroTik, OSPF, VLAN" />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm text-muted">
              Live URL
              <input className={inputCls} value={draft.live_url} onChange={(e) => set("live_url", e.target.value)} placeholder="https://" />
            </label>
            <label className="block text-sm text-muted">
              GitHub URL
              <input className={inputCls} value={draft.github_url} onChange={(e) => set("github_url", e.target.value)} placeholder="https://github.com/…" />
            </label>
            <label className="block text-sm text-muted">
              Image URL
              <input className={inputCls} value={draft.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://" />
            </label>
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm text-fg">
            <input type="checkbox" className="h-5 w-5 accent-sky-400" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured on homepage
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
      ) : rows.length === 0 ? (
        <p className="card p-6 text-center text-muted">No projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((p, i) => (
            <li key={p.id} className="card flex flex-wrap items-center gap-3 p-4">
              <div className="flex flex-col">
                <button type="button" aria-label="Move up" disabled={busy || i === 0} onClick={() => move(i, -1)} className="grid h-8 w-9 place-items-center rounded text-muted hover:text-accent disabled:opacity-30">
                  ▲
                </button>
                <button type="button" aria-label="Move down" disabled={busy || i === rows.length - 1} onClick={() => move(i, 1)} className="grid h-8 w-9 place-items-center rounded text-muted hover:text-accent disabled:opacity-30">
                  ▼
                </button>
              </div>
              <div className="min-w-0 flex-1 basis-56">
                <p className="truncate font-semibold text-fg">{p.title}</p>
                <p className="truncate font-mono text-[11px] text-muted">{p.tech_stack.join(" · ") || "no tech tags"}</p>
              </div>
              <label className="flex min-h-11 items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="h-5 w-5 accent-sky-400" checked={p.featured} onChange={() => toggleFeatured(p)} />
                Featured
              </label>
              <button type="button" className={btnGhost} onClick={() => edit(p)}>
                Edit
              </button>
              <button type="button" className={btnDanger} onClick={() => remove(p)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
