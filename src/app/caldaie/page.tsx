// src/app/caldaie/page.tsx
import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Caldaie in Italia – SOS24ORE | Pronto Intervento H24",
  description:
    "Tecnici caldaie H24 per guasti, perdite, blocchi ed errori. Seleziona la città e trova il centro disponibile.",
  alternates: { canonical: "https://www.sos24ore.it/caldaie/" },
  openGraph: {
    title: "Caldaie in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Tecnici caldaie H24 per guasti, perdite, blocchi ed errori. Seleziona la città e trova il centro disponibile.",
    url: "https://www.sos24ore.it/caldaie/",
    siteName: "SOS24ORE.it",
    images: [{ url: "/og-caldaie.png", width: 1200, height: 630, alt: "SOS24ORE – Caldaie H24 in Italia" }],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caldaie in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Tecnici caldaie H24 per guasti, perdite, blocchi ed errori. Seleziona la città e trova il centro disponibile.",
    images: ["/og-caldaie.png"],
  },
};

export default function CaldaiePage() {
  return (
    <ServiceLanding
      service="caldaie"
      titleH1="Caldaie H24 in Italia – SOS24ORE"
      subH1="Assistenza urgente per blocchi, errori, perdite e mancata accensione. Seleziona la città e chiama il Numero Verde."
      heroMascotte="/mascotte/caldaie.webp"  // verifica esistenza file
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Caldaie H24 – Pronto Intervento"
      lead="Tecnici selezionati per emergenze e ripristino calore/acqua calda. Diagnosi rapida, prezzo indicativo prima dell’uscita quando possibile. Copertura anche notturna e festiva dove indicato."
      pills={[
        { title: "Guasti & blocchi", desc: "Errori caldaia, mancata accensione, pressione bassa/alta." },
        { title: "Perdite & sicurezza", desc: "Ricerca perdite, controlli fumi e combustione." },
        { title: "Manutenzione", desc: "Pulizia, controllo efficienza e assistenza stagionale." },
      ]}
      faqs={[
        { q: "La caldaia va in errore, intervenite?", a: "Sì, diagnosi del codice errore e ripristino dove possibile." },
        { q: "Quanto impiega il tecnico ad arrivare?", a: "Dipende dalla zona: spesso entro 60–90 minuti in urgenza." },
        { q: "Fate anche manutenzione programmata?", a: "Sì, dove disponibile proponiamo interventi periodici e verifica fumi." },
      ]}
      cities={[ { slug: "roma", label: "Roma" } ]}
      seo={{
        h2: "Assistenza caldaie H24 – come interveniamo",
        blocks: [
          { h3: "Diagnosi e ripristino", text: "Verifica pressioni, sensori, accensione e combustione. Lettura codice errore e ripristino in sicurezza." },
          { h3: "Trasparenza sui costi", text: "Costo orientativo prima della partenza; conferma sul posto in base alla reale complessità." },
          { h3: "Interventi tipici", text: "Blocco, errori display, mancata accensione, acqua non calda, perdite, spurgo impianto, pulizia bruciatore e scambiatore." },
        ],
        faqForSchema: [
          { q: "Intervenite anche nei festivi e di notte?", a: "Sì, dove indicato garantiamo copertura H24/7." },
          { q: "Rilasciate rapporto di intervento?", a: "Su richiesta, il tecnico fornisce report dell’intervento." },
        ],
      }}
    />
  );
}

