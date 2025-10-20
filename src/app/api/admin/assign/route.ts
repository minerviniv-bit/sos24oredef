import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import { VAssignmentsPublic } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// UUID v4 quick check (basta per validazione base)
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/* ========= Tipi utili ========= */

type AssignExistingRow = {
  client_id: string | null;
};

type PostBody = {
  service?: string;
  city?: string;
  area_slug?: string;
  client_id?: string | null;
};

/**
 * GET /api/admin/assign
 * Ritorna le ZONE assegnate a un cliente per service/city.
 * Query: ?client_id=...&service=...&city=...
 * Risposta: { ok: true, areas: ["prati","trastevere", ...] }
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const client_id = searchParams.get("client_id") || "";
    const service = (searchParams.get("service") || "").trim().toLowerCase();
    const city = (searchParams.get("city") || "").trim().toLowerCase();

    if (!client_id || !service || !city) {
      return NextResponse.json(
        { ok: false, error: "missing client_id/service/city" },
        { status: 400 }
      );
    }

    const supa = supabaseService();

    // Leggo solo area_slug dalla view pubblica
    const { data, error } = await supa
      .from("v_assignments_public")
      .select("area_slug")
      .eq("client_id", client_id)
      .eq("service", service)
      .eq("city", city)
      .returns<Pick<VAssignmentsPublic, "area_slug">[]>();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const areas = (data ?? [])
      .map((r) => r.area_slug)
      .filter((v): v is string => Boolean(v));

    return NextResponse.json({ ok: true, areas });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/admin/assign
 * Assegna / libera una zona (client_id=null => libera)
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PostBody;

    const service = String(body?.service || "").trim().toLowerCase();
    const city = String(body?.city || "").trim().toLowerCase();
    const area_slug = String(body?.area_slug || "").trim().toLowerCase();
    const client_id: string | null =
      body?.client_id === null || body?.client_id === undefined
        ? null
        : String(body?.client_id);

    if (!service || !city || !area_slug) {
      return NextResponse.json(
        { error: "missing service/city/area_slug" },
        { status: 400 }
      );
    }
    if (client_id && !UUID_RE.test(client_id)) {
      return NextResponse.json({ error: "invalid client_id" }, { status: 400 });
    }

    const supa = supabaseService();

    // Idempotenza: se già assegnata allo stesso client → no-op
    if (client_id) {
      const { data: existing, error: checkErr } = await supa
        .from("assignments")
        .select("client_id")
        .eq("service", service)
        .eq("city", city)
        .eq("area_slug", area_slug)
        .maybeSingle()
        .returns<AssignExistingRow | null>();

      if (checkErr) {
        return NextResponse.json({ error: checkErr.message }, { status: 500 });
      }

      if (existing?.client_id === client_id) {
        // no-op: già assegnata a questo cliente
        const { data: viewRow } = await supa
          .from("v_assignments_public")
          .select("*")
          .eq("service", service)
          .eq("city", city)
          .eq("area_slug", area_slug)
          .maybeSingle()
          .returns<VAssignmentsPublic | null>();

        return NextResponse.json({ ok: true, action: "noop", data: viewRow || null });
      }
    }

    if (client_id === null) {
      // libera — delete
      const { error } = await supa
        .from("assignments")
        .delete()
        .eq("service", service)
        .eq("city", city)
        .eq("area_slug", area_slug);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ ok: true, action: "deleted" });
    }

    // assegna / upsert
    const { error: upErr } = await supa
      .from("assignments")
      .upsert({ service, city, area_slug, client_id }, { onConflict: "service,city,area_slug" });

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    // ritorna riga dalla vista pubblica per aggiornare la UI
    const { data: viewRow, error: viewErr } = await supa
      .from("v_assignments_public")
      .select("*")
      .eq("service", service)
      .eq("city", city)
      .eq("area_slug", area_slug)
      .maybeSingle()
      .returns<VAssignmentsPublic | null>();

    if (viewErr) {
      return NextResponse.json({ error: viewErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, action: "upsert", data: viewRow || null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
