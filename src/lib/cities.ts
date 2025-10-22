// src/lib/cities.ts
import "server-only";
import { createClientSSR } from "@/lib/supabase/server";

export type CityRow = {
  id: string;
  name: string;
  region?: string | null;
  country?: string | null;
  slug?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export async function getCities(): Promise<CityRow[]> {
  const supa = await createClientSSR(); // <-- mantiene await

  const { data, error } = await supa
    .from("cities")
    .select("id, name, region, country, slug, lat, lng")
    .order("name")
    .returns<CityRow[]>();

  if (error) {
    console.error("[getCities] Supabase:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCityBySlug(slug: string): Promise<CityRow | null> {
  const supa = await createClientSSR(); // <-- mantiene await

  const { data, error } = await supa
    .from("cities")
    .select("id, name, region, country, slug, lat, lng")
    .eq("slug", slug)
    .single()
    .returns<CityRow>();

  if (error) {
    console.error(`[getCityBySlug:${slug}] Supabase:`, error.message);
    return null;
  }
  return data;
}
