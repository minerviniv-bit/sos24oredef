import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

const cacheHeaders = { "Cache-Control": "s-maxage=600, stale-while-revalidate=86400" };

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const service = sp.get("service")?.trim();
  const city    = sp.get("city")?.trim();
  const area    = sp.get("area")?.trim(); // opzionale

  if (!service || !city) {
    return NextResponse.json({ error: "Missing service/city" }, { status: 400 });
  }

  const supa = await supabaseAnon();

  // 1) SEO area
  if (area) {
    const { data, error } = await supa
      .from("v_seo_pages_public")
      .select("*")
      .eq("scope", "area")
      .eq("service", service)
      .eq("city", city)
      .eq("area_slug", area)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (data)  return new NextResponse(JSON.stringify(data), { status: 200, headers: cacheHeaders });
  }

  // 2) fallback città
  const { data: citySeo, error: err2 } = await supa
    .from("v_seo_pages_public")
    .select("*")
    .eq("scope", "city")
    .eq("service", service)
    .eq("city", city)
    .maybeSingle();

  if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });
  return new NextResponse(JSON.stringify(citySeo ?? {}), { status: 200, headers: cacheHeaders });
}

