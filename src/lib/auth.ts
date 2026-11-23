import { isAdminEmail, isSupabaseConfigured } from "./supabase/config";
import { createServerSupabase } from "./supabase/server";

/**
 * Returns the signed-in user only if they are the configured admin, otherwise null.
 * getUser() re-validates the session token with Supabase (unlike getSession()).
 */
export async function getAdminUser() {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return isAdminEmail(data.user.email) ? data.user : null;
  } catch {
    return null;
  }
}
