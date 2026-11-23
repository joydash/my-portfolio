import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

/**
 * Service-role client — BYPASSES Row Level Security.
 * Server-only: use exclusively inside API routes. Never import it from a Client Component
 * and never expose SUPABASE_SERVICE_ROLE_KEY through a NEXT_PUBLIC_ variable.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
