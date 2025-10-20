// src/app/api/lead/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// sostituito any con unknown e gestione sicura
function scrubPhone(input: unknown) {
  if (input == null) return input;
  const s = JSON.stringify(input).replace(/\+?\d[\d \-]{7,}\b/g, (m) =>
    /800\s*00\s*24\s*24/.test(m) ? m : "【numero rimosso】"
  );
  return JSON.parse(s);
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

    const payload = {
      source: String(source || "chat"),
      servizio: String(lead.servizio || ""),
      zona: String(lead.zona || ""),
      urgenza: lead.urgenza ?? null,
      fascia_oraria: lead.fascia_oraria ?? null,
      problema: lead.problema ?? null,
      accesso: lead.accesso ?? null,
      note: lead.note ?? null,
      extra: lead.extra ?? null,
      pricing: lead.pricing ?? null,
      contatto: scrubPhone(lead.contatto ?? null),
      transcript: Array.isArray(transcript) ? transcript.slice(-50) : null,
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
