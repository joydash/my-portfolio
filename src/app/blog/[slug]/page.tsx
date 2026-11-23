import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Markdown from "@/components/Markdown";
import SiteShell from "@/components/SiteShell";
import { formatDate, readingMinutes } from "@/lib/format";
import { getBlogBySlug } from "@/lib/data";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.summary || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    // synced articles are someone else's content: keep them out of the index, link to the source
    robots: post.source_type === "auto" ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary || undefined,
      publishedTime: post.published_at,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();
  const isAuto = post.source_type === "auto";

  return (
    <SiteShell>
      <article className="py-10 pt-28 sm:py-14 sm:pt-32">
        <div className="wrap max-w-3xl">
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition hover:text-accent">
            <Icon name="arrow-right" className="h-4 w-4 rotate-180" /> All posts
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
            <span className={`rounded-md px-2 py-1 ${isAuto ? "bg-white/5" : "bg-accent/10 text-accent"}`}>{post.source_name}</span>
            <span>{formatDate(post.published_at)}</span>
            {!isAuto && <span>· {readingMinutes(post.content)} min read</span>}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">{post.title}</h1>

          {post.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element -- cover images come from many hosts
            <img src={post.cover_image} alt="" className="mt-8 aspect-[16/9] w-full rounded-xl border border-line object-cover" />
          )}

          {isAuto ? (
            <div className="mt-8">
              {post.summary && <p className="text-lg leading-relaxed text-fg/90">{post.summary}</p>}
              <p className="mt-4 text-sm text-muted">
                This is a summary of an article published by {post.source_name}. The full article is on their site.
              </p>
              {post.external_url && (
                <a
                  href={post.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 font-semibold text-ink transition hover:bg-sky-300"
                >
                  Read Full Article <Icon name="external" className="h-4 w-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <Markdown>{post.content ?? ""}</Markdown>
            </div>
          )}

          {post.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {post.tags.map((t) => (
                <li key={t} className="rounded border border-line px-2 py-1 font-mono text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
