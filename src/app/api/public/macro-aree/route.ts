import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

const CITY = "roma" as const;
const REGION = process.env.VERCEL_REGION ?? "unknown";

const DB_TO_PUBLIC: Record<string, { pub: string; title: string }> = {
  "roma-centro": { pub: "centro-prati", title: "Roma Centro" },
  "roma-nord":   { pub: "nord",         title: "Roma Nord" },
  "roma-est":    { pub: "est",          title: "Roma Est" },
  "roma-sud":    { pub: "sud",          title: "Roma Sud" },
  "roma-ovest":  { pub: "ovest",        title: "Roma Ovest" },
  "litorale":    { pub: "litorale",     title: "Litorale Romano" },
};

const PUBLIC_ORDER = ["centro-prati", "nord", "est", "sud", "ovest", "litorale"];

type PopularItem = { area_slug: string; label: string };

type StatRow = {
  city: string;
  slug: string;                // es. "roma-centro"
  title: string | null;
  areas_count: number;
  popular: PopularItem[] | null; // array JSON o null (come da view)
};

type OutItem = {
  slug: string;                // slug pubblico (es. "centro-prati")
  title: string;               // titolo pubblico
  description: string | null;  // la view non ha description -> null
  areas_count: number;
  popular: PopularItem[];
};

// ---- helpers diag -----------------------------------------------------------
function hasValue(v?: string | null) {
  return typeof v === "string" && v.trim().length > 0;
}

async function head(url: string) {
  try {
    const r = await fetch(url, { method: "HEAD", cache: "no-store" });
    return { url, ok: r.ok, status: r.status };
  } catch (e) {
    return { url, ok: false, err: String(e) };
  }
}
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  const url = new URL(req.url);
  const diag = url.searchParams.get("__diag") === "1";

  const SUPABASE_URL =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Se diagnostica: pingo rete + provo query
  if (diag) {
    const net = {
      region: REGION,
      runtime,
      google: await head("https://google.com"),
      supabase_root: hasValue(SUPABASE_URL) ? await head(SUPABASE_URL) : { url: "SUPABASE_URL", ok: false, err: "missing" },
      supabase_rest: hasValue(SUPABASE_URL) ? await head(`${SUPABASE_URL}/rest/v1`) : { url: "SUPABASE_URL/rest/v1", ok: false, err: "missing" },
    };

    try {
      const sb = supabaseService();
      const { data, error } = await sb
        .from("v_macro_areas_stats")
        .select("city,slug,title,areas_count,popular")
        .ilike("city", CITY);

      if (error) {
        return NextResponse.json({
          ok: false as const,
          where: "supabase" as const,
          error: error.message,
          env: {
            NODE_ENV: process.env.NODE_ENV ?? null,
            HAS_URL: hasValue(SUPABASE_URL),
            HAS_SRV: hasValue(SRV),
            HAS_ANON: hasValue(ANON),
          },
          net,
        }, { status: 200 });
      }

      const rows: StatRow[] = (data ?? []) as StatRow[];
      const slugs_db = rows.map(r => r.slug);

      const mapped = new Set<string>();
      for (const r of rows) {
        const map = DB_TO_PUBLIC[r.slug];
        if (map) mapped.add(map.pub);
      }
      const slugs_pub = Array.from(mapped);

      return NextResponse.json({
        ok: true as const,
        region: REGION,
        count: rows.length,
        slugs_db,
        slugs_pub,
        net,
      }, { status: 200 });
    } catch (e) {
      return NextResponse.json({
        ok: false as const,
        where: "route" as const,
        error: e instanceof Error ? e.message : String(e),
        env: {
          NODE_ENV: process.env.NODE_ENV ?? null,
          HAS_URL: hasValue(SUPABASE_URL),
          HAS_SRV: hasValue(SRV),
          HAS_ANON: hasValue(ANON),
        },
        net,
      }, { status: 200 });
    }
  }

  // ---- normale: API prod ----------------------------------------------------
  try {
    const sb = supabaseService();

    const { data, error } = await sb
      .from("v_macro_areas_stats")
      .select("city,slug,title,areas_count,popular")
      .ilike("city", CITY);

    if (error) {
      return NextResponse.json<OutItem[]>([], { status: 200 });
    }

    const rows: StatRow[] = (data ?? []) as StatRow[];

    const byPub: Record<string, OutItem> = {};
    for (const r of rows) {
      const map = DB_TO_PUBLIC[r.slug];
      if (!map) continue;

      byPub[map.pub] = {
        slug: map.pub,
        title: map.title ?? map.title ?? "",
        description: null, // la view non fornisce description
        areas_count: r.areas_count ?? 0,
        popular: Array.isArray(r.popular) ? r.popular : [],
      };
    }

    const out: OutItem[] = PUBLIC_ORDER.filter((s) => !!byPub[s]).map((s) => byPub[s]);

    return NextResponse.json(out, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e) {
    return NextResponse.json<OutItem[]>([], { status: 200 });
  }
}
