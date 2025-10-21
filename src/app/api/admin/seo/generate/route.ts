// src/app/api/admin/seo/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_WORDS = Number(process.env.SEO_MIN_WORDS || 300);
const MODEL_AREAS = process.env.SEO_MODEL_AREAS || "gpt-4o-mini";

type FAQItem = { q: string; a: string };
type SEO = {
  title?: string;
  meta_description?: string;
  h1?: string;
  body_html?: string;
  faqs?: FAQItem[];
  json_ld?: unknown;
};
type GeneratedItem = {
  key: string;
  scope: "area" | "city";
  service: string;
  city: string;
  area_slug?: string;
  model_used: string;
  seo: SEO;
};
type GenerateBody = {
  type: "area" | "city";
  service: string;
  city: string;
  areas?: unknown;
  model?: string;
};

// ===== Utility =====
function wordCountFromHtml(html: string) {
  const txt = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return txt ? txt.split(" ").length : 0;
}

function harden(html: string, numeroVerde = "800 00 24 24") {
  let out = String(html || "");
  if (!/800\s*00\s*24\s*24/.test(out)) {
    out += `<h2>Chiama ora</h2><p>Numero Verde <strong>${numeroVerde}</strong>. Prezzo e tempi comunicati prima dell’uscita.</p>`;
  }
  if (!/collega gli utenti a professionisti indipendenti/i.test(out)) {
    out += `<p class="text-xs opacity-70"><em>SOS24ORE.it collega gli utenti a professionisti indipendenti; non eseguiamo lavori e non siamo responsabili degli interventi.</em></p>`;
  }
  return out;
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function getOutputText(resp: unknown): string {
  if (resp && typeof resp === "object" && "output_text" in resp) {
    const t = (resp as { output_text?: unknown }).output_text;
    if (typeof t === "string") return t;
  }
  return "";
}

function toFaq(f: unknown): FAQItem {
  const obj = (f ?? {}) as Record<string, unknown>;
  const q = typeof obj.q === "string" ? obj.q : String(obj.q ?? "");
  const a = typeof obj.a === "string" ? obj.a : String(obj.a ?? "");
  return { q: q.trim(), a: a.trim() };
}

// ===== MAIN HANDLER =====
export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "OPENAI_API_KEY mancante" }, { status: 500 });
    }

    const body = (await req.json()) as Partial<GenerateBody>;
    const { type, service, city, areas = [], model } = body || {};
    if (!type || !service || !city) {
      return NextResponse.json({ ok: false, error: "Parametri mancanti" }, { status: 400 });
    }

    const areasArr: string[] = Array.isArray(areas) ? areas.map(String) : [];
    if (type === "area" && areasArr.length === 0) {
      return NextResponse.json({ ok: false, error: "Nessuna area fornita per scope=area" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const modelToUse = ["gpt-4o", "gpt-4o-mini"].includes(String(model))
      ? String(model)
      : MODEL_AREAS;

    // ===== Prompt base SEO =====
    const sys = [
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
      "- Ripeti il Numero Verde 800 00 24 24 almeno due volte, in sezioni diverse.",
      "- CTA chiara all’inizio e alla fine: invoglia a chiamare subito.",
      "- Chiusura con disclaimer obbligatorio: 'SOS24ORE.it collega gli utenti a professionisti indipendenti; non eseguiamo lavori e non siamo responsabili degli interventi.'",
      "",
      `Vincolo: body_html minimo ${MIN_WORDS} parole.`,
      "Stile: discorsivo, ricco, vario. Evita frasi troppo corte e ripetitive. Ogni paragrafo deve sembrare scritto da un esperto umano.",
    ].join("\n");

    // ===== Generatore singolo =====
    async function generateOne(areaSlug?: string): Promise<GeneratedItem> {
      const user = [
        `Servizio: ${service}`,
        `Città: ${city}`,
        areaSlug ? `Area/Quartiere: ${areaSlug}` : "",
        "",
        `Ritorna JSON: { "title", "meta_description", "h1", "body_html", "faqs":[{"q","a"}], "json_ld":{"localBusiness":{...},"faqPage":{...},"breadcrumb":{...}} }`,
      ]
        .filter(Boolean)
        .join("\n");

      const prompt = `${sys}\n---\n${user}`;

      const r = await openai.responses.create({
        model: modelToUse,
        input: prompt,
        temperature: 0.4,
      });

      let raw = getOutputText(r).trim();
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      }

      let seo: SEO;
      try {
        const parsed = JSON.parse(raw) as Partial<SEO>;
        seo = {
          title: parsed.title,
          meta_description: parsed.meta_description,
          h1: parsed.h1,
          body_html: parsed.body_html,
          faqs: Array.isArray(parsed.faqs)
            ? parsed.faqs.map(toFaq).filter((f) => f.q && f.a)
            : [],
          json_ld: parsed.json_ld,
        };
      } catch {
        const safeCity = city ?? "";
        const safeArea = areaSlug ?? "";
        const safeService = service ?? "";
        const place = safeArea ? `${cap(safeArea)} – ${cap(safeCity)}` : cap(safeCity);

        seo = {
          title: `${cap(safeService)} ${place} | SOS24ORE.it`,
          meta_description: `Interventi ${safeService} a ${place}. Numero Verde 800 00 24 24.`,
          h1: `${cap(safeService)} a ${safeArea ? cap(safeArea) : cap(safeCity)}`,
          body_html: "<p>Contenuto generato. Estensione automatica in corso…</p>",
          faqs: [],
          json_ld: { "@type": "LocalBusiness", name: "SOS24ORE.it" },
        };
      }

      // ===== Espansione automatica se troppo corto =====
      let html = harden(String(seo.body_html || ""));
      let tries = 0;
      while (wordCountFromHtml(html) < MIN_WORDS && tries < 2) {
        tries++;
        const deficit = MIN_WORDS - wordCountFromHtml(html);
        const extendPrompt = [
          sys,
          "Estendi il seguente testo in italiano, senza ripetizioni, aggiungi dettagli locali (vie/landmark reali), H2/H3 utili.",
          `Aggiungi almeno +${Math.max(120, deficit)} parole.`,
          "Testo HTML:",
          html,
        ].join("\n\n");

        const ext = await openai.responses.create({
          model: modelToUse,
          input: extendPrompt,
          temperature: 0.4,
        });

        let more = getOutputText(ext).trim();
        if (more.startsWith("```")) {
          more = more.replace(/^```(html)?/i, "").replace(/```$/, "").trim();
        }
        html += "\n" + more;
      }

      seo.body_html = harden(html);

      const safeService = service ?? "";
      const safeCity = city ?? "";

      return {
        key: areaSlug ? `${safeService}:${safeCity}:${areaSlug}` : `${safeService}:${safeCity}`,
        scope: areaSlug ? "area" : "city",
        service: safeService,
        city: safeCity,
        area_slug: areaSlug || undefined,
        model_used: modelToUse,
        seo,
      };
    }

    // ===== Esecuzione globale =====
    const items: GeneratedItem[] = [];
    if (type === "area") {
      for (const a of areasArr) items.push(await generateOne(String(a)));
    } else {
      items.push(await generateOne());
    }

    return NextResponse.json({ ok: true, items });
  } catch (e: unknown) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

