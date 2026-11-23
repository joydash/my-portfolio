import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { BlogListItem } from "@/lib/types";
import Icon from "./Icon";

/**
 * Personal posts → /blog/[slug].
 * Synced posts → open the original article in a new tab.
 * (Their /blog/[slug] page also exists, as a summary + "Read Full Article" page, for sharing/SEO.)
 */
export default function BlogCard({ post }: { post: BlogListItem }) {
  const isAuto = post.source_type === "auto";
  const inner = (
    <>
      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element -- cover images come from many hosts
        <img
          src={post.cover_image}
          alt=""
          loading="lazy"
          className="mb-4 aspect-[16/9] w-full rounded-lg border border-line object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <span
          className={`rounded-md px-2 py-1 ${isAuto ? "bg-white/5 text-muted" : "bg-accent/10 text-accent"}`}
        >
          {post.source_name}
        </span>
        <span className="text-muted">{formatDate(post.published_at)}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-fg group-hover:text-accent">
        {post.title}
        {isAuto && <Icon name="external" className="ml-1.5 inline h-3.5 w-3.5 align-[-1px] opacity-60" />}
      </h3>
      {post.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.summary}</p>}
      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((t) => (
            <li key={t} className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">
              {t}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const cls = "card card-hover group flex h-full flex-col p-5";
  return isAuto && post.external_url ? (
    <a href={post.external_url} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only"> (opens the original article in a new tab)</span>
    </a>
  ) : (
    <Link href={`/blog/${post.slug}`} className={cls}>
      {inner}
    </Link>
  );
}
