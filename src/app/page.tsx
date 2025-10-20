import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PremiumCTAButtons } from "@/components/PremiumButtons";
import { HOMESERVICES } from "@/data/services";

/* =====================  METADATA SEO HOME  ===================== */
export const metadata: Metadata = {
  title: "SOS24ORE.it – Emergenze H24 in tutta Italia",
  description:
    "Un solo numero, tante soluzioni. Idraulico, fabbro, elettricista, vetraio, carro attrezzi, caldaie, disinfestazioni, spurgo. Numero Verde 800 00 24 24.",
  alternates: { canonical: "https://www.sos24ore.it/" },
  openGraph: {
    title: "SOS24ORE.it – Emergenze H24 in tutta Italia",
    description:
      "Un solo numero, tante soluzioni. Idraulico, fabbro, elettricista, vetraio, carro attrezzi, caldaie, disinfestazioni, spurgo. Numero Verde 800 00 24 24.",
    url: "https://www.sos24ore.it/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Un solo numero, tante soluzioni",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOS24ORE.it – Emergenze H24 in tutta Italia",
    description:
      "Un solo numero, tante soluzioni. Idraulico, fabbro, elettricista, vetraio, carro attrezzi, caldaie, disinfestazioni, spurgo. Numero Verde 800 00 24 24.",
    images: ["/og-home.png"],
  },
};

/* =====================  FAQ JSON-LD  ===================== */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quanto costa un intervento SOS24ORE?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "SOS24ORE non applica tariffe: ti mettiamo in contatto con il professionista disponibile. Il prezzo lo concordi direttamente con lui prima dell’uscita.",
      },
    },
    {
      "@type": "Question",
      name: "Coprite tutta Italia o solo alcune città?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Operiamo in tutta Italia. Dove disponibile trovi pagine dedicate per città e quartieri con informazioni aggiornate.",
      },
    },
    {
      "@type": "Question",
      name: "Il Numero Verde è gratuito?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sì, 800 00 24 24 è gratuito da rete fissa e mobile, attivo 24 ore su 24, 7 giorni su 7.",
      },
    },
    {
      "@type": "Question",
      name: "Posso usare la chat invece della chiamata?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sì, puoi descrivere il problema in chat; per urgenze consigliamo la chiamata al Numero Verde per attivare più rapidamente il contatto.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#030814] text-neutral-200">
      {/* ===== HERO ===== */}
      <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64">
              <Image
                src="/logos/logo.webp"
                alt="SOS24ORE.it — Numero Verde 800 00 24 24"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl leading-tight mb-4">
            Un solo numero, tante soluzioni – Pronto Intervento H24 in tutta Italia
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Ti mettiamo in contatto con il professionista disponibile più vicino.
            Chiama subito <strong>800 00 24 24</strong>.
          </p>

          <div className="mt-6">
            <PremiumCTAButtons />
          </div>
        </div>

        {/* Mascotte */}
        <div className="relative h-[360px] sm:h-[420px] lg:h-[460px] flex items-center justify-center">
          <Image
            src="/mascotte/capitan-sos.webp"
            alt="Capitan SOS – Mascotte ufficiale SOS24ORE.it"
            fill
            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            priority
          />
        </div>
      </section>

      {/* ===== SERVIZI ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">I professionisti a tua disposizione</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOMESERVICES.map((svc) => (
            <div
              key={svc.slug}
              className="bg-[#0a0f1e] rounded-2xl p-6 text-center shadow-lg"
            >
              <Image
                src={svc.img}
                alt={svc.imgAlt}
                width={180}
                height={180}
                className="mx-auto mb-4"
                loading="lazy"
              />
              <h3 className="font-bold text-lg text-white">{svc.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{svc.desc}</p>
              <Link href={svc.href} className="text-yellow-400 font-semibold">
                Pronto Intervento {svc.title} →
              </Link>
            </div>
          ))}
        </div>

        {/* Anchor SEO testuale */}
        <div className="mt-8 text-sm text-gray-300 space-x-3 flex flex-wrap gap-2">
          <Link href="/idraulico" className="underline underline-offset-4">
            Idraulico
          </Link>
          <Link href="/fabbro" className="underline underline-offset-4">
            Fabbro
          </Link>
          <Link href="/elettricista" className="underline underline-offset-4">
            Elettricista
          </Link>
          <Link href="/spurgo" className="underline underline-offset-4">
            Spurgo
          </Link>
          <Link href="/disinfestazioni" className="underline underline-offset-4">
            Disinfestazioni
          </Link>
          <Link href="/caldaie" className="underline underline-offset-4">
            Caldaie
          </Link>
          <Link href="/vetraio" className="underline underline-offset-4">
            Vetraio
          </Link>
          <Link href="/assistenza-stradale" className="underline underline-offset-4">
            Assistenza stradale
          </Link>
        </div>
      </section>

      {/* ===== BLOCCO SEO ESTESO + FAQ ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">SOS24ORE.it – Come funziona</h2>
          <div className="text-gray-300 space-y-3">
            <p>
              SOS24ORE è un punto di contatto: <strong>non inviamo tecnici</strong>, ma ti
              colleghiamo direttamente con il professionista disponibile più vicino
              alla tua zona, 24 ore su 24.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Chiama il <strong>Numero Verde 800 00 24 24</strong> o apri la chat.</li>
              <li>Descrivi il problema (porta bloccata, perdita d’acqua, blackout...).</li>
              <li>Vieni messo in contatto con il professionista per tempi e costi.</li>
            </ol>
            <p className="text-gray-400 text-sm">
              Nota: i prezzi sono concordati <em>direttamente</em> con il professionista prima
              dell’uscita. Per emergenze gravi (incendi, fughe gas, persone in pericolo) chiama
              subito i soccorsi competenti.
            </p>
            <p>
              Copriamo l’intero territorio nazionale con pagine dedicate a città e quartieri
              dove disponibili. Inizia da una categoria sopra e trova l’area più vicina.
            </p>
          </div>
        </div>

        {/* FAQ visibili */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Domande frequenti</h2>
          <ul className="space-y-4">
            <li className="border-b border-gray-700 pb-3">
              <p className="text-white font-semibold">Quanto costa un intervento SOS24ORE?</p>
              <p className="text-gray-300 text-sm">
                Non applichiamo tariffe: ti mettiamo in contatto con il professionista.
                Il prezzo lo concordi con lui prima dell’uscita.
              </p>
            </li>
            <li className="border-b border-gray-700 pb-3">
              <p className="text-white font-semibold">Coprite tutta Italia o solo alcune città?</p>
              <p className="text-gray-300 text-sm">
                Operiamo in tutta Italia. Dove presente, trovi anche pagine per città e quartieri.
              </p>
            </li>
            <li className="border-b border-gray-700 pb-3">
              <p className="text-white font-semibold">Il numero verde è gratuito?</p>
              <p className="text-gray-300 text-sm">
                Sì, 800 00 24 24 è gratuito da rete fissa e mobile, attivo 24/7.
              </p>
            </li>
            <li className="border-b border-gray-700 pb-3">
              <p className="text-white font-semibold">Posso usare la chat invece della chiamata?</p>
              <p className="text-gray-300 text-sm">
                Sì, utile per descrivere il problema. Per le urgenze consigliamo la chiamata
                per attivare il contatto più velocemente.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#02050d] text-gray-400 text-sm py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2025 SOS24ORE.it</p>
          <p>Numero Verde: 800 00 24 24</p>
          <div className="flex gap-6">
            <Link href="/termini">Termini</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookie">Cookie</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
