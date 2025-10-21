// src/app/api/chat/route.ts
import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
} from "openai/resources/chat/completions";
import { QUARTIERI_ROMA } from "@/data/quartieri-roma";

import { buildSystemPrompt, buildVisionInstructions } from "@/lib/chat/prompts";
import { extractLeadAndStrip } from "@/lib/chat/lead";
import { computeFabbroRange } from "@/lib/chat/pricing";
import {
  norm,
  scrub,
  detectService,
  detectUrgency,
  detectZoneFromText,
  isGreeting,
  detectPublicSafetyEmergency,
  ServiceKey,
  UrgenzaKey,
} from "@/lib/chat/utils";
import { dedupeAssistantText } from "@/lib/chat/antiRepeat";

export const runtime = "edge";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/** ===== Tipi utili ===== */
type MsgPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type ChatMessage = {
  role: "system" | "user" | "assistant";
  // negli storici salviamo stringhe; quando inviamo a OpenAI usiamo MsgPart[]
  content: string | MsgPart[];
};

type LeadShape = {
  servizio?: ServiceKey | string;
  zona?: string;
  urgenza?: UrgenzaKey | string;
  problema?: string;
  extra?: Record<string, unknown>;
  pricing?: { ready: boolean; item: string; price: number; note?: string };
};

type HistMsgUA = { role: "user" | "assistant"; content: string };

/** Derivo il tipo Tariffs dall’argomento della funzione computeFabbroRange */
type Tariffs = Parameters<typeof computeFabbroRange>[0];

/** Type guard minimale per validare l’oggetto parse-ato */
function isTariffs(v: unknown): v is Tariffs {
  return typeof v === "object" && v !== null;
}

/** Listino (parse sicuro + narrowing) */
const TARIFFS: Tariffs | null = (() => {
  try {
    const parsed = JSON.parse(process.env.SOS_TARIFFS || "null");
    return isTariffs(parsed) ? parsed : null;
  } catch {
    return null;
  }
})();

/** Quartieri normalizzati */
const QUARTIERI_LIST: string[] = Array.isArray(QUARTIERI_ROMA)
  ? QUARTIERI_ROMA.map((q) => {
      if (typeof q === "string") return q;
      const maybe = (q as Record<string, unknown>)?.label;
      return typeof maybe === "string" ? maybe : String(q);
    })
  : [];

function toKnownQuartiere(z: string) {
  const n = norm(z || "");
  let best = "";
  let bestLen = 0;
  for (const q of QUARTIERI_LIST) {
    const nq = norm(q);
    if (nq === n) return q;
    if (n && nq.includes(n) && nq.length > bestLen) {
      best = q;
      bestLen = nq.length;
    }
  }
  return best || z;
}

const PRICE_IN = Number(process.env.OPENAI_PRICE_IN || 0);
const PRICE_OUT = Number(process.env.OPENAI_PRICE_OUT || 0);

