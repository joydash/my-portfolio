import type { Metadata } from "next";
import BlogList from "@/components/BlogList";
import SectionHeading from "@/components/SectionHeading";
import SiteShell from "@/components/SiteShell";
import { getBlogIndex } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tech Blog",
  description: "Posts by Joy Dash plus a curated feed of networking, cybersecurity and DevOps articles.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogIndex();
  return (
    <SiteShell>
      <section className="py-10 pt-28 sm:py-14 sm:pt-32">
        <div className="wrap">
          <SectionHeading
            eyebrow="Tech Blog"
            title="Posts & tech feed"
            description="My Posts are written by me. Tech Feed items are auto-collected headlines that link to the original publisher."
          />
          <BlogList posts={posts} />
        </div>
      </section>
    </SiteShell>
  );
}
