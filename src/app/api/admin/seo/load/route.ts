import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  scope?: "area" | "city";
  service: string;
  city: string;
  area_slug?: string | null;
  client_id: string;
};

// type guard: plain object (non array, non null)
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const nz = <T>(v: T | null | undefined): T | null => {
  if (v == null) return null;
  if (Array.isArray(v) && v.length === 0) return null;
  if (isPlainObject(v) && Object.keys(v).length === 0) return null;
  return v;
};

export async function POST(req: Request) {
  try {
    const { scope = "area", service, city, area_slug, client_id } = (await req.json()) as Payload;

    if (!service || !city || !client_id) {
      return NextResponse.json(
        { error: "Parametri mancanti: service, city, client_id (e area_slug se scope=area)" },
        { status: 400 }
      );
    }
    if (scope === "area" && !area_slug) {
      return NextResponse.json({ error: "area_slug richiesto per scope=area" }, { status: 400 });
    }

    const supa = supabaseService();
    let q = supa
      .from("seo_pages")
      .select("*")
      .eq("scope", scope)
      .eq("service", service.toLowerCase())
      .eq("city", city.toLowerCase())
      .eq("client_id", client_id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (scope === "area") q = q.eq("area_slug", String(area_slug).toLowerCase());

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const row = data?.[0] || null;
    if (!row) return NextResponse.json({ data: null });

    // Normalizza in un singolo blocco "seo"
    const seo =
      row.seo ?? {
        title: row.title ?? null,
        meta_description: row.meta_description ?? null,
        h1: row.h1 ?? null,
        body_html: row.body_html ?? null,
        faqs: nz(row.faqs),
        json_ld: nz(row.json_ld),
      };

    return NextResponse.json({
      data: {
        scope: row.scope,
        service: row.service,
        city: row.city,
        area_slug: row.area_slug,
        client_id: row.client_id,
        status: row.status,
        model_used: row.model_used,
        seo,
        updated_at: row.updated_at,
        published_at: row.published_at,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore imprevisto";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