/** ArrayBuffer -> base64 usando Web API (compatibile Edge) */
function arrayBufferToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Converte un URL immagine in data URL (evita 400 da storage esterni) */
async function toDataUrl(url: string): Promise<string | null> {
  try {
    if (!url || url.startsWith("data:")) return url;
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "image/jpeg";
    const buf = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);
    return `data:${ct};base64,${base64}`;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY non configurata" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    // piccolo gate opzionale
    const gate = process.env.CHAT_GATE_KEY || "";
    const hdr = req.headers.get("x-chat-key") || "";
    if (gate && hdr !== gate) {
      return new Response(JSON.stringify({ error: "Richiede abbonamento attivo" }), {
        status: 402,
        headers: { "content-type": "application/json" },
      });
    }

    const body = (await req.json()) as {
      messages?: ChatMessage[];
      images?: string[];
    };

    const history: ChatMessage[] = Array.isArray(body?.messages)
      ? (body.messages as ChatMessage[]).slice(-16)
      : [];
    const images: string[] = Array.isArray(body?.images)
      ? (body.images as string[]).filter(Boolean)
      : [];

    // ultimo testo user (stringa)
    const lastUserText =
      history
        .slice()
        .reverse()
        .map((m) => (typeof m.content === "string" ? m.content : ""))
        .find((s) => s.length > 0) || "";

    const wantPrice = /\b(prezzo|costo|quanto|preventivo)\b/i.test(lastUserText);

    /** EMERGENZE PUBBLICHE: early return */
    const emerg = detectPublicSafetyEmergency(lastUserText);
    if (emerg) {
      const base =
        "⚠️ Non siamo un servizio di pubblica sicurezza.\n" +
        "➡️ In caso di emergenza chiama SUBITO il 112 (numero unico europeo).\n" +
        "Numeri dedicati: 115 Vigili del Fuoco • 118 Emergenza Sanitaria • 113 Polizia di Stato.";
      const extra =
        emerg === "fire"
          ? "\nRilevato possibile incendio: chiama il 115 o il 112 subito."
          : emerg === "gas"
          ? "\nPossibile fuga di gas: esci, non usare interruttori/telefoni, apri le finestre e chiama 115 o 112."
          : emerg === "medical"
          ? "\nEmergenza sanitaria: chiama immediatamente 118 o 112."
          : emerg === "crime"
          ? "\nPossibile reato/pericolo: chiama subito 112 o 113."
          : "";
      return new Response(
        JSON.stringify({
          text: `${base}${extra}\n\nDopo aver messo in sicurezza, posso aiutarti con i nostri servizi ordinari.`,
          lead: null,
        }),
        { headers: { "content-type": "application/json" }, status: 200 }
      );
    }

    // Hints lato server
    const svcHint: ServiceKey | null = detectService(lastUserText);
    const urgHint: UrgenzaKey | null = detectUrgency(lastUserText);
    const zoneHintRaw: string | null = detectZoneFromText(lastUserText, QUARTIERI_LIST);

    // Saluto semplice
    if (isGreeting(lastUserText) && lastUserText.length < 20) {
      const text =
        "Ciao! Sono l’assistente SOS24ORE. Puoi descrivermi il problema e in che zona/quartiere ti trovi? Se vuoi il prezzo indicativo, puoi anche mandare una foto.";
      return new Response(
        JSON.stringify({
          text,
          lead: {
            servizio: svcHint || undefined,
            zona: zoneHintRaw ? toKnownQuartiere(zoneHintRaw) : undefined,
            urgenza: urgHint || undefined,
          },
        }),
        { headers: { "content-type": "application/json" }, status: 200 }
      );
    }

    // Vision payload: SOLO se chiede prezzo o ci sono immagini
    const needVision = images.length > 0 || wantPrice;

    const userContent: MsgPart[] = [
      {
        type: "text",
        text: needVision
          ? `${lastUserText}\n\n${buildVisionInstructions(svcHint || undefined)}`
          : `${lastUserText}`,
      },
    ];

    // inline images (data URL)
    const resolvedImages: string[] = [];
    for (const url of images) {
      const dataUrl = await toDataUrl(url);
      if (dataUrl) resolvedImages.push(dataUrl);
    }
    for (const dataUrl of resolvedImages) {
      userContent.push({ type: "image_url", image_url: { url: dataUrl } });
    }

    // System prompt dinamico
    const system = buildSystemPrompt(QUARTIERI_LIST, {
      service_hint: svcHint || undefined,
      zone_hint: zoneHintRaw || undefined,
      urgency_hint: urgHint || undefined,
    });

    // Tipi corretti per OpenAI
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      { role: "system", content: `Listino presente: ${TARIFFS ? "SÌ" : "NO"}` },
      ...history.slice(0, -1).map<ChatCompletionMessageParam>((m) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : "",
      })),
      {
        role: "user",
        content: userContent as unknown as ChatCompletionContentPart[],
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages,
    });

    let text = completion.choices?.[0]?.message?.content ?? "";

    // 1) Estrai lead
    const r = extractLeadAndStrip(text) as { text: string; lead: unknown };
    const cleanedText = r.text;
    let lead: LeadShape | null =
      r.lead && typeof r.lead === "object" ? (r.lead as LeadShape) : null;

    text = cleanedText;

    // 2) Normalizza lead + integra hint
    if (lead?.zona) lead.zona = toKnownQuartiere(lead.zona);
    if (!lead?.servizio && svcHint) lead = { ...(lead || {}), servizio: svcHint };
    if (!lead?.urgenza && urgHint) lead = { ...(lead || {}), urgenza: urgHint };
    if (!lead?.zona && zoneHintRaw) lead = { ...(lead || {}), zona: toKnownQuartiere(zoneHintRaw) };
    if (images.length) {
      lead = lead || {};
      lead.extra = {
        ...(lead.extra || {}),
        foto_url: (lead?.extra as { foto_url?: string })?.foto_url || images[0],
      };
    }

    // 3) Pricing FABBRO — SOLO range, SOLO se vuole il prezzo o c'è foto
    if (
      (wantPrice || images.length > 0) &&
      lead?.servizio === "fabbro" &&
      /porta|serratura/i.test(String(lead?.problema || ""))
    ) {
      const range = TARIFFS ? computeFabbroRange(TARIFFS) : null;
      if (range) {
        const extra = range.nightAdd
          ? ` In caso di notte/festivi si aggiungono circa € ${range.nightAdd.min} – € ${range.nightAdd.max}.`
          : "";
        text =
          `${text}\n\n💡 Stima indicativa: apertura porta € ${range.min} – € ${range.max}.` +
          `${extra}\nIl prezzo preciso lo conferma il professionista in base alla situazione sul posto.` +
          `${images.length === 0 ? ` Se puoi, mandami una foto della toppa/cilindro per affinare la stima.` : ``}`;
        lead.pricing = {
          ready: false,
          item: "apertura_porta_range",
          price: 0,
          note: `${range.min}-${range.max}`,
        };
      }
    }

    // Se chiede prezzo senza foto (altri servizi), ricordagli la foto per affinare
    if (wantPrice && images.length === 0) {
      text = `${text}\n\nPer stimare meglio, se puoi, inviami una foto del punto (es. toppa/serratura o dettaglio rilevante).`;
    }

    // 4) Header urgenza
    const urg = (lead?.urgenza || "").toString().toLowerCase();
    const isImmediate = /\b(subito|immediato|adesso|ora)\b/.test(urg);
    if (isImmediate && !/^🚨 Urgenza: chiama ORA l’800 00 24 24/i.test(text)) {
      text = `🚨 Urgenza: chiama ORA l’800 00 24 24\n\n${text}`;
    }

    // 5) Gratuità chiamata
    if (/quanto.*costa.*chiamata|costa.*telefonata|prezzo.*chiamare/i.test(lastUserText)) {
      text = `${text}\n\nℹ️ Le chiamate verso 800 00 24 24 sono completamente gratuite, anche da cellulare.`;
    }

    // 6) Dedup & scrub (solo user/assistant, niente system)
    const historyUA: HistMsgUA[] = history
      .filter(
        (m): m is { role: "user" | "assistant"; content: string } =>
          (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
      )
      .map((m) => ({ role: m.role, content: m.content }));

    text = dedupeAssistantText(text, historyUA);
    text = scrub(text);

    // 7) costo stimato
    const u = completion.usage;
    let cost: number | null = null;
    if (u && (PRICE_IN || PRICE_OUT)) {
      cost = (u.prompt_tokens || 0) * PRICE_IN + (u.completion_tokens || 0) * PRICE_OUT;
    }

    return new Response(JSON.stringify({ text, lead, usage: u, estimated_cost: cost }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore";
    return new Response(JSON.stringify({ error: msg }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

