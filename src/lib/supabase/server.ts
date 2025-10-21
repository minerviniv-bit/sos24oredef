// src/lib/supabase/server.ts
import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/** ========= SSR anon (browser/SSR) ========= */
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
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options?: CookieOptions) {
          try { cookieStore.set({ name, value: "", ...options }); } catch {}
        },
      },
    }
  );
}

/** ========= Service client (API/backend) con fallback ========= */
let _svc: SupabaseClient<Database> | null = null;

export function supabaseService(): SupabaseClient<Database> {
  if (_svc) return _svc;

  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||        // preferito
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""; // fallback read-only

  if (!url || !key) {
    // Log utile in prod se mancano ENV
    console.error("[supabaseService] MISSING ENV", {
      has_url: Boolean(url),
      has_service_key: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      has_public_url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      has_public_anon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    });
  }

  // NIENTE any e niente override del fetch: usa quello globale
  _svc = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return _svc;
}

/** Alias legacy */
export const supabaseAnon = createClientSSR;
