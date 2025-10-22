"use client";

import Image from "next/image";
import MapBox from "./MapBox";

type ClientLite = { name: string; logoUrl?: string; isFallback?: boolean };
type InfoItem   = { label: string; value: string };
type FaqItem    = { q: string; a: string };

export default function DistrictPageShell({
  mascotSrc,                 // compatibilità
  serviceLabel,
  cityLabel,
  districtLabel,
  heroSubtitle,
  sponsorNote,               // compatibilità
  tags,                      // compatibilità
  client,
  companySeoHtml,
  nearby,                    // compatibilità
  servicesOffered,
  infoRapide,
  numeroVerde,
  whatsappHref,
  seoBottomHtml,
  faqs,

  // opzionali per non rompere build quando passati dal chiamante
  piva,
  rating,
  interventiMese,
  telefonoCliente,
}: {
  mascotSrc: string;
  serviceLabel: string;
  cityLabel: string;
  districtLabel: string;
  heroSubtitle?: string;
  sponsorNote?: string;
  tags?: string[];
  client: ClientLite;
  companySeoHtml: string;
  nearby: Array<{ label: string; href?: string }>;
  servicesOffered: string[];
  infoRapide: InfoItem[];
  numeroVerde: string;
  whatsappHref?: string;
  seoBottomHtml?: string;
  faqs?: FaqItem[];

  // extra opzionali
  piva?: string | null;
  rating?: number | null;
  interventiMese?: number | null;
  telefonoCliente?: string | null;
}) {
  const logo = client.logoUrl || "/logos/logo.webp";

  return (
    <main className="min-h-screen bg-[#0c1320] text-white">
      {/* HERO */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {/* Logo cliente */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 grid place-items-center overflow-hidden">
            <Image
              src={logo}
              alt={client.name}
              width={320}
              height={192}
              className="object-contain w-full h-48 p-2 rounded-xl bg-black/10"
              priority
            />
          </div>

          {/* Testi + NV + WhatsApp */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm uppercase tracking-wide text-white/70">
              {serviceLabel} a {districtLabel} – {cityLabel}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">Pronto Intervento in zona</h1>
            <p className="mt-2 text-white/80">
              {heroSubtitle ??
                `Interventi H24 a ${districtLabel}. Perdite d’acqua, tubi rotti, WC otturati, allagamenti.`}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/60">Numero Verde</div>
                <a
                  href={`tel:${numeroVerde.replace(/\s/g, "")}`}
                  className="text-2xl font-extrabold tracking-tight"
                >
                  {numeroVerde}
                </a>
              </div>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm hover:bg-emerald-500/20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
            </div>

            {/* micro-strip fiducia (render solo se esistono dati) */}
            {(piva || typeof rating === "number" || typeof interventiMese === "number") && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {piva && (
                  <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">
                    P.IVA verificata
                  </span>
                )}
                {typeof rating === "number" && (
                  <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">
                    Rating {rating.toFixed(1)} / 5
                  </span>
                )}
                {typeof interventiMese === "number" && (
                  <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">
                    Interventi mese: {interventiMese}
                  </span>
                )}
                {telefonoCliente && (
                  <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/15">
                    Tel. {telefonoCliente}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {/* Colonna sinistra */}
          <div className="md:col-span-2 space-y-6">
            {/* Scheda azienda */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Scheda Azienda</h2>
              <div
                className="mt-2 text-white/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: companySeoHtml }}
              />
            </div>

            {/* Servizi offerti */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Servizi offerti</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {servicesOffered.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-sm">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Info rapide */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Info rapide</h3>
              <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
                {infoRapide.map((it) => (
                  <div key={it.label} className="rounded-xl bg-black/20 p-3 border border-white/10">
                    <div className="opacity-60">{it.label}</div>
                    <div className="mt-1 font-medium">{it.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO in fondo */}
            {seoBottomHtml && (
              <div
                className="rounded-2xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: seoBottomHtml }}
              />
            )}
          </div>

          {/* Colonna destra */}
          <div className="space-y-6">
            {faqs && faqs.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold mb-3">FAQ</h3>
                <div className="divide-y divide-white/10">
                  {faqs.map(({ q, a }, i) => (
                    <details key={q + i} className="py-3">
                      <summary className="cursor-pointer select-none text-white/90">{q}</summary>
                      <p className="mt-1 text-white/70 text-sm">{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Mappa reale della zona */}
            <MapBox address={`${districtLabel}, ${cityLabel}, Italia`} />
          </div>
        </div>
      </section>
    </main>
  );
}
