import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types"; // <-- esiste nella tua cartella

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Factory anon per uso pubblico/edge.
 * Tipizzata correttamente con il tuo Database.
 */
export function supabaseAnon(): SupabaseClient<Database> {
  return createClient<Database>(url, anon, {
    auth: { persistSession: false },
    // opzionale ma utile con Next/Edge
    global: { fetch: fetch.bind(globalThis) },
  });
}

