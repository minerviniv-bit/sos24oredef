// src/app/api/admin/seo/context/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import type { VAssignmentsPublic } from "@/lib/supabase/db-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AreaItem = { slug: string; label: string };
type SetItem = { service: string; city: string; areas: AreaItem[] };

export async function GET(req: Request) {
  const supabase = supabaseService();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") ?? "";

  if (!clientId.trim()) {
    return NextResponse.json({ error: "missing clientId" }, { status: 400 });
  }

  // Prendo solo i campi che servono e tipizzo il risultato
  type Row = Pick<VAssignmentsPublic, "service" | "city" | "area_slug" | "area_label">;

  const { data, error } = await supabase
    .from("v_assignments_public")
    .select("service, city, area_slug, area_label")
    .eq("client_id", clientId)
    .returns<Row[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Costruisco service→city→areas; scarto righe senza service/city
  const map = new Map<string, SetItem>();

  for (const r of data ?? []) {
    if (!r.service || !r.city) continue; // evita i null

    const key = `${r.service}:${r.city}`;
    if (!map.has(key)) {
      map.set(key, { service: r.service, city: r.city, areas: [] });
    }

    if (r.area_slug) {
      map.get(key)!.areas.push({
        slug: r.area_slug,
        label: r.area_label ?? r.area_slug,
      });
    }
  }

  // (opzionale) ordina aree per label
  for (const v of map.values()) {
    v.areas.sort((a, b) => a.label.localeCompare(b.label));
  }

  return NextResponse.json({ sets: Array.from(map.values()) });
}
