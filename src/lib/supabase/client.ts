import { createClient } from "@supabase/supabase-js";

// Legge prima le server-side, altrimenti le NEXT_PUBLIC_ (che hai nel .env.local)
const url  = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

export const supabaseAnon = () =>
  createClient(url, anon, { auth: { persistSession: false } });
