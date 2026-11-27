import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./env";

/** Visitor client: no cookies, so public pages can be cached. Row Level Security limits it to published rows. */
export const publicClient = () =>
  createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 3600 } }) },
  });
