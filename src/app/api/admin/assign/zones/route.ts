import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import { VAssignmentsPublic } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/assign/zones?service=idraulico&city=roma&client_id=UUID&only_assigned=true
 * Ritorna le zone (area_slug) per quel client/service/city.
 * Output: { ok: true, items: [{ area_slug: string }] }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const service = (url.searchParams.get("service") || "").trim().toLowerCase();
    const city = (url.searchParams.get("city") || "").trim().toLowerCase();
    const client_id = (url.searchParams.get("client_id") || "").trim();

    if (!service || !city) {
      return NextResponse.json({ ok: false, error: "missing service/city" }, { status: 400 });
    }

    // Se non hai ancora selezionato il cliente → lista vuota
    if (!client_id) {
      return NextResponse.json({ ok: true, items: [] });
    }

    const supa = supabaseService();

    const { data, error } = await supa
      .from("v_assignments_public")
      .select("service, city, area_slug, client_id")
      .eq("service", service)
      .eq("city", city)
      .eq("client_id", client_id)
      .order("area_slug", { ascending: true })
      .returns<Pick<VAssignmentsPublic, "service" | "city" | "area_slug" | "client_id">[]>();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500, headers: { "cache-control": "no-store" } }
      );
    }

    const items = (data ?? [])
      .map((r) => ({ area_slug: r.area_slug }))
      .filter((r): r is { area_slug: string } => Boolean(r.area_slug));

    return NextResponse.json(
      { ok: true, items },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
