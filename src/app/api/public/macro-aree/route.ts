// src/app/api/public/macro-aree/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MacroRow = { id: string; slug: string; title: string; description: string | null };
type AreaRow = { slug: string; label: string; macro_area_id: string; macro_slug: string };

const CITY = "roma" as const;

const DB_TO_PUBLIC: Record<string, { pub: string; title: string }> = {
  "roma-centro": { pub: "centro-prati", title: "Roma Centro" },
  "roma-nord":   { pub: "nord",         title: "Roma Nord" },
  "roma-est":    { pub: "est",          title: "Roma Est" },
  "roma-sud":    { pub: "sud",          title: "Roma Sud" },
  "roma-ovest":  { pub: "ovest",        title: "Roma Ovest" },
  "litorale":    { pub: "litorale",     title: "Litorale Romano" },
};

const PUBLIC_ORDER = ["centro-prati", "nord", "est", "sud", "ovest", "litorale"];

export async function GET() {
  try {
    const supa = supabaseService();

    // Macro aree per città
    const { data: macros, error: e1 } = await supa
      .from("macro_areas")
      .select("id, slug, title, description")
      .eq("city", CITY);

    if (e1) {
      console.error("[macro-aree] macros error:", e1.message);
      return NextResponse.json({ error: e1.message }, { status: 500 });
    }
    if (!macros || macros.length === 0) {
      return NextResponse.json([], { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    // Aree per città
    const { data: areas, error: e2 } = await supa
      .from("areas")
      .select("slug, label, macro_area_id, macro_slug")
      .eq("city", CITY);

    if (e2) {
      console.error("[macro-aree] areas error:", e2.message);
      return NextResponse.json({ error: e2.message }, { status: 500 });
    }
    if (!areas) {
      return NextResponse.json([], { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    const itemsByMacroId: Record<string, { area_slug: string; label: string }[]> = {};
    const countByMacroSlug: Record<string, number> = {};

    for (const a of areas as AreaRow[]) {
      if (a.macro_area_id) {
        (itemsByMacroId[a.macro_area_id] ??= []).push({ area_slug: a.slug, label: a.label });
      }
      if (a.macro_slug) {
        countByMacroSlug[a.macro_slug] = (countByMacroSlug[a.macro_slug] ?? 0) + 1;
      }
    }

    type Out = {
      slug: string;
      title: string;
      description: string | null;
      areas_count: number;
      popular: { area_slug: string; label: string }[];
    };

    const agg: Record<string, Out> = {};

    for (const m of macros as MacroRow[]) {
      const map = DB_TO_PUBLIC[m.slug];
      if (!map) continue;

      const items = (itemsByMacroId[m.id] ?? []).sort((a, b) =>
        a.label.localeCompare(b.label, "it")
      );
      const count = countByMacroSlug[m.slug] ?? items.length;

      if (!agg[map.pub]) {
        agg[map.pub] = {
          slug: map.pub,
          title: map.title,
          description: m.description ?? null,
          areas_count: count,
          popular: items.slice(0, 10),
        };
      } else {
        agg[map.pub].areas_count = Math.max(agg[map.pub].areas_count, count);
        const merged = [...agg[map.pub].popular, ...items];
        const seen = new Set<string>();
        agg[map.pub].popular = merged.filter(x => {
          if (seen.has(x.area_slug)) return false;
          seen.add(x.area_slug);
          return true;
        }).slice(0, 10);
        if (!agg[map.pub].description && m.description)
          agg[map.pub].description = m.description;
      }
    }

    const out = PUBLIC_ORDER.filter(slug => !!agg[slug]).map(slug => agg[slug]);

    return NextResponse.json(out, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unexpected error";
    console.error("[macro-aree] fatal:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
