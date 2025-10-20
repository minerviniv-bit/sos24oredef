"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatLeadPanel from "./ChatLeadPanel";

type Msg = { role: "user" | "assistant"; content: string };

type LeadPricing = { ready?: boolean; item?: string; price?: number; note?: string };
type LeadExtra = {
  lock_type?: string;
  chiave_spezzata?: boolean;
  foto_url?: string;
  confidence?: number;
};
type Lead = {
  servizio?: string;
  zona?: string;
  urgenza?: "bassa" | "media" | "alta" | "subito" | "oggi" | "non urgente" | string;
  fascia_oraria?: string;
  problema?: string;
  accesso?: string;
  note?: string;
  extra?: LeadExtra;
  pricing?: LeadPricing;
  contatto?: { nome?: string; telefono?: string };
  handoff?: { wants_operator?: boolean };
};

const CHAT_KEY = process.env.NEXT_PUBLIC_CHAT_GATE_KEY || ""; // <-- necessario per /api/chat e /api/lead

function cleanAssistantText(s: string) {
  if (!s) return s;
  s = s.replace(/LEAD\s*\{[\s\S]*$/m, "").trim();
  s = s.replace(/👉\s*Per confermare.*800\s*00\s*24\s*24\.?\s*$/i, "").trim();
  s = s.replace(/Vuoi che ti metta in contatto.*(rispondi.*sì.*)?$/i, "").trim();
  return s;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Ciao! Sono l’assistente SOS24ORE. Dimmi il problema e in che quartiere ti trovi. Se vuoi il prezzo indicativo, puoi allegare una foto.",
    },
  ]);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingLead, setSendingLead] = useState(false);
  const [sentOk, setSentOk] = useState<null | boolean>(null);

  // 📎 foto tenuta in stato e ri-usata in ogni richiesta
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendText(text: string, inlineImageUrl?: string) {
    const t = (text || "").trim();
    if (!t || loading) return;

    const next = [...messages, { role: "user", content: t }];
    setMessages(next);
    setLoading(true);
    setSentOk(null);

    try {
      const imgs = (inlineImageUrl || imageUrl) ? [inlineImageUrl || imageUrl!] : [];

      const r = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-chat-key": CHAT_KEY, // <-- QUI
        },
        body: JSON.stringify({
          messages: next,
          images: imgs,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || r.statusText);

      const cleaned = cleanAssistantText(j.text || "");
      setMessages((m) => [...m, { role: "assistant", content: cleaned || "(nessuna risposta)" }]);

      if (j.lead) setLead(j.lead as Lead);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Si è verificato un errore temporaneo. Riprova tra poco oppure chiama l’800 00 24 24.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function confirmAndSendLead() {
    if (!leadReady || sendingLead) return;
    setSendingLead(true);
    setSentOk(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-chat-key": CHAT_KEY, // <-- E QUI
        },
        body: JSON.stringify({
          source: "chat",
          lead,
          transcript: messages,
          when: new Date().toISOString(),
        }),
      });
      setSentOk(res.ok);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Invio non riuscito");
      }
    } catch {
      setSentOk(false);
    } finally {
      setSendingLead(false);
    }
  }

  const leadReady =
    !!lead &&
    !!lead.servizio &&
    !!lead.zona &&
    (!!lead.problema || !!lead?.pricing?.ready);

  return (
    <main className="min-h-screen bg-[#0b1220] text-zinc-100">
      {/* HERO compatto */}
      <section className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-8 md:py-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
              SOS24ORE.it • Chat assistita
            </div>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
              Parla con un operatore — <span className="text-emerald-300">H24</span>
            </h1>
            <p className="mt-1 max-w-[52ch] text-sm text-zinc-300">
              Descrivi il problema e il quartiere. Se vuoi un prezzo indicativo, allega una foto: ci aiuta
              a stimare. Altrimenti passo subito i dati all’operatore.
            </p>
          </div>

          {/* Mascotte */}
          <div className="relative hidden w-[240px] shrink-0 md:block">
            <div className="absolute -inset-2 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
              <Image
                src="/mascotte/chat.webp"
                alt="Mascotte SOS24ORE"
                width={560}
                height={560}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* LAYOUT a due colonne */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[minmax(0,1fr)_360px]">
        {/* COLONNA CHAT */}
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
          {/* testata */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
            <div className="text-xs text-zinc-300">
              Chat SOS24ORE •{" "}
              <span className="text-zinc-400">l’assistente fa 2 domande e avvia l’operatore</span>
            </div>
            <a
              href="tel:800002424"
              className="hidden rounded-lg border border-emerald-500/50 bg-emerald-600/20 px-2 py-1 text-xs font-semibold text-emerald-200 hover:bg-emerald-600/30 md:inline"
            >
              800 00 24 24
            </a>
          </div>

          {/* lista messaggi */}
          <div ref={listRef} className="h-[60vh] w-full overflow-y-auto px-3 py-3 md:h-[66vh]">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <ChatMessage key={i} role={m.role} content={m.content} />
              ))}
              {loading && (
                <div className="pl-2 text-xs text-zinc-400">Capitan SOS sta scrivendo…</div>
              )}
            </div>
          </div>

          {/* input area */}
          <div className="border-t border-white/10 p-3">
            <ChatInput
              onSend={(t) => sendText(t)}
              onImagePicked={(url) => {
                setImageUrl(url); // conservala per i turni successivi
                setMessages((m) => [
                  ...m,
                  {
                    role: "assistant",
                    content:
                      "📎 Foto allegata. Se vuoi una stima di prezzo provo a valutarla dalla foto; altrimenti procedo senza.",
                  },
                ]);
              }}
            />

            {/* Badge foto allegata */}
            {imageUrl && (
              <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
                <span>Foto allegata •</span>
                <a href={imageUrl} target="_blank" className="underline">
                  apri
                </a>
                <button
                  className="ml-auto rounded-md border border-white/10 px-2 py-0.5 hover:bg-white/10"
                  onClick={() => setImageUrl(null)}
                >
                  Rimuovi foto
                </button>
              </div>
            )}

            <p className="mt-2 text-[11px] leading-snug text-zinc-400">
              L’assistente screma le informazioni; i dati vengono inviati all’operatore solo dopo la
              tua conferma. Le chiamate verso <b>800 00 24 24</b> sono completamente gratuite, anche da
              cellulare.
            </p>
          </div>
        </div>

        {/* COLONNA RIEPILOGO */}
        <aside className="sticky top-[72px] h-fit space-y-3">
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
            <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-amber-300">
              Riepilogo per operatore
            </div>
            <ChatLeadPanel
              lead={lead}
              onConfirm={confirmAndSendLead}
              disabled={!leadReady || sendingLead}
              sending={sendingLead}
              sentOk={sentOk}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-zinc-300">
              Hai urgenza? <span className="font-semibold text-white">Chiama ora</span>
            </div>
            <a
              href="tel:800002424"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/50 bg-emerald-600/20 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-600/30"
            >
              800 00 24 24
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
