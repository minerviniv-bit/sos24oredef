// src/lib/seo/getSeoPage.ts
import { supabaseAnon } from "@/lib/supabase/server"; // o service se RLS attive

export async function getSeoPage(params: { service: string; city: string; area?: string }) {
  const sb = supabaseAnon();
  let q = sb.from("seo_pages").select("*").eq("service", params.service).eq("city", params.city).eq("status", "published").limit(1);
  if (params.area) q = q.eq("scope","area").eq("area_slug", params.area);
  else q = q.eq("scope","city").is("area_slug", null);

  const { data, error } = await q.single();
  if (error || !data) return null;
  return data;
}
