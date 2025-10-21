import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

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

type StatRow = {
  city: string;
  slug: string;
  title: string | null;
  description: string | null;
  areas_count: number;
};

type PopularItem = { area_slug: string; label: string };

type OutItem = {
  slug: string;
  title: string;
  description: string | null;
  areas_count: number;
  popular: PopularItem[];
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const diag = url.searchParams.get("__diag") === "1";

  try {
    const sb = supabaseService();

    const { data, error } = await sb
      .from("v_macro_areas_stats")
      .select("city,slug,title,description,areas_count")
      .ilike("city", CITY);

    if (error) {
      if (diag) {
        return NextResponse.json(
          { ok: false as const, where: "supabase" as const, error: error.message },
          { status: 500 }
        );
      }
      return NextResponse.json<OutItem[]>([], { status: 200 });
    }

    const rows: StatRow[] = (data ?? []) as StatRow[];

    const byPub: Record<string, OutItem> = {};

    for (const r of rows) {
      const map = DB_TO_PUBLIC[r.slug];
      if (!map) continue;

      byPub[map.pub] = {
        slug: map.pub,
        title: map.title,
        description: r.description ?? null,
        areas_count: r.areas_count ?? 0,
        popular: [] as PopularItem[], // tipato, niente any
      };
    }

    const out: OutItem[] = PUBLIC_ORDER.filter(s => !!byPub[s]).map(s => byPub[s]);

    if (diag) {
      return NextResponse.json({
        ok: true as const,
        count: out.length,
        slugs_db: rows.map(r => r.slug),
        slugs_pub: out.map(o => o.slug),
      });
    }

    return NextResponse.json(out, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (diag) {
      return NextResponse.json(
        { ok: false as const, where: "route" as const, error: msg },
        { status: 500 }
      );
    }
    return NextResponse.json<OutItem[]>([], { status: 200 });
  }
}
