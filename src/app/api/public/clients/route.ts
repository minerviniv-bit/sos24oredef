import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

const cacheHeaders = { "Cache-Control": "s-maxage=300, stale-while-revalidate=86400" };

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const service = sp.get("service")?.trim();
  const city    = sp.get("city")?.trim();
  const area    = sp.get("area")?.trim();

  if (!service || !city || !area) {
    return NextResponse.json({ error: "Missing service/city/area" }, { status: 400 });
  }

  const supa = supabaseAnon();
  const { data, error } = await supa
    .from("v_assignments_public")
    .select("*")
    .eq("service", service)
    .eq("city", city)
    .eq("area_slug", area)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(JSON.stringify({ data: data ?? null }), { status: 200, headers: cacheHeaders });
}
