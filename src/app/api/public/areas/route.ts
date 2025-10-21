// src/app/api/public/areas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

const CITY = "roma" as const;

const PUBLIC_TO_DB: Record<string, string[]> = {
  "centro-prati": ["roma-centro"],
  nord: ["roma-nord"],
  est: ["roma-est"],
  sud: ["roma-sud"],
  ovest: ["roma-ovest"],
  litorale: ["litorale", "litorale-romano"],
};

export async function GET(req: NextRequest) {
  const supa = await supabaseAnon(); // factory -> sempre con le parentesi
  const macroPublic = (req.nextUrl.searchParams.get("macro") || "").trim();

  // Se non viene passato "macro", restituisco tutte le aree della città
  if (!macroPublic) {
    const { data, error } = await supa
      .from("areas")
      .select("slug,label")
      .eq("city", CITY)
      .order("label");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Narrowing esplicito per evitare "never"
    const rows = (data ?? []) as Array<{ slug: string; label: string }>;

    return NextResponse.json(
      rows.map((r) => ({ area_slug: r.slug, label: r.label })),
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  }

  // Traduzione slug pubblico -> slug DB
  const dbSlugs = PUBLIC_TO_DB[macroPublic] || [];
  if (dbSlugs.length === 0) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  }

  const { data, error } = await supa
    .from("areas")
    .select("slug,label,macro_slug,city")
    .eq("city", CITY)
    .in("macro_slug", dbSlugs)
    .order("label");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Narrowing esplicito
  const rows = (data ?? []) as Array<{
    slug: string;
    label: string;
    macro_slug: string;
    city: string;
  }>;

  return NextResponse.json(
    rows.map((r) => ({ area_slug: r.slug, label: r.label })),
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
  );
}

