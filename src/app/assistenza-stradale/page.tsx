import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Assistenza Stradale in Italia – SOS24ORE | Carro Attrezzi H24",
  description:
    "Soccorso stradale H24: carro attrezzi, traino, recupero veicoli, cambio batteria e apertura veicoli. Seleziona la città e trova il team disponibile.",
  alternates: { canonical: "https://www.sos24ore.it/assistenza-stradale/" },
  openGraph: {
    title: "Assistenza Stradale in Italia – SOS24ORE | Carro Attrezzi H24",
    description:
      "Soccorso stradale H24: carro attrezzi, traino, recupero veicoli, cambio batteria e apertura veicoli. Seleziona la città e trova il team disponibile.",
    url: "https://www.sos24ore.it/assistenza-stradale/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-assistenza-stradale.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Assistenza Stradale / Carro Attrezzi H24",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assistenza Stradale in Italia – SOS24ORE | Carro Attrezzi H24",
    description:
      "Soccorso stradale H24: carro attrezzi, traino, recupero veicoli, cambio batteria e apertura veicoli. Seleziona la città e trova il team disponibile.",
    images: ["/og-assistenza-stradale.png"],
  },
};

export default function Page() {
  return (
    <ServiceLanding
      service="assistenza-stradale"
      titleH1="Assistenza Stradale H24 in Italia – SOS24ORE"
      subH1="Carro attrezzi, traino e recupero veicoli in panne o incidentati. Seleziona la città e chiama il Numero Verde."
      heroMascotte="/mascotte/carroattrezzi.webp"   // verifica nome file: nel tuo /mascotte è “carroattrezzi.webp”
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Assistenza Stradale – Pronto Intervento"
      lead="Soccorso stradale H24 con mezzi attrezzati: traino, recupero, cambio batteria, apertura veicoli. Prezzo indicativo prima dell’uscita quando possibile. Copertura anche notturna e festiva dove indicato."
      pills={[
        { title: "Carro attrezzi & traino", desc: "Recupero veicoli in panne o incidentati." },
        { title: "Batteria & avviamento", desc: "Cambio batteria e avviamento di emergenza." },
        { title: "Apertura veicoli", desc: "Sblocco porte bloccate (dove consentito)." },
      ]}
      faqs={[
        { q: "Intervenite anche in autostrada?", a: "In autostrada intervengono i concessionari convenzionati; ti indichiamo la procedura corretta." },
        { q: "Quanto impiega il carro attrezzi ad arrivare?", a: "Dipende dalla zona e dal traffico: spesso 60–90 minuti in urgenza." },
        { q: "Quali metodi di pagamento accettate?", a: "Di norma contanti e carta; conferma sempre con l’operatore/mezzo assegnato." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" },
      ]}
      seo={{
        h2: "Soccorso stradale H24 – come interveniamo",
        blocks: [
          {
            h3: "Localizzazione e sicurezza",
            text:
              "Ti localizziamo, verifichiamo le condizioni del mezzo e inviamo il mezzo più adatto. Ti ricordiamo di indossare il giubbotto e posizionare il triangolo in sicurezza.",
          },
          {
            h3: "Trasparenza sui costi",
            text:
              "Indichiamo un costo orientativo prima dell’uscita; sul posto il conducente conferma in base a percorso, chilometri e complessità del recupero.",
          },
          {
            h3: "Interventi tipici",
            text:
              "Traino auto e moto, recupero veicoli incidentati o fuori strada, cambio batteria, avviamento, apertura veicoli bloccati dove consentito.",
          },
        ],
        faqForSchema: [
          { q: "Operate anche di notte e nei festivi?", a: "Sì, dove indicato è attiva la copertura H24/7." },
          { q: "Potete portare l’auto in officina di fiducia?", a: "Sì, concordiamo la destinazione con l’autista (quando logisticamente possibile)." },
        ],
      }}
    />
  );
}
