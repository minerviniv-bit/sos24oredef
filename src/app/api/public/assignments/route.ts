// src/app/api/public/assignments/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // niente cache per sicurezza

type FlatRow = {
  macro_slug: string | null;
  macro_title: string | null;
  sort_order: number | null;
  area_slug: string;
  area_label: string | null;
  city: string;
  service: string | null;
  client_id: string | null;
  client_name: string | null;
};

type Group = {
  macro_slug: string;
  macro_title: string;
  sort_order: number;
  areas: Array<{
    area_slug: string;
    area_label: string;
    client_id: string | null;
    client_name: string | null;
    service: string | null;
  }>;
};

/**
 * GET /api/public/assignments?city=roma&service=idraulico&grouped=1
 *
 * - city: obbligatorio (usa lowercase)
 * - service: facoltativo (se presente, INCLUDE anche le zone libere: service IS NULL)
 * - grouped=1: raggruppa per macro (macro_slug → areas[])
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = (url.searchParams.get("city") || "").toLowerCase().trim();
    const service = (url.searchParams.get("service") || "").toLowerCase().trim();
    const grouped = url.searchParams.get("grouped") === "1";

    if (!city) {
      return NextResponse.json({ error: "city is required" }, { status: 400 });
    }

    const selectCols =
      "macro_slug,macro_title,sort_order,area_slug,area_label,city,service,client_id,client_name";

    const supa = supabaseService();

    let qb = supa
      .from("v_admin_assignments")
      .select(selectCols)
      .eq("city", city)
      .order("sort_order", { ascending: true })
      .order("area_label", { ascending: true });

    // Se filtro per service, includo anche le zone libere (service IS NULL)
    // @ts-expect-error PostgREST or() syntax è accettata ma non tipizzata nel client
    if (service) qb = qb.or(`service.eq.${service},service.is.null`);

    const { data, error } = await qb;

    if (error) {
      return NextResponse.json({ error: error.message || "Database error" }, { status: 500 });
    }

    const rows = Array.isArray(data) ? (data as FlatRow[]) : [];

    if (!grouped) {
      return NextResponse.json({ data: rows });
    }

    // Raggruppo per macro
    const groupsMap: Record<string, Group> = {};
    for (const r of rows) {
      const key = r.macro_slug || "altro";
      if (!groupsMap[key]) {
        groupsMap[key] = {
          macro_slug: key,
          macro_title: r.macro_title || key,
          sort_order: r.sort_order ?? 9999,
          areas: [],
        };
      }
      groupsMap[key].areas.push({
        area_slug: r.area_slug,
        area_label: r.area_label || r.area_slug,
        client_id: r.client_id,
        client_name: r.client_name,
        service: r.service,
      });
    }

    const groupedOut = Object.values(groupsMap).sort(
      (a, b) => a.sort_order - b.sort_order
    );

    return NextResponse.json({ data: groupedOut });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
