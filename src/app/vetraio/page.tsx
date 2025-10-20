import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Vetraio in Italia – SOS24ORE | Pronto Intervento H24",
  description:
    "Sostituzione vetri rotti, cristalli di sicurezza, vetrine commerciali. Seleziona la città e trova un vetraio disponibile H24.",
  alternates: { canonical: "https://www.sos24ore.it/vetraio/" },
  openGraph: {
    title: "Vetraio in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Sostituzione vetri rotti, cristalli di sicurezza, vetrine commerciali. Seleziona la città e trova un vetraio disponibile H24.",
    url: "https://www.sos24ore.it/vetraio/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-vetraio.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Vetraio H24 in Italia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vetraio in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Sostituzione vetri rotti, cristalli di sicurezza, vetrine commerciali. Seleziona la città e trova un vetraio disponibile H24.",
    images: ["/og-vetraio.png"],
  },
};

export default function Page() {
  return (
    <ServiceLanding
      service="vetraio"
      titleH1="Vetraio H24 in Italia – SOS24ORE"
      subH1="Interventi rapidi per sostituzione vetri rotti, cristalli di sicurezza e vetrine danneggiate. Seleziona la città e chiama il Numero Verde."
      heroMascotte="/mascotte/vetraio.webp"
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Vetraio H24 – Pronto Intervento"
      lead="Sostituzione rapida vetri e vetrine, montaggio cristalli di sicurezza, interventi urgenti per danni accidentali o effrazioni. Servizio attivo anche notti e festivi in base alla disponibilità."
      pills={[
        { title: "Vetri rotti", desc: "Sostituzione rapida di vetri semplici e doppi." },
        { title: "Cristalli di sicurezza", desc: "Installazione antisfondamento per abitazioni e negozi." },
        { title: "Vetrine commerciali", desc: "Ripristino e sostituzione urgente di vetrine danneggiate." },
      ]}
      faqs={[
        { q: "Intervenite anche di notte?", a: "Sì, dove indicato nelle pagine città offriamo copertura H24/7." },
        { q: "Quanto costa la sostituzione di un vetro?", a: "Dipende dal tipo di vetro e dimensioni; forniamo un preventivo indicativo prima dell’uscita." },
        { q: "Effettuate anche installazioni nuove?", a: "Sì, montiamo vetri e vetrine anche per nuove installazioni o sostituzioni programmate." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" },
      ]}
      seo={{
        h2: "Vetraio – come interveniamo",
        blocks: [
          {
            h3: "Pronto intervento",
            text:
              "Gestiamo emergenze con vetri rotti o vetrine danneggiate, mettendo subito in sicurezza e sostituendo i cristalli disponibili.",
          },
          {
            h3: "Cristalli di sicurezza",
            text:
              "Installiamo vetri antisfondamento e stratificati per abitazioni, uffici e negozi, migliorando sicurezza e isolamento.",
          },
          {
            h3: "Servizio su misura",
            text:
              "Lavoriamo su vetri semplici, doppi e personalizzati, con preventivi chiari e tempi rapidi di intervento.",
          },
        ],
        faqForSchema: [
          { q: "Effettuate riparazioni anche nei festivi?", a: "Sì, nelle zone con copertura H24 i tecnici sono disponibili anche festivi." },
          { q: "Gestite assicurazioni?", a: "Sì, su richiesta collaboriamo per pratiche assicurative legate a danni accidentali o effrazioni." },
        ],
      }}
    />
  );
}
