import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

type BulkBody = {
  service?: string;
  city?: string;
  area_slugs?: string[];
  client_id?: string | null;
  only_free?: boolean;
  force?: boolean;
};

type AssignRow = {
  area_slug: string;
  client_id: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BulkBody;

    const service = (body?.service || "").toLowerCase();
    const city = (body?.city || "").toLowerCase();
    const area_slugs: string[] = Array.isArray(body?.area_slugs)
      ? body!.area_slugs!.map((s) => String(s).toLowerCase())
      : [];
    const client_id = (body?.client_id ?? null) as string | null;
    const only_free = !!body?.only_free;
    const force = !!body?.force;

    if (!service || !city || !client_id || area_slugs.length === 0) {
      return NextResponse.json(
        { error: "service, city, client_id e area_slugs[] sono richiesti" },
        { status: 400 }
      );
    }

    const sb = supabaseService();

    // Stato attuale
    const { data: existing, error: e1 } = await sb
      .from("assignments")
      .select("area_slug, client_id")
      .eq("service", service)
      .eq("city", city)
      .in("area_slug", area_slugs)
      .returns<AssignRow[]>();

    if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

    const map = new Map<string, string | null>();
    for (const r of existing ?? []) map.set(r.area_slug, r.client_id);

    const toUpsert: Array<{
      service: string;
      city: string;
      area_slug: string;
      client_id: string | null;
    }> = [];

    const conflicts: Array<{
      area_slug: string;
      client_id: string | null;
      client_name?: string;
    }> = [];

    for (const slug of area_slugs) {
      const current = map.get(slug); // undefined = nessuna riga, null = libera, <id> = occupata
      if (current === undefined) {
        // non esiste → upsert
        toUpsert.push({ service, city, area_slug: slug, client_id });
      } else if (current === null) {
        // libera → upsert
        toUpsert.push({ service, city, area_slug: slug, client_id });
      } else if (current === client_id) {
        // già mio → skip
        continue;
      } else {
        // occupata da altri
        if (force) {
          toUpsert.push({ service, city, area_slug: slug, client_id });
        } else if (!only_free) {
          conflicts.push({ area_slug: slug, client_id: current });
        }
        // se only_free:true, la ignoro silenziosamente
      }
    }

    let changed = 0;
    if (toUpsert.length > 0) {
      const { data: up, error: e2 } = await sb
        .from("assignments")
        .upsert(toUpsert, { onConflict: "service,city,area_slug" })
        .select()
        .returns<AssignRow[]>();
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
      changed = up?.length ?? 0;
    }

    const status = conflicts.length > 0 ? 207 : 200;
    return NextResponse.json({ ok: conflicts.length === 0, changed, conflicts }, { status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
