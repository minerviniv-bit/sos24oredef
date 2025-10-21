// src/lib/seo/getSeoPage.ts
import { supabaseAnon } from "@/lib/supabase/client"; // ✅ factory anon

type SeoPage = {
  id: string;
  service: string;
  city: string;
  scope: "city" | "area";
  area_slug: string | null;
  status: "draft" | "published";
  // aggiungi qui altri campi se servono: title, description, ecc.
};

export async function getSeoPage(params: {
  service: string;
  city: string;
  area?: string;
}): Promise<SeoPage | null> {
  const sb = supabaseAnon(); // ✅ ora è una funzione

  let q = sb
    .from("seo_pages")
    .select("*")
    .eq("service", params.service)
    .eq("city", params.city)
    .eq("status", "published")
    .limit(1);

  if (params.area) {
    q = q.eq("scope", "area").eq("area_slug", params.area);
  } else {
    q = q.eq("scope", "city").is("area_slug", null);
  }

  const { data, error } = await q.single();

  if (error || !data) return null;
  return data as SeoPage;
}

