import { createBrowserClient } from "@supabase/ssr";

type BrowserClientOptions = {
  detectSessionInUrl?: boolean;
};

export function createSupabaseBrowserClient(options?: BrowserClientOptions) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    options ? { auth: { detectSessionInUrl: options.detectSessionInUrl } } : undefined,
  );
}
