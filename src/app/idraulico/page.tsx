import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Idraulico in Italia – SOS24ORE | Pronto Intervento H24",
  description:
    "Idraulico H24 per perdite, allagamenti e otturazioni. Seleziona la città e trova il tecnico disponibile.",
  alternates: { canonical: "https://www.sos24ore.it/idraulico/" },
  openGraph: {
    title: "Idraulico in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Idraulico H24 per perdite, allagamenti e otturazioni. Seleziona la città e trova il tecnico disponibile.",
    url: "https://www.sos24ore.it/idraulico/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-idraulico.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Idraulico H24 in Italia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Idraulico in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Idraulico H24 per perdite, allagamenti e otturazioni. Seleziona la città e trova il tecnico disponibile.",
    images: ["/og-idraulico.png"],
  },
};

export default function Page() {
  return (
    <ServiceLanding
      service="idraulico"
      titleH1="Idraulico H24 in Italia – SOS24ORE"
      subH1="Perdite, allagamenti, wc otturati. Seleziona la tua città e chiama il Numero Verde."
      heroLogo="/logos/logo.webp"
      heroMascotte="/mascotte/idraulico.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Idraulico H24 – Pronto Intervento"
      lead="Tecnici selezionati e geolocalizzati. Prezzo indicativo comunicato prima dell’uscita quando possibile. Servizio anche notturno e festivo dove indicato."
      pills={[
        {
          title: "Intervento rapido",
          desc: "Siamo operativi H24 con copertura nelle principali città.",
        },
        {
          title: "Preventivo immediato",
          desc: "Indicazione costi prima della partenza, quando fattibile.",
        },
        {
          title: "Riparazioni & manutenzioni",
          desc: "Perdite, sifoni, cassette, rubinetterie, stasatura WC.",
        },
      ]}
      faqs={[
        {
          q: "In quanto arrivate?",
          a: "Dipende dalla zona e disponibilità: spesso entro 60–90 minuti.",
        },
        { q: "La chiamata è gratuita?", a: "Sì, il Numero Verde 800 00 24 24 è gratuito." },
        { q: "Lavorate nei festivi?", a: "Sì, dove indicato in pagina città è attivo H24/7." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" }, // quando la pubblichi
      ]}
      seo={{
        h2: "Idraulico H24 – come interveniamo",
        blocks: [
          {
            h3: "Tempi e copertura",
            text:
              "Nelle principali città interveniamo spesso entro 60–90 minuti dall’assegnazione. La copertura notturna e festiva è indicata nelle pagine città.",
          },
          {
            h3: "Costi e trasparenza",
            text:
              "Diamo un costo orientativo prima dell’uscita sulla base del problema descritto; sul posto il tecnico conferma tempi e prezzo in base alla situazione reale.",
          },
          {
            h3: "Servizi tipici",
            text:
              "Perdite e allagamenti, wc/colonne otturate, sostituzione sifoni e flessibili, cassette di scarico, piccole manutenzioni idrauliche.",
          },
        ],
        // Se vuoi un FAQ schema dedicato (altrimenti riusa quelli visibili)
        faqForSchema: [
          {
            q: "Quanto costa un idraulico H24?",
            a: "Varia per orario, distanza e lavorazione; comunichiamo un costo prima dell’uscita quando possibile.",
          },
          { q: "Intervenite anche nei weekend?", a: "Sì, dove indicato garantiamo copertura 7 giorni su 7." },
        ],
      }}
    />
  );
}
