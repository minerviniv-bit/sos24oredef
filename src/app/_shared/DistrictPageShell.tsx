// src/app/_shared/DistrictPageShell.tsx
// Server Component: niente "use client"

import Image from "next/image";
import Link from "next/link";

/* =========================
   TYPES
   ========================= */
export type DistrictPageProps = {
  mascotSrc: string;             // ✅ mascotte decisa lato server
  serviceLabel: string;          // es. "Idraulico H24"
  cityLabel: string;             // es. "Roma"
  districtLabel: string;         // es. "Prati"
  heroSubtitle?: string;
  sponsorNote?: string;
  tags?: string[];
  client?: { name: string; logoUrl?: string; isFallback?: boolean } | null;

  // ⬇️ Breve testo scheda azienda (rimane nella card in alto, COME PRIMA)
  companySeoHtml?: string;       // HTML breve, descrittivo (non il malloppone SEO)

  nearby?: { label: string; href: string }[];
  servicesOffered?: string[];
  infoRapide?: { label: string; value: string }[];
  numeroVerde?: string;          // es. "800 00 24 24"
  whatsappHref?: string;         // es. "https://wa.me/39..."

  // ⬇️ NUOVO: Blocco SEO discorsivo IN FONDO alla pagina
  seoBottomHtml?: string;        // HTML lungo generato/pubblicato da admin
  faqs?: { q: string; a: string }[]; // FAQ in fondo
};

/* =========================
   COMPONENT
   ========================= */
export default function DistrictPageShell({
  mascotSrc,
  serviceLabel,
  cityLabel,
  districtLabel,
  heroSubtitle,
  sponsorNote = "Disponibile per sponsorizzazione",
  tags = [],
  client,
  companySeoHtml = "",
  nearby = [],
  servicesOffered = [],
  infoRapide = [],
  numeroVerde = "800 00 24 24",
  whatsappHref,

  // ⬇️ nuovi
  seoBottomHtml,
  faqs,
}: DistrictPageProps) {
  // Logo coerente: usiamo sempre <Image> (anche per URL remoti) + unoptimized
  const safeLogo = client?.isFallback
    ? "/logos/logo.webp"
    : (client?.logoUrl || "/logos/logo.webp");

  return (
    <div className="bg-[#030814] text-neutral-200 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* ========== BREADCRUMB ========== */}
        <nav className="text-sm text-neutral-400 mb-4" aria-label="breadcrumb">
          <ul className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-neutral-200">Home</Link></li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/${slug(serviceLabel.split(" ")[0])}`} className="hover:text-neutral-200">
                {serviceLabel.split(" ")[0]}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/${slug(serviceLabel.split(" ")[0])}/${slug(cityLabel)}`} className="hover:text-neutral-200">
                {cityLabel}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-neutral-300">{districtLabel}</li>
          </ul>
        </nav>

        {/* ========== HEADER / HERO ========== */}
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                {sponsorNote}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold">
              {serviceLabel} {districtLabel} – {cityLabel}
            </h1>

            {heroSubtitle && (
              <p className="mt-2 text-neutral-300">{heroSubtitle}</p>
            )}

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <a
                href={`tel:${numeroVerde.replace(/\s+/g, "")}`}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700"
                aria-label={`Chiama il Numero Verde ${numeroVerde}`}
              >
                Chiama {numeroVerde}
              </a>

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Chatta con noi
                </a>
              )}
            </div>
          </div>

          {/* ✅ Mascotte: struttura fissa = niente hydration mismatch */}
          <div className="hidden sm:block w-64 aspect-[1/1.1] relative">
            <Image
              src={mascotSrc}
              alt="Capitan SOS"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* ========== TOP CARDS ========== */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Partner / Sponsor */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="text-neutral-300 text-sm mb-2">Partner</div>
            <div className="h-28 flex items-center justify-center">
              <Image
                src={safeLogo}
                alt={client?.name || "Logo partner"}
                width={240}
                height={72}
                className="mx-auto"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Numero Verde */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="text-xl font-semibold mb-3">
              {serviceLabel.split(" ")[0]} a {districtLabel}
            </div>
            <div className="rounded-xl border border-emerald-700/40 bg-neutral-950 p-4">
              <div className="text-sm text-emerald-400 mb-1">Numero Verde</div>
              <div className="text-2xl font-semibold tracking-wider">
                {numeroVerde}
              </div>
            </div>
          </div>
        </div>

        {/* ========== BODY (top) ========== */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {/* Colonna principale */}
          <div className="md:col-span-2 space-y-6">
            {/* Scheda azienda */}
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <h2 className="text-lg font-semibold mb-3">Scheda Azienda</h2>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: companySeoHtml }}
              />
            </section>

            {/* Servizi offerti */}
            {servicesOffered.length > 0 && (
              <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
                <h2 className="text-lg font-semibold mb-4">Servizi offerti</h2>
                <div className="flex flex-wrap gap-2">
                  {servicesOffered.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Info rapide */}
            {infoRapide.length > 0 && (
              <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
                <h2 className="text-lg font-semibold mb-4">Info rapide</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {infoRapide.map((i) => (
                    <li
                      key={i.label}
                      className="text-sm flex justify-between border-b border-neutral-800 pb-2"
                    >
                      <span className="text-neutral-400">{i.label}</span>
                      <span className="text-neutral-200">{i.value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Aside */}
          <aside className="space-y-6">
            {/* Zone vicine */}
            {nearby.length > 0 && (
              <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
                <h3 className="text-lg font-semibold mb-3">Zone vicine</h3>
                <div className="flex flex-wrap gap-2">
                  {nearby.map((z) => (
                    <Link
                      key={z.href}
                      href={z.href}
                      className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-sm hover:bg-neutral-700"
                    >
                      {z.label}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Placeholder FAQ nel side */}
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-2">
              <h3 className="text-lg font-semibold px-4 py-3">FAQ</h3>
              <div />
            </section>
          </aside>
        </div>

        {/* ========== TRUST STRIP ========== */}
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 flex flex-wrap items-center gap-4 text-sm">
          <div>📞 Numero Verde <span className="font-semibold">{numeroVerde}</span></div>
          <div>— Prezzo trasparente</div>
          <div>— Carte di pagamento</div>
        </div>

        {/* ========== SEO BOTTOM (NUOVO) ========== */}
        {seoBottomHtml && (
          <section id="seo-locale" className="prose prose-invert max-w-4xl mx-auto mt-10">
            <div dangerouslySetInnerHTML={{ __html: seoBottomHtml }} />
          </section>
        )}

        {/* ========== FAQ IN FONDO (NUOVO) ========== */}
        {Array.isArray(faqs) && faqs.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-8">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <h2 className="text-lg font-semibold mb-4 text-neutral-100">Domande frequenti</h2>
              <ul className="space-y-4">
                {faqs.map((f, i) => (
                  <li key={i}>
                    <p className="font-medium text-neutral-200">{f.q}</p>
                    <p className="text-neutral-300">{f.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* =========================
   UTILS
   ========================= */
function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

