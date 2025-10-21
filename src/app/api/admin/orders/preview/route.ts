// src/app/api/admin/orders/preview/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import { calcTotals } from "@/lib/billing/calc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PreviewBody = {
  client_id: string;
  kind: "zones" | "calls";
  quantity: number;
  unit_price: number;
  vat_percent?: number;
  discount_percent?: number;
  installments?: number;
  due_days?: number;
  notes?: string;
  service?: string;
  city?: string;
};

type ClientBillingRow = {
  id: string;
  name: string | null;
  company_name: string | null;
  vat_id: string | null;
  tax_code: string | null;
  sdi_code: string | null;
  pec_email: string | null;
  billing_email: string | null;
  billing_address: string | null;
  phone: string | null;
  bank_name: string | null;
  iban: string | null;
  signer_name: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<PreviewBody>;

    const {
      client_id,
      kind,
      quantity,
      unit_price,
      vat_percent = 22,
      discount_percent = 0,
      installments = 1,
      due_days = 30,
      notes,
      service,
      city,
    } = body || {};

    if (!client_id || !kind || !quantity || unit_price == null) {
      return NextResponse.json(
        { error: "missing required fields (client_id, kind, quantity, unit_price)" },
        { status: 400 }
      );
    }

    // 1) prendo i dati fiscali del cliente
    const supa = supabaseService();
    const { data: client, error } = await supa
      .from("clients")
      .select(
        "id, name, company_name, vat_id, tax_code, sdi_code, pec_email, billing_email, billing_address, phone, bank_name, iban, signer_name"
      )
      .eq("id", client_id)
      .single()
      .returns<ClientBillingRow>();

    if (error) throw error;

    // 2) calcolo totali
    const totals = calcTotals({
      quantity: Number(quantity),
      unit_price: Number(unit_price),
      vat_percent: Number(vat_percent),
      discount_percent: Number(discount_percent),
      installments: Number(installments),
    });

    // 3) costruisco la preview (shape stabile usata dalla UI)
    const preview = {
      cliente: {
        id: client.id,
        ragione_sociale: client.company_name || client.name,
        piva: client.vat_id || "",
        cf: client.tax_code || "",
        sdi: client.sdi_code || "",
        pec: client.pec_email || "",
        email_fatt: client.billing_email || "",
        indirizzo: client.billing_address || "",
        telefono: client.phone || "",
        banca: client.bank_name || "",
        iban: client.iban || "",
        sottoscrittore: client.signer_name || "",
      },
      ordine: {
        tipo: kind as "zones" | "calls",
        servizio: service || null,
        citta: city || null,
        quantita: Number(quantity),
        prezzo_unit: Number(unit_price),
        iva: Number(vat_percent),
        sconto: Number(discount_percent),
        rate: Number(installments),
        scadenza_giorni: Number(due_days),
        note: notes || "",
      },
      totali: totals,
    };

    return NextResponse.json({ preview });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

