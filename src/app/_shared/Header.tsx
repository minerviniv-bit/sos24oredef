"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SERVICES } from "./serviceNavConfig";

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  const [open, setOpen] = useState(false);  // mobile menu
  const [mega, setMega] = useState(false);  // mega-menu Servizi
  const path = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);

  // chiudi mega-menu clic fuori
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!megaRef.current) return;
      if (!megaRef.current.contains(e.target as Node)) setMega(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // chiudi overlay quando cambia route
  useEffect(() => { setOpen(false); setMega(false); }, [path]);

  const isActive = (slug: string) => path.startsWith(`/${slug}`);

  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-2 flex-nowrap">
        {/* ===== Wordmark SOS24ORE.it (24 rosso) ===== */}
        <Link href="/" className="relative flex items-center h-10 select-none">
          <span className="absolute -z-10 left-0 top-1 block w-24 h-6 rounded-full bg-red-500/20 blur-lg" />
          <span className="text-[18px] md:text-[20px] font-extrabold tracking-tight leading-none">
            <span className="text-white">SOS</span>
            <span className="mx-[2px] bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
              24
            </span>
            <span className="text-white">ORE</span>
            <span className="text-emerald-400">.it</span>
          </span>
        </Link>

        {/* ===== Desktop nav (una riga, no scrollbar) ===== */}
        <nav className="hidden md:flex items-center gap-2 flex-nowrap">
          {/* Mega menu trigger */}
          <div className="relative" ref={megaRef}>
            <button
              onClick={() => setMega((s) => !s)}
              className="px-2.5 py-2 rounded-lg text-sm text-neutral-100 hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              Servizi <span className="ml-1 text-neutral-400">▾</span>
            </button>

            {/* Mega menu: card → pagina mamma, pill → /roma */}
            {mega && (
              <div className="absolute left-0 mt-2 w-[720px] p-3 rounded-2xl border border-white/10 bg-neutral-950/95 backdrop-blur shadow-2xl">
                <div className="grid grid-cols-3 gap-2">
                  {SERVICES.map((s) => {
                    const mainHref = s.href ?? `/${s.slug}`;  // madre
                    const romaHref = `/${s.slug}/roma`;        // secondario
                    return (
                      <div
                        key={s.slug}
                        className={cx(
                          "group relative rounded-xl p-3 border transition",
                          "border-white/10 bg-black/20 hover:border-white/20"
                        )}
                      >
                        {/* link principale (tutta la card) */}
                        <Link href={mainHref} className="absolute inset-0 z-10" aria-label={s.label} />
                        <div className="flex items-center gap-3">
                          {s.icon ? (
                            <Image src={s.icon} alt={s.label} width={36} height={36} className="rounded-md object-contain" />
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-white/10" />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm text-neutral-100 truncate">{s.label}</div>
                            <div className="text-xs text-neutral-400 truncate">{mainHref}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Link
                            href={romaHref}
                            className="relative z-20 px-2 py-1 rounded-md text-xs border border-white/15 bg-white/5 text-neutral-200 hover:border-white/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Roma
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-neutral-400 px-1">
                  Scegli un servizio e poi la tua zona a Roma.
                </div>
              </div>
            )}
          </div>

          {/* Scorciatoie rapide — sempre una riga, nascondi progressivo */}
          <div className="hidden md:flex items-center gap-1 flex-nowrap overflow-x-hidden">
            {[
              "idraulico",
              "fabbro",
              "elettricista",
              "spurgo",
              "caldaie",
              "disinfestazioni",
              "vetraio",
              "assistenza-stradale",
            ].map((slug, i) => {
              const item = SERVICES.find((s) => s.slug === slug);
              if (!item) return null;

              const short =
                {
                  idraulico: "Idraulico",
                  fabbro: "Fabbro",
                  elettricista: "Elettricista",
                  spurgo: "Spurgo",
                  caldaie: "Caldaie",
                  disinfestazioni: "Disinfestazioni",
                  vetraio: "Vetraio",
                  "assistenza-stradale": "Stradale",
                }[slug] || item.label.split(" ")[0];

              // le prime 4 sempre visibili; 5-6 da lg; 7-8 da xl
              const responsiveHide =
                i >= 6 ? "hidden xl:inline-flex" :
                i >= 4 ? "hidden lg:inline-flex" : "";

              return (
                <Link
                  key={slug}
                  href={item.href ?? `/${slug}`}
                  className={cx(
                    "px-2.5 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-white/5 border",
                    isActive(slug)
                      ? "text-emerald-400 border-emerald-500/40"
                      : "text-neutral-200 border-transparent hover:border-white/10",
                    responsiveHide
                  )}
                  title={item.label}
                >
                  {short}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ===== Azioni (telefono + chat) — una sola riga ===== */}
        <div className="hidden md:flex items-center gap-2 flex-nowrap">
          <a
            href="tel:800002424"
            aria-label="Chiama 800 00 24 24"
            className="inline-flex items-center rounded-lg px-3 py-2
                       bg-emerald-600 text-white font-bold leading-none tracking-tight tabular-nums
                       whitespace-nowrap
                       shadow-[0_6px_14px_-6px_rgba(16,185,129,0.35)]
                       ring-1 ring-emerald-500/30
                       hover:bg-emerald-500 hover:shadow-[0_8px_18px_-8px_rgba(16,185,129,0.45)]
                       transition"
          >
            {`800\u00A000\u00A024\u00A024`}
          </a>

          <Link
            href="/chat"
            className="px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold
                       whitespace-nowrap hover:bg-amber-300 transition"
          >
            Apri Chat
          </Link>
        </div>

        {/* ===== Mobile toggle ===== */}
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-neutral-100"
          onClick={() => setOpen((s) => !s)}
          aria-label="Apri menu"
        >
          ☰
        </button>
      </div>

      {/* ===== Mobile drawer ===== */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-2">
            <details className="rounded-xl border border-white/10">
              <summary className="px-3 py-2 text-sm text-neutral-100 cursor-pointer">Servizi</summary>
              <div className="p-2 grid grid-cols-1 gap-2">
                {SERVICES.map((s) => (
                  <div key={s.slug} className="rounded-lg p-2 border border-white/10 bg-white/5">
                    <Link href={s.href ?? `/${s.slug}`} className="flex items-center gap-3">
                      {s.icon ? (
                        <Image src={s.icon} alt={s.label} width={28} height={28} className="rounded" />
                      ) : (
                        <div className="w-7 h-7 rounded bg-white/10" />
                      )}
                      <span className="text-sm text-neutral-100">{s.label}</span>
                    </Link>
                    <div className="mt-2 flex justify-end">
                      <Link href={`/${s.slug}/roma`} className="px-2 py-1 rounded-md text-xs border border-white/15 bg-white/5 text-neutral-200">
                        Roma
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <div className="flex gap-2">
              <a
                href="tel:800002424"
                className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold text-center whitespace-nowrap"
              >
                {`800\u00A000\u00A024\u00A024`}
              </a>
              <Link
                href="/chat"
                className="flex-1 px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold text-center whitespace-nowrap"
              >
                Apri Chat
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

