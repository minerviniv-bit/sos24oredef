// src/app/api/admin/seo/save/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import type { Json, TablesInsert } from "@/lib/supabase/db-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SeoBlock = {
  title?: string | null;
  meta_description?: string | null;
  h1?: string | null;
  body_html?: string | null;
  faqs?: Array<{ q: string; a: string }> | null;
  json_ld?: unknown; // verrà normalizzato a Json
};

type SaveItem = {
  scope: "area" | "city";
  service: string;
  city: string;
  area?: string;
  area_slug?: string;
  quartiere?: string;
  district?: string;
  zone?: string;
  client_id?: string | null;
  model_used?: string | null;
  seo: SeoBlock; // richiesto per il save
};

// plain object guard
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// normalizza JSON a null se vuoto (solo Json!)
const nz = <T extends Json>(v: T | null | undefined): T | null => {
  if (v == null) return null;
  if (Array.isArray(v) && v.length === 0) return null;
  if (isPlainObject(v) && Object.keys(v).length === 0) return null;
  return v;
};

function pickAreaSlug(it: SaveItem) {
  return (it.area_slug || it.area || it.quartiere || it.district || it.zone || "")
    .toLowerCase()
    .trim();
}

type SaveOk = { ok: true; action: "upsert->draft"; data: unknown };
type SaveErr = { ok: false; error: string; input?: unknown };

export async function POST(req: Request) {
  try {
    // guardie configurazione service client
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const svcUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!svcKey || !svcUrl) {
      return NextResponse.json(
        { ok: false, error: "Service client misconfigured: SUPABASE_URL and/or SERVICE_ROLE_KEY missing" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { items?: unknown[] };
    const items: SaveItem[] = Array.isArray(body.items) ? (body.items as SaveItem[]) : [];

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "No items provided" }, { status: 400 });
    }

    const supa = supabaseService();
    const results: Array<SaveOk | SaveErr> = [];

    for (const raw of items) {
      const scope = String(raw.scope || "area").toLowerCase() as "area" | "city";
      const service = String(raw.service || "").toLowerCase().trim();
      const city = String(raw.city || "").toLowerCase().trim();
      const areaSlug = scope === "area" ? pickAreaSlug(raw) : undefined;

      if (!service || !city || (scope === "area" && !areaSlug)) {
        results.push({ ok: false, error: "Parametri mancanti (service/city/area_slug)", input: raw });
        continue;
      }
      if (!raw.seo) {
        results.push({ ok: false, error: "seo mancante", input: raw });
        continue;
      }

      const now = new Date().toISOString();

      // ATTENZIONE:
      // - i campi stringa qui sotto devono essere string (non null) -> coalesco a ""
      // - faqs/json_ld devono essere Json | null
      // - natural_key è GENERATED in DB, NON va nel payload
      const payload: TablesInsert<"seo_pages"> = {
        scope,
        service,
        city,
        area_slug: areaSlug ?? null,
        client_id: raw.client_id ?? null,

        title: raw.seo.title ?? "",
        meta_description: raw.seo.meta_description ?? "",
        h1: raw.seo.h1 ?? "",
        body_html: raw.seo.body_html ?? "",

        faqs: nz(raw.seo.faqs as unknown as Json),
        json_ld: nz(raw.seo.json_ld as unknown as Json),

        model_used: raw.model_used ?? null,
        status: "draft",
        updated_at: now,
        published_at: null, // in save non pubblichiamo
      };

      const { data, error } = await supa
        .from("seo_pages")
        .upsert(payload, { onConflict: "natural_key" }) // UNIQUE su natural_key (generated)
        .select("*")
        .maybeSingle();

      if (error) results.push({ ok: false, error: error.message, input: raw });
      else results.push({ ok: true, action: "upsert->draft", data });
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
