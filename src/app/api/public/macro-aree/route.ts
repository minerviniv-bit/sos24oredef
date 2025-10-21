import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CITY = "roma" as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  // === DIAGNOSTICA ENV (runtime del deployment) ===
  const diag = {
    SUPABASE_URL: process.env.SUPABASE_URL ?? null,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    HAS_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    HAS_PUBLIC_ANON: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
    host: url.host,
  };
  if (debug) return NextResponse.json({ diag });

  // Se manca l'URL → fermati e dillo chiaro
  const effectiveUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!effectiveUrl) {
    return NextResponse.json(
      { error: "NO_SUPABASE_URL", diag },
      { status: 500 }
    );
  }

  try {
    const sb = supabaseService();

    // Vista macro: campi davvero esistenti
    const { data: macros, error: e1 } = await sb
      .from("v_macro_areas_stats")
      .select("city,slug,areas_count")
      .ilike("city", CITY);

    if (e1) {
      console.error("[macro-aree] v_macro_areas_stats error:", e1.message);
      return NextResponse.json({ error: e1.message, diag }, { status: 500 });
    }
    if (!macros?.length) return NextResponse.json([], { status: 200 });

    // Vista aree
    const { data: areas, error: e2 } = await sb
      .from("v_areas_public")
      .select("area_slug,label,macro_slug")
      .ilike("city", CITY);

    if (e2) {
      console.error("[macro-aree] v_areas_public error:", e2.message);
      return NextResponse.json({ error: e2.message, diag }, { status: 500 });
    }

    // Mappa DB→pubblico
    const DB_TO_PUBLIC: Record<string, { pub: string; title: string }> = {
      "roma-centro": { pub: "centro-prati", title: "Roma Centro" },
      "roma-nord":   { pub: "nord",         title: "Roma Nord" },
      "roma-est":    { pub: "est",          title: "Roma Est" },
      "roma-sud":    { pub: "sud",          title: "Roma Sud" },
      "roma-ovest":  { pub: "ovest",        title: "Roma Ovest" },
      "litorale":    { pub: "litorale",     title: "Litorale Romano" },
    };
    const PUBLIC_ORDER = ["centro-prati", "nord", "est", "sud", "ovest", "litorale"];

    // indicizza aree per macro_slug
    const itemsByMacroSlug: Record<string, { area_slug: string; label: string }[]> = {};
    for (const a of areas ?? []) {
      if (!a.macro_slug) continue;
      (itemsByMacroSlug[a.macro_slug] ??= []).push({ area_slug: a.area_slug, label: a.label });
    }
    for (const k of Object.keys(itemsByMacroSlug)) {
      itemsByMacroSlug[k].sort((a, b) => a.label.localeCompare(b.label, "it"));
    }

    type Out = {
      slug: string; title: string; description: string | null;
      areas_count: number; popular: { area_slug: string; label: string }[];
    };
    const agg: Record<string, Out> = {};

    for (const m of macros) {
      const map = DB_TO_PUBLIC[m.slug as string];
      if (!map) continue;
      const items = itemsByMacroSlug[m.slug as string] ?? [];
      const count = (m.areas_count ?? items.length) | 0;

      if (!agg[map.pub]) {
        agg[map.pub] = {
          slug: map.pub,
          title: map.title,
          description: null,
          areas_count: count,
          popular: items.slice(0, 10),
        };
      } else {
        agg[map.pub].areas_count = Math.max(agg[map.pub].areas_count, count);
        const seen = new Set<string>();
        agg[map.pub].popular = [...agg[map.pub].popular, ...items]
          .filter(x => (seen.has(x.area_slug) ? false : (seen.add(x.area_slug), true)))
          .slice(0, 10);
      }
    }

    const out = PUBLIC_ORDER.filter(s => !!agg[s]).map(s => agg[s]);
    return NextResponse.json(out, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e: any) {
    console.error("[macro-aree] unhandled", e);
    return NextResponse.json({ error: String(e), diag }, { status: 500 });
  }
}
