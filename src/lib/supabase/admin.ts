import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_STOREFORGE_SUPABASE_URL;
  const serviceRoleKey = process.env.STOREFORGE_SUPABASE_SERVER_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration.");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
