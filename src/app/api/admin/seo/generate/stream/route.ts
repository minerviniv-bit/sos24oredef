// src/app/api/admin/seo/generate/stream/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildPrompt({
  service,
  city,
  area,
  numeroVerde = "800 00 24 24",
}: { service: string; city: string; area: string; numeroVerde?: string }) {
  return [
    "Sei un SEO copywriter senior specializzato in contenuti locali per il web.",
    "Obiettivo: generare un testo ottimizzato per Google che posizioni la pagina su query locali competitive.",
    "",
    "Regole fondamentali:",
    "- Lingua italiana naturale e scorrevole, tono professionale ma chiaro.",
    "- H1: deve contenere la keyword principale (servizio + zona).",
    "- Usa H2 e H3 per sinonimi e varianti della keyword, sempre discorsivi.",
    "- Inserisci co-occorrenze e parole correlate: 'emergenza', 'pronto intervento', '24 ore', 'preventivo', 'trasparenza', 'artigiano locale'.",
    "- Ogni 200 parole inserisci almeno una lista puntata con 3-5 punti.",
    "- Descrivi benefici, problemi risolti, perché scegliere questo servizio.",
    "- Inserisci riferimenti reali alla zona: vie, piazze, metro, punti di interesse.",
    `- Ripeti il Numero Verde ${numeroVerde} almeno due volte, in sezioni diverse.`,
    "- CTA chiara all’inizio e alla fine: invoglia a chiamare subito.",
    "- Chiusura con disclaimer obbligatorio: 'SOS24ORE.it collega gli utenti a professionisti indipendenti; non eseguiamo lavori e non siamo responsabili degli interventi.'",
    "",
    "- Lunghezza minima: almeno 600 parole (meglio 800–900).",
    "- Stile: discorsivo, ricco, vario. Evita frasi troppo corte e ripetitive.",
    "",
    `Servizio: ${service}`,
    `Città: ${city}`,
    `Zona/Quartiere: ${area}`,
    `CTA: Chiama Numero Verde ${numeroVerde}`,
    "",
    "Output richiesto (solo HTML del corpo, senza <html> ecc.):",
    "- <h2> e <h3> con contenuti discorsivi",
    "- almeno 600-900 parole complessive",
    "- chiusura con CTA e disclaimer",
  ].join("\n");
}

function fallbackStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      const parts = text.match(/.{1,220}/gs) || [text];
      let i = 0;
      const tick = () => {
        if (i >= parts.length) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(parts[i]));
        i++;
        setTimeout(tick, 40);
      };
      tick();
    },
  });
}

type StreamBody = {
  service?: string;
  city?: string;
  area?: string;
  area_slug?: string;
  model?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StreamBody;
    const service = String(body?.service || "").toLowerCase();
    const city = String(body?.city || "").toLowerCase();
    const area = String(body?.area || body?.area_slug || "").toLowerCase();

    // ✅ usa solo modelli ufficiali, fallback su mini
    const requestedModel = typeof body?.model === "string" ? body.model : undefined;
    const model = ["gpt-4o", "gpt-4o-mini"].includes(requestedModel || "")
      ? (requestedModel as "gpt-4o" | "gpt-4o-mini")
      : ((process.env.SEO_MODEL_AREAS || "gpt-4o-mini") as "gpt-4o" | "gpt-4o-mini");

    if (!service || !city || !area) {
      return NextResponse.json({ error: "missing service/city/area" }, { status: 400 });
    }

    const sys = buildPrompt({ service, city, area });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const html = `<h2>${service} a ${area} (${city})</h2>
<p>Interventi rapidi e trasparenti. Prezzo comunicato prima dell’uscita.</p>
<h3>Perché sceglierci</h3>
<ul><li>Professionisti locali indipendenti</li><li>Disponibilità 24/7</li><li>Preventivo chiaro</li></ul>
<h3>Servizi</h3>
<ul><li>Riparazioni e manutenzioni</li><li>Emergenze</li><li>Installazioni</li></ul>
<p><strong>Chiama il Numero Verde 800 00 24 24</strong></p>
<p><em>SOS24ORE.it collega gli utenti a professionisti indipendenti; non eseguiamo lavori e non siamo responsabili degli interventi.</em></p>`;
      return new Response(fallbackStream(html), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const openai = new OpenAI({ apiKey });

    // ✅ streaming su modelli ufficiali
    const completion = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: "Genera ora il testo HTML richiesto." },
      ],
      temperature: 0.6,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices?.[0]?.delta?.content || "";
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch {
          controller.enqueue(encoder.encode("\n<!-- Errore streaming -->"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

