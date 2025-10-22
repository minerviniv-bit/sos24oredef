// src/app/cookie/CookieManager.tsx
"use client";

import { useEffect, useState } from "react";

/* ---------- Tipi e helpers senza any ---------- */
type ConsentBasic = "essential" | "all";

type GtagFn = (...args: unknown[]) => void;
type DataLayerItem = Record<string, unknown>;
type DataLayer = { push: (item: DataLayerItem) => number };

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: DataLayer;
  }
}

const COOKIE_NAME = "sos_cc";
const MAX_AGE_DAYS = 180;

function isHttps(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
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

function applyIntegrations(v: ConsentBasic) {
  const granted = v === "all";

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
    });
  }

  if (typeof window !== "undefined") {
    if (!window.dataLayer) window.dataLayer = { push: () => 0 };
    window.dataLayer.push({
      event: "consent_update",
      consent_mode: v,
      analytics_consent: granted,
      marketing_consent: granted,
    });
  }
}

/* ---------- Component ---------- */
export default function CookieManager() {
  const [consent, setConsent] = useState<ConsentBasic>("essential");

  useEffect(() => {
    const raw = readCookie(COOKIE_NAME);
    const v: ConsentBasic = raw === "all" ? "all" : "essential";
    setConsent(v);
    applyIntegrations(v);
  }, []);

  function applyConsent(v: ConsentBasic) {
    writeCookie(COOKIE_NAME, v, MAX_AGE_DAYS);
    setConsent(v);
    applyIntegrations(v);
  }

  function resetConsent() {
    deleteCookie(COOKIE_NAME);
    setConsent("essential");
    applyIntegrations("essential");
    // opzionale: location.reload();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 p-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm">
        Stato consenso: <b className="text-emerald-400">{consent}</b>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => applyConsent("essential")}
          className={`rounded px-3 py-2 border ${
            consent === "essential" ? "border-emerald-500/60" : "border-zinc-700 hover:border-zinc-500"
          }`}
          aria-pressed={consent === "essential"}
        >
          Solo essenziali
        </button>
        <button
          onClick={() => applyConsent("all")}
          className={`rounded px-3 py-2 border ${
            consent === "all" ? "border-emerald-500/60" : "border-zinc-700 hover:border-zinc-500"
          }`}
          aria-pressed={consent === "all"}
        >
          Accetta tutti
        </button>
        <button
          onClick={resetConsent}
          className="rounded border border-zinc-700 px-3 py-2 hover:border-zinc-500"
        >
          Reset preferenze
        </button>
      </div>
    </div>
  );
}
