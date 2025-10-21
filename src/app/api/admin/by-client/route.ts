import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/by-client?q=abc
 * Ritorna una lista leggera di clienti per l'autocomplete.
 * Output: { ok: true, items: [{ id, name }] }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();

    const supa = supabaseService();

    type ClientLite = {
      id: string;
      name: string | null;
    };

    // query base
    let query = supa
      .from("clients")
      .select("id, name")
      .order("name", { ascending: true })
      .limit(20);

    if (q) {
      query = query.ilike("name", `%${q}%`);
    }

    const { data, error } = await query.returns<ClientLite[]>();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}

