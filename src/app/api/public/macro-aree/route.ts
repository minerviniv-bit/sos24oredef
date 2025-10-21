import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MacroView = { id: string; city: string; slug: string; title: string; description: string | null; areas_count: number | null; };
type AreaView  = { area_slug: string; label: string; macro_area_id: string; macro_slug: string };

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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  const sb = supabaseService();

  // ===== DIAGNOSTICA ENV/TARGET =====
  const diag: Record<string, unknown> = {
    host: url.host,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      HAS_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  // ===== PROVA CON LE VISTE (robusto + case-insensitive) =====
  const macrosQ = sb
    .from("v_macro_areas_stats")
    .select("id, city, slug, title, description, areas_count")
    .ilike("city", CITY);

  const { data: macros, error: e1, count: macrosCount } = await macrosQ;
  if (e1) console.error("[macro-aree] v_macro_areas_stats error:", e1);

  const areasQ = sb
    .from("v_areas_public")
    .select("area_slug,label,macro_area_id,macro_slug")
    .ilike("city", CITY);

  const { data: areas, error: e2, count: areasCount } = await areasQ;
  if (e2) console.error("[macro-aree] v_areas_public error:", e2);

  diag.views = {
    v_macro_areas_stats: { rows: macros?.length ?? 0, error: e1?.message ?? null },
    v_areas_public:      { rows: areas?.length ?? 0, error: e2?.message ?? null },
  };

  if (!macros?.length) {
    // fallback: prova sulle tabelle grezze (ci dice se il progetto è quello giusto)
    const t1 = await sb.from("macro_areas").select("id").ilike("city", CITY);
    const t2 = await sb.from("areas").select("id").ilike("city", CITY);
    diag.tables = {
      macro_areas: { rows: t1.data?.length ?? 0, error: t1.error?.message ?? null },
      areas:       { rows: t2.data?.length ?? 0, error: t2.error?.message ?? null },
    };
  }

  // Se debug richiesto, ritorna diagnostica pura
  if (debug) {
    return NextResponse.json({ diag }, { status: 200 });
  }

  // Se mancano proprio i macros, dai [] per non rompere la pagina, ma logga
  if (!macros?.length) {
    console.warn("[macro-aree] Nessuna macro-area trovata per city=roma", diag);
    return NextResponse.json([], { status: 200 });
  }

  // ===== AGGREGAZIONE =====
  const itemsByMacroId: Record<string, { area_slug: string; label: string }[]> = {};
  const countByMacroSlug: Record<string, number> = {};

  for (const a of (areas ?? []) as AreaView[]) {
    if (a.macro_area_id) (itemsByMacroId[a.macro_area_id] ??= []).push({ area_slug: a.area_slug, label: a.label });
    if (a.macro_slug) countByMacroSlug[a.macro_slug] = (countByMacroSlug[a.macro_slug] ?? 0) + 1;
  }

  type Out = { slug: string; title: string; description: string | null; areas_count: number; popular: { area_slug: string; label: string }[]; };
  const agg: Record<string, Out> = {};

  for (const m of macros as MacroView[]) {
    const map = DB_TO_PUBLIC[m.slug];
    if (!map) continue;

    const items = (itemsByMacroId[m.id] ?? []).sort((a, b) => a.label.localeCompare(b.label, "it"));
    const count = (m.areas_count ?? countByMacroSlug[m.slug] ?? items.length) | 0;

    if (!agg[map.pub]) {
      agg[map.pub] = { slug: map.pub, title: map.title, description: m.description ?? null, areas_count: count, popular: items.slice(0, 10) };
    } else {
      agg[map.pub].areas_count = Math.max(agg[map.pub].areas_count, count);
      const seen = new Set<string>();
      agg[map.pub].popular = [...agg[map.pub].popular, ...items]
        .filter(x => (seen.has(x.area_slug) ? false : (seen.add(x.area_slug), true)))
        .slice(0, 10);
      if (!agg[map.pub].description && m.description) agg[map.pub].description = m.description;
    }
  }

  const out = PUBLIC_ORDER.filter(s => !!agg[s]).map(s => agg[s]);

  return NextResponse.json(out, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
