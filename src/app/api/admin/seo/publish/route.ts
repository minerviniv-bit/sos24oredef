// src/app/api/admin/seo/publish/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SeoBlock = {
  title?: string | null;
  meta_description?: string | null;
  h1?: string | null;
  body_html?: string | null;
  faqs?: Array<{ q: string; a: string }> | null;
  json_ld?: unknown; // era `any`
};

type PublishItem = {
  scope: "area" | "city";
  service: string;
  city: string;
  area?: string;        // sinonimi accettati
  area_slug?: string;
  quartiere?: string;
  district?: string;
  zone?: string;
  client_id?: string | null;
  client_uuid?: string | null;
  model_used?: string;
  seo?: SeoBlock;       // se presente → publish “one-click” (upsert con contenuto)
};

// payload coerente con le colonne reali di `seo_pages`
type SeoPagesUpsertPayload = {
  scope: "area" | "city";
  service: string;
  city: string;
  area_slug: string | null;
  client_id: string | null;
  title: string | null;
  meta_description: string | null;
  h1: string | null;
  body_html: string | null;
  faqs: Array<{ q: string; a: string }> | null;
  json_ld: unknown | null;
  model_used: string | null;
  status: "published" | "draft";
  published_at: string | null;
  updated_at: string | null;
};

// type guard: plain object
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// normalizza JSON a null se vuoto
const nz = <T>(v: T | null | undefined): T | null => {
  if (v == null) return null;
  if (Array.isArray(v) && v.length === 0) return null;
  if (isPlainObject(v) && Object.keys(v).length === 0) return null;
  return v;
};

// pick area slug dai sinonimi
function pickAreaSlug(it: PublishItem) {
  return (
    it.area_slug ||
    it.area ||
    it.quartiere ||
    it.district ||
    it.zone ||
    ""
  ).toLowerCase().trim();
}

// natural key in chiaro (usata solo per lookup/update; la colonna è GENERATED in DB)
function natKey(scope: string, service: string, city: string, area_slug?: string) {
  return scope === "area"
    ? `${service}:${city}:${area_slug}`.toLowerCase()
    : `${service}:${city}`.toLowerCase();
}

type PublishOk =
  | { ok: true; action: "upsert+publish"; data: unknown }
  | { ok: true; action: "update->published"; data: unknown };

type PublishErr = { ok: false; error: string; input?: unknown };

// ---- HANDLER ----
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

    const bodyUnknown = await req.json().catch(() => ({}));
    const items: PublishItem[] = Array.isArray((bodyUnknown as { items?: unknown }).items)
      ? ((bodyUnknown as { items: unknown[] }).items as PublishItem[])
      : [];

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "No items provided" }, { status: 400 });
    }

    const supa = supabaseService();
    const results: Array<PublishOk | PublishErr> = [];

    for (const raw of items) {
      const scope = String(raw.scope || "area").toLowerCase() as "area" | "city";
      const service = String(raw.service || "").toLowerCase().trim();
      const city = String(raw.city || "").toLowerCase().trim();
      const area_slug = scope === "area" ? pickAreaSlug(raw) : undefined;

      if (!service || !city || (scope === "area" && !area_slug)) {
        results.push({
          ok: false,
          error: "Parametri mancanti (service/city/area_slug)",
          input: raw,
        });
        continue;
      }

      const key = natKey(scope, service, city, area_slug);

      // === ONE-CLICK PUBLISH: UPSERT + publish con contenuti ===
      if (raw.seo) {
        const seo: SeoBlock = raw.seo || {};
        const now = new Date().toISOString();

        const upsertPayload: SeoPagesUpsertPayload = {
          scope,
          service,
          city,
          area_slug: area_slug ?? null,
          client_id: raw.client_id ?? raw.client_uuid ?? null,
          title: seo.title ?? null,
          meta_description: seo.meta_description ?? null,
          h1: seo.h1 ?? null,
          body_html: seo.body_html ?? null,
          faqs: nz(seo.faqs),
          json_ld: nz(seo.json_ld),
          model_used: raw.model_used ?? null,
          status: "published",
          published_at: now,
          updated_at: now,
        };

        const { data, error } = await supa
          .from("seo_pages")
          .upsert(upsertPayload, { onConflict: "natural_key" }) // usa l'UNIQUE su natural_key (generated)
          .select("*")
          .maybeSingle();

        if (error) {
          results.push({ ok: false, error: error.message, input: raw });
        } else {
          results.push({ ok: true, action: "upsert+publish", data });
        }
        continue;
      }

      // === SOLO PUBLISH: promuovi una bozza esistente a published ===
      const { data: current, error: selErr } = await supa
        .from("seo_pages")
        .select("id, status")
        .eq("natural_key", key)
        .maybeSingle();

      if (selErr) {
        results.push({ ok: false, error: selErr.message, input: raw });
        continue;
      }

      if (!current) {
        results.push({
          ok: false,
          error:
            "Draft non trovato. Usa /api/admin/seo/save prima, oppure passa 'seo' a /publish per pubblicare in one-click.",
          input: raw,
        });
        continue;
      }

      const now = new Date().toISOString();
      const { data, error } = await supa
        .from("seo_pages")
        .update({
          status: "published",
          published_at: now,
          updated_at: now,
        })
        .eq("natural_key", key)
        .select("*")
        .maybeSingle();

      if (error) {
        results.push({ ok: false, error: error.message, input: raw });
      } else {
        results.push({ ok: true, action: "update->published", data });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}
