import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Elettricista in Italia – SOS24ORE | Pronto Intervento H24",
  description:
    "Elettricista H24 per blackout, corto, salvavita e guasti urgenti. Seleziona la città e trova il tecnico disponibile.",
  alternates: { canonical: "https://www.sos24ore.it/elettricista/" },
  openGraph: {
    title: "Elettricista in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Elettricista H24 per blackout, corto, salvavita e guasti urgenti. Seleziona la città e trova il tecnico disponibile.",
    url: "https://www.sos24ore.it/elettricista/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-elettricista.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Elettricista H24 in Italia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elettricista in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Elettricista H24 per blackout, corto, salvavita e guasti urgenti. Seleziona la città e trova il tecnico disponibile.",
    images: ["/og-elettricista.png"],
  },
};

export default function Page() {
  return (
    <ServiceLanding
      service="elettricista"
      titleH1="Elettricista H24 in Italia – SOS24ORE"
      subH1="Guasti elettrici, salvavita che scatta, corto o blackout. Seleziona la tua città e chiama il Numero Verde."
      heroMascotte="/mascotte/elettricista.webp"   // esiste nella tua /public/mascotte
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Elettricista H24 – Pronto Intervento"
      lead="Tecnici selezionati per emergenze e ripristini rapidi. Valutazione del guasto e costo indicativo prima dell’uscita quando possibile. Copertura anche notturna e festiva dove indicato."
      pills={[
        { title: "Blackout & salvavita", desc: "Ricerca guasto, differenziale che scatta, ripristino linee." },
        { title: "Corto & prese", desc: "Sostituzione prese, interruttori e quadri elettrici." },
        { title: "H24 / 7", desc: "Interventi urgenti anche notti e festivi (dove disponibile)." },
      ]}
      faqs={[
        { q: "Intervenite per blackout totale?", a: "Sì. Verifichiamo l’impianto, il differenziale e i carichi per identificare il guasto." },
        { q: "Quanto tempo impiegate ad arrivare?", a: "Dipende dalla zona: spesso entro 60–90 minuti in urgenza." },
        { q: "Posso pagare con carta?", a: "Sì, salvo diversa indicazione del tecnico assegnato." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" },
      ]}
      seo={{
        h2: "Elettricista H24 – come interveniamo",
        blocks: [
          {
            h3: "Diagnosi rapida del guasto",
            text:
              "Partiamo dalla verifica del contatore/MT, del differenziale e dei magnetotermici. Individuiamo la tratta e isoliamo il problema per ripristinare in sicurezza.",
          },
          {
            h3: "Trasparenza sui costi",
            text:
              "Forniamo un costo orientativo prima della partenza sulla base dei sintomi; sul posto il tecnico conferma tempi e prezzo in funzione della reale complessità.",
          },
          {
            h3: "Interventi tipici",
            text:
              "Blackout, corto circuito, salvavita che scatta, prese e interruttori, quadri, punti luce e piccole riparazioni d’impianto.",
          },
        ],
        faqForSchema: [
          { q: "Uscite anche di notte e nei festivi?", a: "Sì, dove indicato è attiva la copertura H24/7." },
          { q: "Rilasciate relazione sull’intervento?", a: "Su richiesta, il tecnico può rilasciare un rapporto di intervento." },
        ],
      }}
    />
  );
}

