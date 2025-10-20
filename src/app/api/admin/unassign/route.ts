import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

type UnassignBody = {
  service?: string;
  city?: string;
  area_slug?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UnassignBody;
    const service = String(body?.service || "").toLowerCase();
    const city = String(body?.city || "").toLowerCase();
    const area_slug = String(body?.area_slug || "").toLowerCase();

    if (!service || !city || !area_slug) {
      return NextResponse.json(
        { error: "service, city, area_slug sono richiesti" },
        { status: 400 }
      );
    }

    const sb = supabaseService();

    // Controllo esistenza
    const { data: ex } = await sb
      .from("assignments")
      .select("area_slug")
      .eq("service", service)
      .eq("city", city)
      .eq("area_slug", area_slug)
      .maybeSingle();

    if (!ex) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const { data, error } = await sb
      .from("assignments")
      .update({ client_id: null })
      .eq("service", service)
      .eq("city", city)
      .eq("area_slug", area_slug)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, changed: data?.length || 0 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
