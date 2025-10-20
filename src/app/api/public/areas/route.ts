import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";
export const dynamic = "force-dynamic";

const CITY = "roma" as const;

// UI -> DB
const PUBLIC_TO_DB: Record<string, string[]> = {
  "centro-prati": ["roma-centro"],
  nord:           ["roma-nord"],
  est:            ["roma-est"],
  sud:            ["roma-sud"],
  ovest:          ["roma-ovest"],
  litorale:       ["litorale", "litorale-romano"],
};

export async function GET(req: NextRequest) {
  const supa = supabaseAnon();
  const macroPublic = req.nextUrl.searchParams.get("macro") || "";

  if (!macroPublic) {
    // tutte le aree di Roma (fallback)
    const { data, error } = await supa
      .from("areas")
      .select("slug,label")
      .eq("city", CITY)
      .order("label");
    if (error || !data) return NextResponse.json([], { status: 200 });
    return NextResponse.json(
      data.map(r => ({ area_slug: r.slug, label: r.label })),
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  }

  const dbSlugs = PUBLIC_TO_DB[macroPublic] || [];
  if (!dbSlugs.length) return NextResponse.json([], { status: 200 });

  const { data, error } = await supa
    .from("areas")
    .select("slug,label,macro_slug,city")
    .eq("city", CITY)
    .in("macro_slug", dbSlugs)
    .order("label");

  if (error || !data) return NextResponse.json([], { status: 200 });

  return NextResponse.json(
    data.map(r => ({ area_slug: r.slug, label: r.label })),
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
  );
}
