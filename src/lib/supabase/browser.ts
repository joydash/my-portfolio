"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Browser client used by /admin. Writes are only accepted by the database for the admin email (RLS). */
export function getBrowserSupabase() {
  if (!client) client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
