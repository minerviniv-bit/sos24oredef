// src/app/api/public/macro-aree/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tipi allineati alle viste REALI
type MacroRow = {
  city: string;
  slug: string;               // macro_slug della vista
  areas_count: number | null;
};

type AreaRow = {
  area_slug: string;
  label: string;
  macro_slug: string;
};

const CITY = "roma" as const;

// Mapping slug DB → slug pubblico + titolo
const DB_TO_PUBLIC: Record<string, { pub: string; title: string }> = {
  "roma-centro": { pub: "centro-prati", title: "Roma Centro" },
  "roma-nord":   { pub: "nord",         title: "Roma Nord" },
  "roma-est":    { pub: "est",          title: "Roma Est" },
  "roma-sud":    { pub: "sud",          title: "Roma Sud" },
  "roma-ovest":  { pub: "ovest",        title: "Roma Ovest" },
  "litorale":    { pub: "litorale",     title: "Litorale Romano" },
};

const PUBLIC_ORDER = ["centro-prati", "nord", "est", "sud", "ovest", "litorale"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isDebug = url.searchParams.get("debug") === "1";

  // Diagnostica ENV del runtime (utile su Vercel con ?debug=1)
  const diag = {
    host: url.host,
    SUPABASE_URL: process.env.SUPABASE_URL ?? null,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    HAS_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    HAS_PUBLIC_ANON: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    NODE_ENV: process.env.NODE_ENV,
  };

  if (isDebug) {
    return NextResponse.json({ diag }, { status: 200 });
  }

  // Se manca l'URL effettivo → stacchiamo subito con errore chiaro
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

    // 1) Macro-aree dalla vista (solo campi che esistono davvero)
    const { data: macros, error: e1 } = await sb
      .from("v_macro_areas_stats")
      .select("city,slug,areas_count")
      .ilike("city", CITY)
      .returns<MacroRow[]>();

    if (e1) {
      console.error("[macro-aree] v_macro_areas_stats error:", e1.message);
      return NextResponse.json({ error: e1.message, diag }, { status: 500 });
    }
    if (!macros || macros.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 2) Aree (vista pubblica) raggruppate per macro_slug
    const { data: areas, error: e2 } = await sb
      .from("v_areas_public")
      .select("area_slug,label,macro_slug")
      .ilike("city", CITY)
      .returns<AreaRow[]>();

    if (e2) {
      console.error("[macro-aree] v_areas_public error:", e2.message);
      return NextResponse.json({ error: e2.message, diag }, { status: 500 });
    }

    const itemsByMacroSlug: Record<string, { area_slug: string; label: string }[]> = {};
    if (areas) {
      for (const a of areas) {
        if (!a.macro_slug) continue;
        (itemsByMacroSlug[a.macro_slug] ??= []).push({
          area_slug: a.area_slug,
          label: a.label,
        });
      }
      // ordina alfabeticamente ogni lista
      for (const k of Object.keys(itemsByMacroSlug)) {
        itemsByMacroSlug[k].sort((a, b) => a.label.localeCompare(b.label, "it"));
      }
    }

    type Out = {
      slug: string;                   // slug pubblico (centro-prati, nord, …)
      title: string;                  // titolo pubblico
      description: string | null;     // la vista non ha description → null
      areas_count: number;
      popular: { area_slug: string; label: string }[];
    };

    const agg: Record<string, Out> = {};

    for (const m of macros) {
      const map = DB_TO_PUBLIC[m.slug];
      if (!map) continue;

      const items = itemsByMacroSlug[m.slug] ?? [];
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
        // merge eventuali duplicati
        agg[map.pub].areas_count = Math.max(agg[map.pub].areas_count, count);
        const seen = new Set<string>();
        const merged = [...agg[map.pub].popular, ...items];
        agg[map.pub].popular = merged
          .filter((x) => (seen.has(x.area_slug) ? false : (seen.add(x.area_slug), true)))
          .slice(0, 10);
      }
    }

    const out = PUBLIC_ORDER.filter((s) => agg[s]).map((s) => agg[s]);

    return NextResponse.json(out, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e: unknown) {
    console.error("[macro-aree] unhandled", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, diag }, { status: 500 });
  }
}
