"use client";

import { useMemo, useState } from "react";
import type { BlogListItem } from "@/lib/types";
import BlogCard from "./BlogCard";

type Tab = "all" | "personal" | "auto";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "personal", label: "My Posts" },
  { id: "auto", label: "Tech Feed" },
];

const PAGE = 12;

export default function BlogList({ posts }: { posts: BlogListItem[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(
    () => (tab === "all" ? posts : posts.filter((p) => p.source_type === tab)),
    [posts, tab],
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Blog source">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setShown(PAGE);
            }}
            className={`min-h-11 rounded-lg border px-4 text-sm font-medium transition ${
              tab === t.id ? "border-accent bg-accent/10 text-accent" : "border-line text-muted hover:border-accent/40 hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="card p-8 text-center text-muted">Nothing here yet — check back soon.</p>
      ) : (
        <div role="tabpanel" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, shown).map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {filtered.length > shown && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="min-h-12 rounded-lg border border-line px-6 text-sm font-semibold text-fg transition hover:border-accent/50"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
