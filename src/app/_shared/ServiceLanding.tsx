"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

/* =========================
   TYPES
   ========================= */
type Pill = { title: string; desc: string };
type FAQ = { q: string; a: string };
type City = { slug: string; label: string };

export type ServiceLandingProps = {
  service:
    | "idraulico"
    | "fabbro"
    | "elettricista"
    | "spurgo"
    | "caldaie"
    | "vetraio"
    | "apertura-porte"
    | "disinfestazioni"
    | "assistenza-stradale";
  titleH1: string;
  subH1: string;

  heroLogo?: string;     // es. "/logos/logo.webp"
  heroMascotte: string;  // es. "/mascotte/idraulico.webp"

  numeroVerde: string;   // es. "800 00 24 24"
  ctaChatHref?: string;  // es. "/chat"

  h2: string;
  lead: string;
  pills: Pill[];
  faqs: FAQ[];

  cities?: City[];       // es. [{slug:"roma",label:"Roma"}]

  // SEO "below the fold" (facoltativo)
  seo?: {
    h2: string;
    blocks: { h3: string; text: string }[];
    faqForSchema?: { q: string; a: string }[]; // schema FAQ personalizzato
  };
};

/* =========================
   HELPERS
   ========================= */
function capFirst(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* =========================
   COMPONENT
   ========================= */
export default function ServiceLanding(p: ServiceLandingProps) {
  const telHref = useMemo(
    () => `tel:${p.numeroVerde.replace(/\s+/g, "")}`,
    [p.numeroVerde]
  );
  const cities = p.cities ?? [];
  const serviceLabel = capFirst(p.service.replace("-", " "));

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#0B1220" }}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">

        {/* ========== HERO ========== */}
        <section className="pt-16 pb-10 grid md:grid-cols-[1.2fr_.8fr] items-center gap-8">
          <div>
            {/* Logo */}
            <div className="mb-6">
              <Image
                src={p.heroLogo || "/logos/logo.webp"}
                alt="SOS24ORE.it — Numero Verde 800 00 24 24"
                width={228}
                height={98}
                priority
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {p.titleH1}
            </h1>
            <p className="mt-3 max-w-xl text-white/85">{p.subH1}</p>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={telHref}
                aria-label={`Chiama il Numero Verde ${p.numeroVerde}`}
                className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-6 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
              >
                Chiama {p.numeroVerde}
              </a>

              {p.ctaChatHref && (
                <Link
                  href={p.ctaChatHref}
                  aria-label="Apri la chat SOS24ORE per descrivere il problema"
                  className="rounded-2xl bg-[#FFD12A] hover:bg-[#ffdf66] text-black font-bold text-lg px-6 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
                >
                  Apri Chat
                </Link>
              )}
            </div>
          </div>

          {/* Mascotte */}
          <div className="flex justify-center md:justify-end">
            <Image
              src={p.heroMascotte}
              alt={`${serviceLabel} — Capitan SOS`}
              width={494}
              height={494}
              className="w-[494px] h-auto drop-shadow-[0_0_35px_rgba(255,120,0,0.25)]"
              priority
            />
          </div>
        </section>

        {/* ========== BREADCRUMB (visivo) ========== */}
        <nav className="text-xs text-white/60 mb-6" aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="capitalize">{serviceLabel}</li>
          </ol>
        </nav>

        {/* ========== H2 + LEAD + PILLs ========== */}
        <section className="mb-14">
          <h2 className="text-3xl font-extrabold">{p.h2}</h2>
          <p className="mt-2 text-white/85 max-w-3xl">{p.lead}</p>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {p.pills.map((x, i) => (
              <div
                key={i}
                className="rounded-2xl border border-amber-400/30 
                           bg-gradient-to-br from-black/40 to-black/10 
                           px-6 py-6 shadow-lg shadow-black/30
                           hover:shadow-xl hover:shadow-amber-500/30 
                           transition duration-300"
              >
                <p className="font-bold text-lg text-amber-400">{x.title}</p>
                <p className="text-sm text-white/80 mt-2">{x.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== SEZIONE CITTÀ (card) ========== */}
        {cities.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Scegli la tua città
              </h2>
              <span className="text-sm text-white/60">
                {cities.length} città disponibili
              </span>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${p.service}/${c.slug}`}
                  className="group rounded-2xl border border-amber-400/40 
                             bg-gradient-to-br from-black/40 to-black/10 
                             p-6 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-amber-500/30 
                             hover:border-amber-400 transition duration-300"
                  aria-label={`${serviceLabel} ${c.label} — Pronto Intervento H24`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-amber-400 flex items-center justify-center 
                                    text-xl font-bold text-black shadow-md group-hover:scale-110 transition duration-200">
                      {c.label[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold">{c.label}</p>
                      <p className="text-sm text-white/70 capitalize">
                        {serviceLabel} {c.label}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition">
                    {serviceLabel} {c.label} – Pronto Intervento H24 →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== SEO BELOW THE FOLD (facoltativo) ========== */}
        {p.seo && (
          <section id="seo" className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{p.seo.h2}</h2>
            <div className="space-y-6 text-white/85 leading-relaxed">
              {p.seo.blocks.map((b, i) => (
                <article key={i}>
                  <h3 className="text-xl font-semibold mb-2">{b.h3}</h3>
                  <p>{b.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ========== FAQ (visibili) ========== */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-3">Domande frequenti</h2>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {p.faqs.map((f, i) => (
              <details key={i} className="group p-4 open:bg-white/5">
                <summary className="cursor-pointer list-none font-medium">
                  {f.q}
                </summary>
                <p className="mt-2 text-white/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ========== JSON-LD: Breadcrumb + FAQ + ItemList città + Service ========== */}
        {(() => {
          const faqForSchema = (p.seo?.faqForSchema ?? p.faqs)?.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          }));

          const itemList = (cities ?? []).map((c, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: `https://www.sos24ore.it/${p.service}/${c.slug}`,
            name: `${serviceLabel} ${c.label}`,
          }));

          type JsonLd = Record<string, unknown>;
          const payloads: JsonLd[] = [];

          // BreadcrumbList: Home → Servizio
          payloads.push({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.sos24ore.it/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: serviceLabel,
                item: `https://www.sos24ore.it/${p.service}/`,
              },
            ],
          });

          if (faqForSchema?.length) {
            payloads.push({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqForSchema,
            });
          }

          if (itemList.length) {
            payloads.push({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${serviceLabel} in Italia – città disponibili`,
              itemListOrder: "http://schema.org/ItemListOrderAscending",
              itemListElement: itemList,
            });
          }

          // Service schema (categoria servizio)
          payloads.push({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Pronto Intervento ${serviceLabel}`,
            serviceType: serviceLabel,
            description: p.lead,
            areaServed: itemList.length ? ["IT", ...cities.map((c) => c.label)] : "IT",
            provider: {
              "@type": "Organization",
              name: "SOS24ORE.it",
              url: "https://www.sos24ore.it",
              telephone: "+39-800002424",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+39-800002424",
                  contactType: "customer service",
                  areaServed: "IT",
                  availableLanguage: ["Italian"],
                },
              ],
            },
          });

          return (
            <script
              type="application/ld+json"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: JSON.stringify(payloads) }}
            />
          );
        })()}

      </div> {/* ✅ chiusura del wrapper principale */}
    </main>
  );
}
