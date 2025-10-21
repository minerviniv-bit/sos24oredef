// src/lib/supabase/server.ts
import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/** ========= SSR anon (browser/SSR) ========= */
export async function createClientSSR(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";

  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        try { cookieStore.set({ name, value, ...options }); } catch {}
      },
      remove(name: string, options?: CookieOptions) {
        try { cookieStore.set({ name, value: "", ...options }); } catch {}
      },
    },
  });
}

/** ========= Service client (API/backend) — NO fallback ========= */
export function supabaseService(): SupabaseClient<Database> {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceKey) {
    // fallisci rumorosamente: così lo vedi nei log del deployment
    throw new Error(
      `[supabaseService] Missing ENV — url:${Boolean(url)} serviceKey:${Boolean(serviceKey)}`
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // su Vercel/Node 18 è opzionale, ma safer
    global: { fetch: fetch.bind(globalThis) },
  });
}

/** Alias legacy */
export const supabaseAnon = createClientSSR;
