// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client with service role privileges.
 * This client bypasses Row Level Security (RLS) and should only be used server-side.
 *
 * ⚠️ IMPORTANT: Never expose this client to the browser or client-side code!
 * Only use in Server Actions, API Routes, or Server Components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
