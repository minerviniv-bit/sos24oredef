// src/app/api/lead/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import type { TablesInsert, Json } from "@/lib/supabase/db-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ripulisce numeri di telefono dal JSON (lascia il numero verde 800 00 24 24)
function scrubPhone(input: Json | null): Json | null {
  if (input == null) return input;
  const s = JSON.stringify(input).replace(/\+?\d[\d \-]{7,}\b/g, (m) =>
    /800\s*00\s*24\s*24/.test(m) ? m : "【numero rimosso】"
  );
  return JSON.parse(s) as Json;
}

export async function POST(req: Request) {
  try {
    const gate = req.headers.get("x-chat-key");
    if (!gate || gate !== process.env.CHAT_GATE_KEY) {
      return NextResponse.json({ error: "Richiede abbonamento attivo" }, { status: 402 });
    }

    const { source, lead, transcript, when } = (await req.json()) as {
      source?: string;
      lead?: Record<string, unknown>;
      transcript?: unknown[];
      when?: string;
    };

    if (!lead?.servizio || !lead?.zona) {
      return NextResponse.json({ error: "Lead incompleto (servizio/zona)" }, { status: 400 });
    }

    const payload: TablesInsert<"leads"> = {
      // colonne reali della tabella `leads`
      source: String(source || "chat"),
      servizio: String(lead.servizio || ""),
      zona: String(lead.zona || ""),
      urgenza: (lead.urgenza as string | null) ?? null,
      fascia_oraria: (lead.fascia_oraria as string | null) ?? null,
      problema: (lead.problema as string | null) ?? null,
      accesso: (lead.accesso as string | null) ?? null,
      note: (lead.note as string | null) ?? null,
      extra: (lead.extra as Json | null) ?? null,
      pricing: (lead.pricing as Json | null) ?? null,
      contatto: scrubPhone(((lead.contatto as Json | null) ?? null)),
      transcript: Array.isArray(transcript) ? (transcript.slice(-50) as unknown as Json) : null,
      created_at: when || new Date().toISOString(),
    };

    const supabase = supabaseService();
    const { error } = await supabase.from("leads").insert(payload);
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
