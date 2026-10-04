import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_STOREFORGE_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_STOREFORGE_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_STOREFORGE_SUPABASE_URL or NEXT_PUBLIC_STOREFORGE_SUPABASE_KEY.",
    );
  }

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies; middleware refreshes them.
        }
      },
    },
  });
}
