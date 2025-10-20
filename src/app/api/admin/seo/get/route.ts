// src/app/api/admin/seo/get/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const service = String(searchParams.get("service") || "").toLowerCase().trim();
    const city = String(searchParams.get("city") || "").toLowerCase().trim();
    const area = String(searchParams.get("area") || "").toLowerCase().trim();

    if (!service || !city) {
      return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
    }

    const supa = supabaseService();

    // Se arriva area -> cerca per area; altrimenti city-level
    const q = supa
      .from("seo_pages")
      .select(
        "id, scope, service, city, area_slug, status, title, meta_description, h1, body_html, faqs, json_ld, model_used, updated_at"
      )
      .eq("service", service)
      .eq("city", city)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (area) q.eq("area_slug", area);

    const { data, error } = await q.maybeSingle();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, data: data || null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
