import type { ProjectRow } from "@/lib/types";
import Icon from "./Icon";

const linkCls =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line px-4 text-sm text-fg transition hover:border-accent/50";

export default function ProjectCard({
  project: p,
  onTagClick,
  activeTag,
}: {
  project: ProjectRow;
  onTagClick?: (tag: string) => void;
  activeTag?: string | null;
}) {
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      {p.image_url && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URLs can be on any host
        <img
          src={p.image_url}
          alt={`${p.title} screenshot`}
          loading="lazy"
          className="mb-5 aspect-video w-full rounded-lg border border-line object-cover"
        />
      )}
      <h3 className="text-lg font-semibold leading-snug text-fg">{p.title}</h3>
      {p.summary && <p className="mt-3 text-sm leading-relaxed text-muted">{p.summary}</p>}

      {p.tech_stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {p.tech_stack.map((t) => (
            <li key={t}>
              {onTagClick ? (
                <button
                  type="button"
                  onClick={() => onTagClick(t)}
                  aria-pressed={activeTag === t}
                  className={`rounded border px-1.5 py-0.5 font-mono text-[11px] transition ${
                    activeTag === t
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line bg-white/[0.03] text-muted hover:border-accent/40 hover:text-fg"
                  }`}
                >
                  {t}
                </button>
              ) : (
                <span className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {(p.live_url || p.github_url) && (
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
              Live demo <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
          {p.github_url && (
            <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={linkCls}>
              <Icon name="github" className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
        </div>
      )}
    </article>
  );
}
