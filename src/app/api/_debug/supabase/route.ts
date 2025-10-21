import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValue(v?: string | null) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function GET() {
  const SUPABASE_URL =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const envDiag = {
    NODE_ENV: process.env.NODE_ENV ?? null,
    SUPABASE_URL: hasValue(SUPABASE_URL) ? SUPABASE_URL : null,
    HAS_SERVICE_ROLE_KEY: hasValue(SRV),
    HAS_ANON_KEY: hasValue(ANON),
  };

  // Se manca proprio l'URL, inutile procedere
  if (!hasValue(SUPABASE_URL)) {
    return NextResponse.json(
      { ok: false, where: "env", envDiag, error: "NO_SUPABASE_URL" },
      { status: 500 }
    );
  }

  // 1) PING diretto REST con ANON (test rete + chiave)
  const restBase = `${SUPABASE_URL}/rest/v1`;
  const headersAnon = { apikey: ANON, Authorization: `Bearer ${ANON}` };
  let restHeadOk = false;
  let restHeadError: string | null = null;
  try {
    const res = await fetch(restBase, { method: "HEAD", headers: headersAnon, cache: "no-store" });
    restHeadOk = res.ok;
    if (!res.ok) restHeadError = `status ${res.status}`;
  } catch (e) {
    restHeadError = String(e);
  }

  // 2) Query molto semplice alla vista con ANON
  let anonQueryOk = false;
  let anonCount: number | null = null;
  let anonQueryError: string | null = null;
  try {
    const url = new URL(`${restBase}/v_macro_areas_stats`);
    url.searchParams.set("select", "city,slug,areas_count");
    url.searchParams.set("city", "ilike.roma"); // ilike 'roma'
    const r = await fetch(url.toString(), { headers: headersAnon, cache: "no-store" });
    if (r.ok) {
      const data = (await r.json()) as Array<{ city: string; slug: string; areas_count: number | null }>;
      anonQueryOk = true;
      anonCount = Array.isArray(data) ? data.length : null;
    } else {
      anonQueryError = `status ${r.status}`;
    }
  } catch (e) {
    anonQueryError = String(e);
  }

  // 3) Stessa query con SERVICE ROLE (se presente)
  let srvQueryOk = false;
  let srvCount: number | null = null;
  let srvQueryError: string | null = null;
  if (hasValue(SRV)) {
    try {
      const headersSrv = { apikey: SRV, Authorization: `Bearer ${SRV}` };
      const url = new URL(`${restBase}/v_macro_areas_stats`);
      url.searchParams.set("select", "city,slug,areas_count");
      url.searchParams.set("city", "ilike.roma");
      const r = await fetch(url.toString(), { headers: headersSrv, cache: "no-store" });
      if (r.ok) {
        const data = (await r.json()) as Array<{ city: string; slug: string; areas_count: number | null }>;
        srvQueryOk = true;
        srvCount = Array.isArray(data) ? data.length : null;
      } else {
        srvQueryError = `status ${r.status}`;
      }
    } catch (e) {
      srvQueryError = String(e);
    }
  }

  return NextResponse.json(
    {
      ok: true,
      envDiag,
      network: { restHeadOk, restHeadError, restBase },
      anonQuery: { ok: anonQueryOk, count: anonCount, error: anonQueryError },
      serviceQuery: { ok: srvQueryOk, count: srvCount, error: srvQueryError },
    },
    { status: 200 }
  );
}
