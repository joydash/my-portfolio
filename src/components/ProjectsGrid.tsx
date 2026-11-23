"use client";

import { useMemo, useState } from "react";
import type { ProjectRow } from "@/lib/types";
import ProjectCard from "./ProjectCard";

/** Full project list with tag / tech-stack filtering. */
export default function ProjectsGrid({ projects }: { projects: ProjectRow[] }) {
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.tech_stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [projects]);

  const visible = useMemo(
    () => (tag ? projects.filter((p) => p.tech_stack.includes(tag)) : projects),
    [projects, tag],
  );

  return (
    <>
      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={tag === null}
            className={`min-h-11 rounded-lg border px-4 text-sm font-medium transition ${
              tag === null ? "border-accent bg-accent/10 text-accent" : "border-line text-muted hover:border-accent/40 hover:text-fg"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(tag === t ? null : t)}
              aria-pressed={tag === t}
              className={`min-h-11 rounded-lg border px-3 font-mono text-xs transition ${
                tag === t ? "border-accent bg-accent/10 text-accent" : "border-line text-muted hover:border-accent/40 hover:text-fg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="card p-8 text-center text-muted">No projects yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} onTagClick={(t) => setTag(tag === t ? null : t)} activeTag={tag} />
          ))}
        </div>
      )}
    </>
  );
}
