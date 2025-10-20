// src/app/api/admin/seo/context/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = supabaseService();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId")!;

  // Vista pubblica/privata che unisce assignments → prendiamo solo quelle del client
  const { data, error } = await supabase
    .from("v_assignments_public")
    .select("service, city, area_slug, area_label")
    .eq("client_id", clientId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // costruisci service→city→areas per UI
  const map = new Map<string, { city: string; service: string; areas: { slug: string; label: string }[] }>();
  for (const r of data) {
    const key = `${r.service}:${r.city}`;
    if (!map.has(key)) map.set(key, { service: r.service, city: r.city, areas: [] });
    if (r.area_slug) map.get(key)!.areas.push({ slug: r.area_slug, label: r.area_label || r.area_slug });
  }

  return NextResponse.json({
    sets: Array.from(map.values()),
  });
}
