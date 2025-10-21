// src/app/api/admin/clients/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import type { TablesUpdate, Json } from "@/lib/supabase/db-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Modello “esteso” usato per input/validazione lato API */
type Client = {
  id?: string;
  name: string;
  company_name?: string;
  vat_id?: string;
  tax_code?: string;
  sdi_code?: string;
  pec_email?: string;
  billing_email?: string;
  billing_address?: string;
  phone?: string;
  bank_name?: string;
  iban?: string;
  signer_name?: string;
  logo_url?: string;
  description?: string;
  active?: boolean;
  whatsapp?: string;
  email?: string;
  website?: string;
  rating?: number;
  anni_attivita?: number;
  orari?: string;
  servizi_offerti?: string[];
  interventi?: number;
  rate?: Record<string, unknown> | null; // jsonb
};

const READ_COLS =
  "id,name,company_name,vat_id,tax_code,sdi_code,pec_email,billing_email,billing_address,phone,bank_name,iban,signer_name,logo_url,description,active,whatsapp,email,website,rating,anni_attivita,orari,servizi_offerti,interventi,rate,created_at";

const WRITABLE: (keyof Client)[] = [
  "id",
  "name",
  "company_name",
  "vat_id",
  "tax_code",
  "sdi_code",
  "pec_email",
  "billing_email",
  "billing_address",
  "phone",
  "bank_name",
  "iban",
  "signer_name",
  "logo_url",
  "description",
  "active",
  "whatsapp",
  "email",
  "website",
  "rating",
  "anni_attivita",
  "orari",
  "servizi_offerti",
  "interventi",
  "rate",
];

/** Sanitize → rimuove undefined e converte stringhe vuote in null.
 *  Ritorna un payload tipizzato per UPDATE della tabella `clients`. */
function sanitize(input: Partial<Client>): TablesUpdate<"clients"> {
  const out: Record<string, unknown> = {};

  for (const k of WRITABLE) {
    const v = input[k];
    if (v === undefined) continue;

    if (typeof v === "string") {
      const t = v.trim();
      out[k] = t === "" ? null : t;
      continue;
    }

    if (k === "rate") {
      // forza a Json (compatibile con json/jsonb di Supabase)
      out[k] = (v ?? null) as Json;
      continue;
    }

    out[k] = v as unknown;
  }

  return out as TablesUpdate<"clients">;
}

/** Validazioni base */
function validate(c: Partial<Client>) {
  if (!c.name || !c.name.trim()) throw new Error("name is required");
  if ((c.description || "").length > 800)
    throw new Error("description must be <= 800 chars");
}

/* =============== GET =============== */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const supa = supabaseService();

    if (id) {
      const { data, error } = await supa
        .from("clients")
        .select(READ_COLS)
        .eq("id", id)
        .single();
      if (error) throw error;
      return NextResponse.json({ data });
    }

    const lite = searchParams.get("lite") === "1";
    const cols = lite ? "id,name,company_name" : READ_COLS;
    const { data, error } = await supa
      .from("clients")
      .select(cols)
      .order("name", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* =============== POST =============== */

export async function POST(req: Request) {
  try {
    const bodyUnknown = (await req.json()) as unknown;
    const body = bodyUnknown as { client?: Client };
    if (!body?.client) throw new Error("missing client");

    const clientSan = sanitize(body.client);
    validate(body.client);

    const supa = supabaseService();

    if (body.client.id) {
      // UPDATE
      const id = body.client.id;

      // forza rate come Json (in caso di dubbi del compilatore)
      const updateData: TablesUpdate<"clients"> = {
        ...clientSan,
        rate: (clientSan.rate ?? null) as Json,
      };

      const { data, error } = await supa
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .select(READ_COLS)
        .single();
      if (error) throw error;
      return NextResponse.json({ data });
    }

    // INSERT
    const insertData: TablesUpdate<"clients"> = {
      ...clientSan,
      rate: (clientSan.rate ?? null) as Json,
    };

    const { data, error } = await supa
      .from("clients")
      .insert(insertData)
      .select(READ_COLS)
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

/* =============== PUT =============== */

export async function PUT(req: Request) {
  try {
    const bodyUnknown = (await req.json()) as unknown;
    const body = bodyUnknown as { client?: Client };
    if (!body?.client?.id) throw new Error("missing id");

    const id = body.client.id;
    const clientSan = sanitize({ ...body.client });
    validate(body.client);
    delete (clientSan as { id?: string }).id;

    const updateData: TablesUpdate<"clients"> = {
      ...clientSan,
      rate: (clientSan.rate ?? null) as Json,
    };

    const supa = supabaseService();
    const { data, error } = await supa
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select(READ_COLS)
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

/* =============== DELETE =============== */
/**
 * DELETE /api/admin/clients
 * Body JSON: { id: string, force?: boolean }
 * Oppure: ?id=...&force=1
 */
export async function DELETE(req: Request) {
  try {
    const supa = supabaseService();

    const url = new URL(req.url);
    const qsId = url.searchParams.get("id") || undefined;
    const qsForce = url.searchParams.get("force") === "1";

    let bodyId: string | undefined;
    let bodyForce = false;

    const parsed = (await req.json().catch(() => null)) as unknown;
    if (parsed && typeof parsed === "object") {
      const b = parsed as { id?: string; force?: boolean };
      bodyId = b.id;
      bodyForce = Boolean(b.force);
    }

    const id = bodyId || qsId;
    const force = bodyForce || qsForce;

    if (!id) throw new Error("missing id");

    const { count, error: countErr } = await supa
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id);
    if (countErr) throw countErr;

    if ((count || 0) > 0 && !force) {
      return NextResponse.json(
        { ok: false, error: "Cliente con zone assegnate", count },
        { status: 409 }
      );
    }

    if ((count || 0) > 0 && force) {
      const { error: delAssignErr } = await supa
        .from("assignments")
        .delete()
        .eq("client_id", id);
      if (delAssignErr) throw delAssignErr;
    }

    const { error: delClientErr } = await supa
      .from("clients")
      .delete()
      .eq("id", id)
      .single();
    if (delClientErr) throw delClientErr;

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
