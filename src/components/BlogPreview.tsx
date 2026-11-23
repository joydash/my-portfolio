import Link from "next/link";
import type { BlogListItem } from "@/lib/types";
import BlogCard from "./BlogCard";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** Homepage section: latest posts. Renders nothing until at least one post exists. */
export default function BlogPreview({ posts }: { posts: BlogListItem[] }) {
  if (posts.length === 0) return null;
  return (
    <section id="blog-preview" className="relative py-10 sm:py-14 lg:py-16">
      <div className="wrap">
        <SectionHeading
          eyebrow="Tech Blog"
          title="Notes, write-ups and industry reading"
          description="My own posts alongside a curated feed of networking, security and DevOps articles."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Reveal key={p.id} className="h-full">
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 font-semibold text-ink transition hover:bg-sky-300"
          >
            More Blogs <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
