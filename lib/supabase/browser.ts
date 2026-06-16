import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient(url?: string, anonKey?: string) {
  const resolvedUrl = url ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const resolvedAnonKey = anonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!resolvedUrl || !resolvedAnonKey) {
    return null;
  }

  return createBrowserClient(resolvedUrl, resolvedAnonKey);
}
