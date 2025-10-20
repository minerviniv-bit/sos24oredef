import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Spurgo & Fognature in Italia – SOS24ORE | Pronto Intervento H24",
  description:
    "Stasatura, videoispezioni e spurgo fosse biologiche H24. Seleziona la città e trova una squadra disponibile rapidamente.",
  alternates: { canonical: "https://www.sos24ore.it/spurgo/" },
  openGraph: {
    title: "Spurgo & Fognature in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Stasatura, videoispezioni e spurgo fosse biologiche H24. Seleziona la città e trova una squadra disponibile rapidamente.",
    url: "https://www.sos24ore.it/spurgo/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-spurgo.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Spurgo & Fognature H24 in Italia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spurgo & Fognature in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Stasatura, videoispezioni e spurgo fosse biologiche H24. Seleziona la città e trova una squadra disponibile rapidamente.",
    images: ["/og-spurgo.png"],
  },
};

export default function Page() {
  return (
    <ServiceLanding
      service="spurgo"
      titleH1="Spurgo & Fognature H24 in Italia – SOS24ORE"
      subH1="Scegli la città e trova una squadra disponibile H24 per stasatura, videoispezione e spurgo fosse."
      heroMascotte="/mascotte/spurgo.webp"   // verifica che esista: hai anche spurgo.png se preferisci PNG
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Spurgo & Fognature – Pronto Intervento"
      lead="Otturazioni, allagamenti e cattivi odori: interveniamo con mezzi attrezzati; prezzo indicativo prima dell’uscita quando possibile. Copertura anche notturna e festiva in base alla zona."
      pills={[
        { title: "Stasatura & videoispezione", desc: "Sonde, idrogetto e telecamera per diagnosi e sblocco." },
        { title: "Spurgo fosse biologiche", desc: "Autospurghi per svuotamento, pulizia e sanificazione." },
        { title: "Emergenze H24", desc: "Interventi rapidi anche notti, weekend e festivi (dove disponibile)." },
      ]}
      faqs={[
        { q: "Fate anche videoispezione?", a: "Sì, quando richiesto usiamo telecamera per individuare il punto critico." },
        { q: "Quanto costa lo spurgo?", a: "Forniamo un costo indicativo in base al tipo di intervento e distanza; conferma sul posto." },
        { q: "Tempi di arrivo?", a: "Dipendono da zona e disponibilità mezzi: spesso entro 60–90 minuti in urgenza." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" },
      ]}
      seo={{
        h2: "Spurgo H24 – come interveniamo",
        blocks: [
          {
            h3: "Tempi e copertura",
            text:
              "Nelle principali città interveniamo spesso entro 60–90 minuti dall’assegnazione. Copertura notturna/festiva indicata nelle pagine città.",
          },
          {
            h3: "Costi e trasparenza",
            text:
              "Indichiamo un costo orientativo prima dell’uscita in base al problema; sul posto la squadra conferma tempi e prezzo in base alla situazione reale.",
          },
          {
            h3: "Interventi tipici",
            text:
              "Stasatura scarichi e colonne, spurgo fosse biologiche, videoispezioni, gestione allagamenti e cattivi odori.",
          },
        ],
        faqForSchema: [
          { q: "Serve autorizzazione condominiale?", a: "Per aree comuni decide l’amministratore; negli appartamenti basta il consenso del cliente." },
          { q: "Effettuate anche manutenzione programmata?", a: "Sì, ove disponibile proponiamo piani periodici per prevenire otturazioni e cattivi odori." },
        ],
      }}
    />
  );
}
