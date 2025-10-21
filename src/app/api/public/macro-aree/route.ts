import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";
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

// ---------- DIAGNOSTICA IN-LINE ----------
function hasValue(v?: string | null) {
  return typeof v === "string" && v.trim().length > 0;
}

async function diag() {
  const SUPABASE_URL =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const envDiag = {
    NODE_ENV: process.env.NODE_ENV ?? null,
    SUPABASE_URL: hasValue(SUPABASE_URL) ? SUPABASE_URL : null,
    HAS_SERVICE_ROLE_KEY: hasValue(SRV),
    HAS_ANON_KEY: hasValue(ANON),
  };

  const out: Record<string, unknown> = { envDiag };

  // Test rete verso REST (HEAD)
  try {
    if (hasValue(SUPABASE_URL) && hasValue(ANON)) {
      const restBase = `${SUPABASE_URL}/rest/v1`;
      const r = await fetch(restBase, {
        method: "HEAD",
        headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
        cache: "no-store",
      });
      out.restHead = { ok: r.ok, status: r.status, restBase };
    } else {
      out.restHead = { ok: false, error: "Missing URL or ANON" };
    }
  } catch (e) {
    out.restHead = { ok: false, error: String(e) };
  }

  // Test query minimale con service role via supabase-js
  try {
    const supa = supabaseService();
    const { data, error } = await supa
      .from("v_macro_areas_stats")
      .select("city,slug,areas_count")
      .ilike("city", CITY);
    out.srvQuery = {
      ok: !error,
      error: error?.message ?? null,
      count: Array.isArray(data) ? data.length : null,
    };
  } catch (e) {
    out.srvQuery = { ok: false, error: String(e) };
  }

  return NextResponse.json(out, { status: 200 });
}
// -----------------------------------------

export async function GET(req: Request) {
  // se aggiungi ?__diag=1 all’URL, esce il JSON diagnostico
  const url = new URL(req.url);
  if (url.searchParams.get("__diag") === "1") {
    return diag();
  }

  const supa = supabaseService();

  // macro_areas
  const { data: macros, error: e1 } = await supa
    .from("macro_areas")
    .select("id,slug,title,description")
    .eq("city", CITY);

  if (e1) {
    console.error("[macro-aree] macro_areas error:", e1.message);
    return NextResponse.json({ error: e1.message }, { status: 500 });
  }
  if (!macros?.length) return NextResponse.json([], { status: 200 });

  // areas
  const { data: areas, error: e2 } = await supa
    .from("areas")
    .select("slug,label,macro_area_id,macro_slug")
    .eq("city", CITY);

  if (e2) {
    console.error("[macro-aree] areas error:", e2.message);
    return NextResponse.json({ error: e2.message }, { status: 500 });
  }
  if (!areas?.length) return NextResponse.json([], { status: 200 });

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
      agg[map.pub].popular = merged
        .filter(x => (seen.has(x.area_slug) ? false : (seen.add(x.area_slug), true)))
        .slice(0, 10);
      if (!agg[map.pub].description && m.description) {
        agg[map.pub].description = m.description;
      }
    }
  }

  const out = PUBLIC_ORDER.filter(s => !!agg[s]).map(s => agg[s]);

  return NextResponse.json(out, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
