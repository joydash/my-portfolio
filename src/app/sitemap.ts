import type { MetadataRoute } from "next";
import { site } from "@/data/portfolio";
import { getPersonalSlugs } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPersonalSlugs();
  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
