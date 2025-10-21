// src/app/api/admin/unassign/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

type AssignRow = {
  service: string;
  city: string;
  area_slug: string;
  client_id: string | null;
};

type BulkUnassignPayload = {
  service: string;
  city: string;
  area_slugs: string[];
  client_id: string | null; // a chi assegnare (o null per liberare)
  only_free?: boolean;      // se true: ignora silenziosamente quelle occupate
  force?: boolean;          // se true: sovrascrive chiunque
};

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json()) as unknown;
    const p = raw as Partial<BulkUnassignPayload>;

    const service = (p.service ?? "").toLowerCase();
    const city = (p.city ?? "").toLowerCase();
    const area_slugs = Array.isArray(p.area_slugs)
      ? p.area_slugs.map((s) => String(s).toLowerCase())
      : [];
    const client_id = (p.client_id ?? null) as string | null;
    const only_free = Boolean(p.only_free);
    const force = Boolean(p.force);

    if (!service || !city || !Array.isArray(area_slugs) || area_slugs.length === 0) {
      return NextResponse.json(
        { ok: false, error: "service, city e area_slugs[] sono richiesti" },
        { status: 400 }
      );
    }

    const sb = supabaseService();

    // ✅ Leggi lo stato attuale per quelle aree
    const { data: existing, error: e1 } = await sb
      .from("assignments")
      .select("area_slug,client_id")
      .eq("service", service)
      .eq("city", city)
      .in("area_slug", area_slugs);

    if (e1) {
      return NextResponse.json({ ok: false, error: e1.message }, { status: 500 });
    }

    const currentMap = new Map<string, string | null>();
    for (const r of existing ?? []) currentMap.set(r.area_slug, r.client_id);

    const toUpsert: AssignRow[] = [];
    const conflicts: Array<{ area_slug: string; client_id: string | null }> = [];

    for (const slug of area_slugs) {
      const current = currentMap.get(slug); // undefined = nessuna riga; null = libera; string = occupata

      if (current === undefined) {
        // non esiste → upsert
        toUpsert.push({ service, city, area_slug: slug, client_id });
        continue;
      }
      if (current === null) {
        // libera → upsert
        toUpsert.push({ service, city, area_slug: slug, client_id });
        continue;
      }
      if (current === client_id) {
        // già mio → skip
        continue;
      }
      // occupata da altri
      if (force) {
        toUpsert.push({ service, city, area_slug: slug, client_id });
      } else if (!only_free) {
        conflicts.push({ area_slug: slug, client_id: current });
      }
      // se only_free === true e occupata da altri → la saltiamo silenziosamente
    }

    let changed = 0;
    if (toUpsert.length > 0) {
      const { data: up, error: e2 } = await sb
        .from("assignments")
        .upsert(toUpsert, { onConflict: "service,city,area_slug" })
        .select("area_slug");

      if (e2) {
        return NextResponse.json({ ok: false, error: e2.message }, { status: 500 });
      }
      changed = up?.length ?? 0;
    }

    const status = conflicts.length > 0 ? 207 : 200;
    return NextResponse.json(
      { ok: conflicts.length === 0, changed, conflicts },
      { status }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

