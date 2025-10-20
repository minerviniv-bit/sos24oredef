import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/by-client/list?q=<testo>&limit=50
 * Ritorna l'elenco dei clienti (id, name, company_name, logo_url, created_at)
 * Filtra per q su name e company_name.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);

    const supa = supabaseService();

    type ClientRow = {
      id: string;
      name: string | null;
      company_name: string | null;
      logo_url: string | null;
      created_at: string | null;
    };

    let query = supa
      .from("clients")
      .select("id, name, company_name, logo_url, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (q) {
      query = query.or([`name.ilike.%${q}%`, `company_name.ilike.%${q}%`].join(","));
    }

    const { data, error } = await query.returns<ClientRow[]>();
    if (error) throw error;

    const items = (data ?? []).map((c) => ({
      id: c.id,
      name: c.name || c.company_name || "(senza nome)",
      logo_url: c.logo_url,
      created_at: c.created_at,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
