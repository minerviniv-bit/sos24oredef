import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  "id","name","company_name","vat_id","tax_code","sdi_code","pec_email",
  "billing_email","billing_address","phone","bank_name","iban","signer_name",
  "logo_url","description","active","whatsapp","email","website","rating",
  "anni_attivita","orari","servizi_offerti","interventi","rate"
];

function sanitize(input: Partial<Client>): Partial<Client> {
  const out: Partial<Client> = {};
  for (const k of WRITABLE) {
    const v = input[k];
    if (v === undefined) continue;

    if (typeof v === "string") {
      const t = v.trim();
      (out as Record<keyof Client, Client[keyof Client]>)[k] =
        (t === "" ? null : (t as unknown)) as Client[keyof Client];
    } else {
      (out as Record<keyof Client, Client[keyof Client]>)[k] =
        v as Client[keyof Client];
    }
  }
  return out;
}

function validate(c: Partial<Client>) {
  if (!c.name || !c.name.trim()) throw new Error("name is required");
  if ((c.description || "").length > 800) throw new Error("description must be <= 800 chars");
}

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
    } else {
      const lite = searchParams.get("lite") === "1";
      const cols = lite ? "id,name,company_name" : READ_COLS;
      const { data, error } = await supa
        .from("clients")
        .select(cols)
        .order("name", { ascending: true });
      if (error) throw error;
      return NextResponse.json({ data });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { client: Client };
    if (!body?.client) throw new Error("missing client");
    const client = sanitize(body.client);
    validate(client);

    const supa = supabaseService();

    if (client.id) {
      const { id, ...updateData } = client;
      const { data, error } = await supa
        .from("clients")
        .update(updateData)
        .eq("id", id as string)
        .select(READ_COLS)
        .single();
      if (error) throw error;
      return NextResponse.json({ data });
    } else {
      const { data, error } = await supa
        .from("clients")
        .insert(client)
        .select(READ_COLS)
        .single();
      if (error) throw error;
      return NextResponse.json({ data });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { client: Client };
    if (!body?.client?.id) throw new Error("missing id");
    const id = body.client.id as string;

    const client = sanitize({ ...body.client });
    validate(client);

    // rimuovo l'id dal payload senza creare variabili inutilizzate
    delete (client as { id?: string }).id;
    const updateData = client;

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

/**
 * DELETE /api/admin/clients
 * - body JSON: { id: string, force?: boolean }
 * - oppure querystring: ?id=...&force=1
 */
export async function DELETE(req: Request) {
  try {
    const supa = supabaseService();

    const url = new URL(req.url);
    const qsId = url.searchParams.get("id") || undefined;
    const qsForce = url.searchParams.get("force") === "1";

    let bodyId: string | undefined;
    let bodyForce = false;

    const body = (await req.json().catch(() => null)) as
      | { id?: string; force?: boolean }
      | null;
    if (body && typeof body === "object") {
      bodyId = body.id;
      bodyForce = Boolean(body.force);
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
