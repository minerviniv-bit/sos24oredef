import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Disinfestazioni in Italia – SOS24ORE | Pronto Intervento H24",
  description:
    "Squadre H24 per blatte, formiche, vespe, cimici dei letti e roditori. Seleziona la città e trova il team disponibile.",
  alternates: { canonical: "https://www.sos24ore.it/disinfestazioni/" },
  openGraph: {
    title: "Disinfestazioni in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Squadre H24 per blatte, formiche, vespe, cimici dei letti e roditori. Seleziona la città e trova il team disponibile.",
    url: "https://www.sos24ore.it/disinfestazioni/",
    siteName: "SOS24ORE.it",
    images: [
      {
        url: "/og-disinfestazioni.png",
        width: 1200,
        height: 630,
        alt: "SOS24ORE – Disinfestazioni H24 in Italia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disinfestazioni in Italia – SOS24ORE | Pronto Intervento H24",
    description:
      "Squadre H24 per blatte, formiche, vespe, cimici dei letti e roditori. Seleziona la città e trova il team disponibile.",
    images: ["/og-disinfestazioni.png"],
  },
};

export default function Page() {
  return (
    <ServiceLanding
      service="disinfestazioni"
      titleH1="Disinfestazioni H24 in Italia – SOS24ORE"
      subH1="Interventi rapidi per blatte, formiche, vespe, cimici dei letti e roditori. Seleziona la città e chiama il Numero Verde."
      heroMascotte="/mascotte/disinfestatore.webp"   // nel tuo /public/mascotte hai anche disinfestatore-1.webp
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Disinfestazioni H24 – Pronto Intervento"
      lead="Tecnici qualificati con prodotti professionali e trattamenti mirati. Sopralluogo e indicazione costi prima dell’uscita quando possibile. Copertura notturna e festiva dove indicato."
      pills={[
        { title: "Blatte & formiche", desc: "Trattamenti gel e residuali, monitoraggio punti critici." },
        { title: "Vespe & calabroni", desc: "Rimozione nidi in sicurezza (aree private)." },
        { title: "Cimici dei letti & roditori", desc: "Piani d’intervento e monitoraggio con dispositivi certificati." },
      ]}
      faqs={[
        { q: "Usate prodotti sicuri per persone e animali?", a: "Sì, prodotti professionali registrati; tempi di rientro comunicati dal tecnico." },
        { q: "Quanto dura il trattamento?", a: "Dipende dall’infestante e dai locali: in genere 30–120 minuti; possono servire richiami." },
        { q: "Rimuovete nidi di vespe in aree pubbliche?", a: "In aree private sì; in suolo pubblico serve l’ente competente." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" },
      ]}
      seo={{
        h2: "Disinfestazioni – come interveniamo",
        blocks: [
          {
            h3: "Sopralluogo e identificazione",
            text:
              "Rileviamo specie e grado d’infestazione, identifichiamo nidi e punti d’accesso, definiamo il piano d’intervento più efficace.",
          },
          {
            h3: "Trattamento e sicurezza",
            text:
              "Uso di biocidi/prodotti professionali dove previsto, con avvertenze e tempi di rientro. Per roditori, dispositivi di derattizzazione e monitoraggio.",
          },
          {
            h3: "Prevenzione",
            text:
              "Sigillatura punti d’ingresso, igiene/locali asciutti, corretta gestione rifiuti e indicazioni per evitare recidive.",
          },
        ],
        faqForSchema: [
          { q: "Rilasciate report/indicazioni post-trattamento?", a: "Sì, il tecnico fornisce report essenziale e istruzioni di prevenzione." },
          { q: "Fate trattamenti condominiali?", a: "Sì, coordinandoci con l’amministratore e programmando richiami se necessari." },
        ],
      }}
    />
  );
}

