export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const rawAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();

/** True when the public Supabase keys are present. Without them the site falls back to static content. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const adminEmail = rawAdminEmail;

/**
 * Compares an email against NEXT_PUBLIC_ADMIN_EMAIL.
 * NOTE: this is only a UX/route guard. The real security boundary is the
 * `is_admin()` Row Level Security function in the database.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(rawAdminEmail && email && email.trim().toLowerCase() === rawAdminEmail);
}
