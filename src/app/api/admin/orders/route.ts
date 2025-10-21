// src/app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderBody = {
  id?: string;
  client_id?: string;
  kind?: "zones" | "calls" | string;
  quantity?: number;
  unit_price?: number;
  vat_percent?: number;
  discount_percent?: number;
  installments?: number;
  due_days?: number;
  notes?: string | null;
  service?: string | null;
  city?: string | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const client_id = searchParams.get("client_id");
    if (!client_id) return NextResponse.json({ error: "missing client_id" }, { status: 400 });

    const supa = supabaseService();
    const { data, error } = await supa
      .from("orders")
      .select("*")
      .eq("client_id", client_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<OrderBody>;

    // payload atteso
    const {
      id,
      client_id,
      kind,
      quantity,
      unit_price,
      vat_percent,
      discount_percent,
      installments,
      due_days,
      notes,
      service,
      city,
    } = body || {};

    if (!client_id || !kind || !quantity || unit_price == null) {
      return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    const supa = supabaseService();
    const row = {
      client_id,
      kind,
      quantity: Number(quantity),
      unit_price_cents: Math.round(Number(unit_price) * 100),
      vat_percent: Number(vat_percent ?? 22),
      discount_percent: Number(discount_percent ?? 0),
      installments: Number(installments ?? 1),
      due_days: Number(due_days ?? 30),
      notes: notes ?? null,
      service: service ?? null,
      city: city ?? null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data, error } = await supa
        .from("orders")
        .update(row)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ data });
    } else {
      const { data, error } = await supa.from("orders").insert(row).select().single();
      if (error) throw error;
      return NextResponse.json({ data });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
    const supa = supabaseService();
    const { error } = await supa.from("orders").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

