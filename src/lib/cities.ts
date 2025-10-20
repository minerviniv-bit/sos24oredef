import "server-only";
import { createClient } from "@/lib/supabase/server";

export type CityRow = {
  id: string;
  service: string;
  slug: string;
  label: string;
  sponsor_client_id: string | null;
};

export async function loadCities(service: string): Promise<CityRow[]> {
  const s = createClient();
  const { data, error } = await s
    .from("cities")
    .select("id, service, slug, label, sponsor_client_id")
    .eq("service", service)
    .eq("is_active", true)
    .order("label", { ascending: true });

  if (error) {
    console.error("loadCities error:", error);
    return [];
  }
  return data ?? [];
}
