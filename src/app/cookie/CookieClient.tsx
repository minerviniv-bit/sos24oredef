// src/app/cookie/CookieClient.tsx
"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* Tipi senza any */
type GtagFn = (...args: unknown[]) => void;
type DataLayerItem = Record<string, unknown>;
type DataLayer = { push: (item: DataLayerItem) => number };

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: DataLayer;
  }
}

/* Config */
const CONSENT_COOKIE = "sos_cc";
const CONSENT_MAX_AGE_DAYS = 180 as const;

export type Consent = "essential" | "all" | "custom";
export type ConsentPrefs = { analytics: boolean; marketing: boolean };

const DEFAULT_PREFS: ConsentPrefs = { analytics: false, marketing: false };

/* Helpers cookie */
function isHttps(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
function writeCookie(name: string, value: string, days = 180) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${d.toUTCString()}`,
    "path=/",
    "SameSite=Lax",
  ];
  if (isHttps()) parts.push("Secure");
  document.cookie = parts.join("; ");
}
function deleteCookie(name: string) {
  const parts = [
    `${name}=`,
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "path=/",
    "SameSite=Lax",
  ];
  if (isHttps()) parts.push("Secure");
  document.cookie = parts.join("; ");
}

/* Integrations */
function applyConsentToIntegrations(consent: Consent, prefs?: ConsentPrefs) {
  const analyticsGranted =
    consent === "all" || (consent === "custom" && !!prefs?.analytics);
  const marketingGranted =
    consent === "all" || (consent === "custom" && !!prefs?.marketing);

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analyticsGranted ? "granted" : "denied",
      ad_storage: marketingGranted ? "granted" : "denied",
      ad_user_data: marketingGranted ? "granted" : "denied",
      ad_personalization: marketingGranted ? "granted" : "denied",
    });
  }
  if (typeof window !== "undefined") {
    if (!window.dataLayer) window.dataLayer = { push: () => 0 };
    window.dataLayer.push({
      event: "consent_update",
      consent_mode: consent,
      analytics_consent: analyticsGranted,
      marketing_consent: marketingGranted,
    });
  }
}

/* Serializzazione */
function parseStoredConsent(): { mode: Consent; prefs: ConsentPrefs } {
  const raw = readCookie(CONSENT_COOKIE);
  if (!raw) return { mode: "essential", prefs: { ...DEFAULT_PREFS } };
  try {
    const obj = JSON.parse(raw) as Partial<{ mode: Consent } & ConsentPrefs>;
    if (obj && obj.mode === "custom") {
      return {
        mode: "custom",
        prefs: { analytics: !!obj.analytics, marketing: !!obj.marketing },
      };
    }
  } catch {}
  if (raw === "all") return { mode: "all", prefs: { analytics: true, marketing: true } };
  return { mode: "essential", prefs: { ...DEFAULT_PREFS } };
}
function saveConsent(mode: Consent, prefs?: ConsentPrefs) {
  if (mode === "custom") {
    writeCookie(
      CONSENT_COOKIE,
      JSON.stringify({
        mode: "custom",
        analytics: !!prefs?.analytics,
        marketing: !!prefs?.marketing,
      }),
      CONSENT_MAX_AGE_DAYS
    );
  } else {
    writeCookie(CONSENT_COOKIE, mode, CONSENT_MAX_AGE_DAYS);
  }
}

/* UI (NESSUN <main>) */
export default function CookieClient() {
  const [mode, setMode] = useState<Consent>("essential");
  const [prefs, setPrefs] = useState<ConsentPrefs>({ ...DEFAULT_PREFS });

  useEffect(() => {
    const stored = parseStoredConsent();
    setMode(stored.mode);
    setPrefs(stored.prefs);
    applyConsentToIntegrations(stored.mode, stored.prefs);
  }, []);

  const statusLabel = useMemo(() => {
    if (mode === "all") return "tutti i cookie abilitati";
    if (mode === "essential") return "solo cookie essenziali";
    const parts: string[] = [];
    if (prefs.analytics) parts.push("analytics");
    if (prefs.marketing) parts.push("marketing");
    return parts.length ? `personalizzato: ${parts.join(" + ")}` : "personalizzato: nessuno";
  }, [mode, prefs.analytics, prefs.marketing]);

  function acceptAll() {
    const next: ConsentPrefs = { analytics: true, marketing: true };
    setMode("all");
    setPrefs(next);
    saveConsent("all");
    applyConsentToIntegrations("all", next);
  }
  function essentialOnly() {
    const next: ConsentPrefs = { analytics: false, marketing: false };
    setMode("essential");
    setPrefs(next);
    saveConsent("essential");
    applyConsentToIntegrations("essential", next);
  }
  function applyCustom() {
    setMode("custom");
    saveConsent("custom", prefs);
    applyConsentToIntegrations("custom", prefs);
  }
  function reset() {
    deleteCookie(CONSENT_COOKIE);
    const base: ConsentPrefs = { ...DEFAULT_PREFS };
    setMode("essential");
    setPrefs(base);
    applyConsentToIntegrations("essential", base);
  }

  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Gestione preferenze e informazioni sull’uso dei cookie.
      </p>

      {/* Sezione informativa */}
      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">1) Cosa sono i cookie</h2>
        <p className="text-zinc-200">
          I cookie sono piccoli file di testo che i siti inviano al dispositivo
          dell’utente dove vengono memorizzati per essere poi ritrasmessi agli
          stessi siti alla visita successiva.
        </p>

        <h2 className="mt-6 text-xl font-semibold">2) Tipologie usate</h2>
        <ul className="list-inside list-disc text-zinc-200">
          <li><b>Tecnici/necessari</b>: per il corretto funzionamento del sito e la sicurezza.</li>
          <li><b>Analytics</b> (opzionali): raccolta anonimizzata/aggregata (solo con consenso).</li>
          <li><b>Marketing</b> (opzionali): profilazione/remarketing (solo con consenso).</li>
        </ul>
      </section>

      {/* Stato + pulsanti */}
      <section className="mt-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm">
              Stato consenso: <b className="text-emerald-400">{statusLabel}</b>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={essentialOnly}
                className={`rounded px-3 py-2 text-sm transition border ${
                  mode === "essential" ? "border-emerald-500/60" : "border-zinc-700 hover:border-zinc-500"
                }`}
                aria-pressed={mode === "essential"}
              >
                Solo essenziali
              </button>
              <button
                onClick={acceptAll}
                className={`rounded px-3 py-2 text-sm transition border ${
                  mode === "all" ? "border-emerald-500/60" : "border-zinc-700 hover:border-zinc-500"
                }`}
                aria-pressed={mode === "all"}
              >
                Accetta tutti
              </button>
              <button
                onClick={reset}
                className="rounded border border-zinc-700 px-3 py-2 text-sm hover:border-zinc-500"
              >
                Reset preferenze
              </button>
            </div>
          </div>

          {/* Personalizzazione */}
          <div className="mt-4 rounded-xl border border-white/10 p-4">
            <h3 className="mb-2 font-semibold">Impostazioni personalizzate</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.currentTarget.checked }))}
                />
                <span>Abilita Analytics</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.currentTarget.checked }))}
                />
                <span>Abilita Marketing</span>
              </label>
            </div>

            <button
              onClick={applyCustom}
              className="mt-3 inline-flex items-center rounded border border-emerald-500/60 px-3 py-2 text-sm hover:bg-emerald-500/10"
            >
              Salva impostazioni personalizzate
            </button>
          </div>
        </div>
      </section>

      {/* Elenco cookie */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">4) Elenco cookie</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/60">
              <tr>
                <th className="px-3 py-2 text-left">Nome</th>
                <th className="px-3 py-2 text-left">Tipo</th>
                <th className="px-3 py-2 text-left">Scopo</th>
                <th className="px-3 py-2 text-left">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-zinc-800">
                <td className="px-3 py-2">{CONSENT_COOKIE}</td>
                <td className="px-3 py-2">Tecnico</td>
                <td className="px-3 py-2">Memorizza le preferenze cookie</td>
                <td className="px-3 py-2">{CONSENT_MAX_AGE_DAYS} giorni</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          Per maggiori dettagli consulta la{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </section>
    </div>
  );
}
