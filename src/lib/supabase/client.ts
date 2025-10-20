// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

// 🔹 Priorità: usa prima le variabili server-side, poi quelle pubbliche (NEXT_PUBLIC_)
const url =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

/**
 * Client Supabase anonimo per chiamate lato pubblico (API pubbliche / pagine)
 * Non salva sessioni e non usa cookies → ideale per Next.js App Router.
 */
export const supabaseAnon = () =>
  createClient(url, anon, {
    auth: { persistSession: false },
    global: { fetch: fetch.bind(globalThis) },
  });
