import { projects as staticProjects } from "@/data/portfolio";
import { createPublicClient } from "./supabase/public";
import { BLOG_LIST_COLUMNS, type BlogListItem, type BlogRow, type ProjectRow } from "./types";

/**
 * Public data access (read-only, RLS-protected).
 * If Supabase is not configured — or a query fails — pages fall back to the static
 * content in src/data/portfolio.ts (projects) or an empty list (blogs), so the site never breaks.
 */

function fallbackProjects(): ProjectRow[] {
  return staticProjects.map((p, i) => ({
    id: p.id,
    title: p.title,
    summary: `${p.architecture} ${p.impact}`,
    tech_stack: p.stack,
    live_url: p.live ?? null,
    github_url: p.repo ?? null,
    image_url: p.image ?? null,
    featured: true,
    display_order: (i + 1) * 10,
    created_at: "2024-09-01T00:00:00Z",
  }));
}

export async function getProjects(): Promise<ProjectRow[]> {
  const supabase = createPublicClient();
  if (!supabase) return fallbackProjects();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProjects failed:", error.message);
    return fallbackProjects();
  }
  return (data ?? []) as ProjectRow[];
}

/** Featured projects first (in display order); if none are featured, the first `limit` projects. */
export async function getHomeProjects(limit = 4): Promise<ProjectRow[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getLatestBlogs(limit = 3): Promise<BlogListItem[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_LIST_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getLatestBlogs failed:", error.message);
    return [];
  }
  return (data ?? []) as BlogListItem[];
}

/** Everything the /blog page needs: all personal posts plus the latest synced articles. */
export async function getBlogIndex(autoLimit = 100): Promise<BlogListItem[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const [personal, auto] = await Promise.all([
    supabase
      .from("blogs")
      .select(BLOG_LIST_COLUMNS)
      .eq("published", true)
      .eq("source_type", "personal")
      .order("published_at", { ascending: false })
      .limit(200),
    supabase
      .from("blogs")
      .select(BLOG_LIST_COLUMNS)
      .eq("published", true)
      .eq("source_type", "auto")
      .order("published_at", { ascending: false })
      .limit(autoLimit),
  ]);
  if (personal.error) console.error("getBlogIndex personal failed:", personal.error.message);
  if (auto.error) console.error("getBlogIndex auto failed:", auto.error.message);
  const rows = [...((personal.data ?? []) as BlogListItem[]), ...((auto.data ?? []) as BlogListItem[])];
  return rows.sort((a, b) => b.published_at.localeCompare(a.published_at));
}

export async function getBlogBySlug(slug: string): Promise<BlogRow | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("getBlogBySlug failed:", error.message);
    return null;
  }
  return (data as BlogRow | null) ?? null;
}

export async function getPersonalSlugs(): Promise<{ slug: string; published_at: string }[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blogs")
    .select("slug,published_at")
    .eq("published", true)
    .eq("source_type", "personal");
  if (error) return [];
  return (data ?? []) as { slug: string; published_at: string }[];
}
