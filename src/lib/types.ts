/** Row shapes of the Supabase tables (see supabase/migrations/0001_projects_blogs.sql). */

export type ProjectRow = {
  id: string;
  title: string;
  summary: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean;
  display_order: number;
  created_at: string;
};

export type BlogSourceType = "personal" | "auto";

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  cover_image: string | null;
  tags: string[];
  source_type: BlogSourceType;
  source_name: string;
  external_url: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
};

/** Lists never need the (potentially large) Markdown body. */
export type BlogListItem = Omit<BlogRow, "content">;

export const BLOG_LIST_COLUMNS =
  "id,title,slug,summary,cover_image,tags,source_type,source_name,external_url,published,published_at,created_at";

/** A post ready to be inserted by the RSS sync. */
export type NewAutoBlog = {
  title: string;
  slug: string;
  summary: string;
  content: null;
  cover_image: string | null;
  tags: string[];
  source_type: "auto";
  source_name: string;
  external_url: string;
  published: true;
  published_at: string;
};
