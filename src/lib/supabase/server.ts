// src/lib/supabase/server.ts
import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Client SSR (anon key) con cookies gestiti da Next 15.
 * cookies() ora è async, quindi serve await.
 */
export async function createClientSSR(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignora se eseguito lato server puro
          }
        },
        remove(name: string, options?: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Ignora se eseguito lato server puro
          }
        },
      },
    }
  );
}

/**
 * Client con Service Role Key — per API route e backend.
 * Usa la chiave privata (SUPABASE_SERVICE_ROLE_KEY) e non persiste la sessione.
 */
export function supabaseService(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
      global: { fetch: fetch.bind(globalThis) },
    }
  );
}

/**
 * Alias legacy — compatibilità col vecchio codice.
 * È una Promise ora, quindi: const supa = await supabaseAnon();
 */
export const supabaseAnon = createClientSSR;

