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

type PublishItem = {
  scope: "area" | "city";
  service: string;
  city: string;
  area?: string;
  area_slug?: string;
  quartiere?: string;
  district?: string;
  zone?: string;
  client_id?: string | null;
  client_uuid?: string | null;
  model_used?: string;
  seo?: SeoBlock; // se presente => one-click publish
};

// -------- helpers
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// null se vuoto (solo Json!)
const nz = <T extends Json>(v: T | null | undefined): T | null => {
  if (v == null) return null;
  if (Array.isArray(v) && v.length === 0) return null;
  if (isPlainObject(v) && Object.keys(v).length === 0) return null;
  return v;
};

function pickAreaSlug(it: PublishItem) {
  return (it.area_slug || it.area || it.quartiere || it.district || it.zone || "")
    .toLowerCase()
    .trim();
}

function natKey(scope: string, service: string, city: string, area_slug?: string) {
  return scope === "area"
    ? `${service}:${city}:${area_slug}`.toLowerCase()
    : `${service}:${city}`.toLowerCase();
}

// -------- handler
export async function POST(req: Request) {
  try {
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const svcUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!svcKey || !svcUrl) {
      return NextResponse.json(
        { ok: false, error: "Service client misconfigured: SUPABASE_URL and/or SERVICE_ROLE_KEY missing" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { items?: unknown[] };
    const items: PublishItem[] = Array.isArray(body.items) ? (body.items as PublishItem[]) : [];

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "No items provided" }, { status: 400 });
    }

    const supa = supabaseService();
    const results: Array<
      | { ok: true; action: "upsert+publish"; data: unknown }
      | { ok: true; action: "update->published"; data: unknown }
      | { ok: false; error: string; input?: unknown }
    > = [];

    for (const raw of items) {
      const scope = String(raw.scope || "area").toLowerCase() as "area" | "city";
      const service = String(raw.service || "").toLowerCase().trim();
      const city = String(raw.city || "").toLowerCase().trim();
      const areaSlug = scope === "area" ? pickAreaSlug(raw) : undefined;

      if (!service || !city || (scope === "area" && !areaSlug)) {
        results.push({ ok: false, error: "Parametri mancanti (service/city/area_slug)", input: raw });
        continue;
      }

      const key = natKey(scope, service, city, areaSlug);

      // ---- ONE-CLICK PUBLISH (upsert con contenuto)
      if (raw.seo) {
        const seo: SeoBlock = raw.seo || {};
        const now = new Date().toISOString();

        // NOTA: i campi stringa NON sono nullable nei tipi -> coalesco a ""
        const payload: TablesInsert<"seo_pages"> = {
          scope,
          service,
          city,
          area_slug: areaSlug ?? null,
          client_id: raw.client_id ?? raw.client_uuid ?? null,

          title: seo.title ?? "",
          meta_description: seo.meta_description ?? "",
          h1: seo.h1 ?? "",
          body_html: seo.body_html ?? "",

          faqs: nz(seo.faqs as unknown as Json),
          json_ld: nz(seo.json_ld as unknown as Json),

          model_used: raw.model_used ?? null,
          status: "published",
          published_at: now,
          updated_at: now,
          // natural_key è GENERATED in DB
        };

        const { data, error } = await supa
          .from("seo_pages")
          .upsert(payload, { onConflict: "natural_key" })
          .select("*")
          .maybeSingle();

        if (error) results.push({ ok: false, error: error.message, input: raw });
        else results.push({ ok: true, action: "upsert+publish", data });
        continue;
      }

      // ---- SOLO PUBLISH (promuove bozza esistente)
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
        .update({ status: "published", published_at: now, updated_at: now })
        .eq("natural_key", key)
        .select("*")
        .maybeSingle();

      if (error) results.push({ ok: false, error: error.message, input: raw });
      else results.push({ ok: true, action: "update->published", data });
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
