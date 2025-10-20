import type { Metadata } from "next";
import ServiceLanding from "../_shared/ServiceLanding";

export const metadata: Metadata = {
  title: "Fabbro in Italia – SOS24ORE",
  description: "Scegli la città e trova un fabbro disponibile H24 per emergenze e apertura porte.",
};

export default function Page() {
  return (
    <ServiceLanding
      service="fabbro"
      titleH1="Fabbro in Italia – SOS24ORE"
      subH1="Scegli la città e trova un fabbro disponibile H24 per apertura porte, serrature e urgenze."
      heroMascotte="/mascotte/fabbro.webp"          // <-- assicurati che il file esista (webp)
      heroLogo="/logos/logo.webp"
      numeroVerde="800 00 24 24"
      ctaChatHref="/chat"
      h2="Fabbro H24 – Pronto Intervento"
      lead="Apertura porte bloccate, sostituzione serrature, messa in sicurezza. Prezzo chiaro prima dell’uscita. Attivi anche notti e festivi dove indicato."
      pills={[
        { title: "Apertura porte", desc: "Bloccate, chiavi perse o spezzate." },
        { title: "Serrature e cilindri", desc: "Sostituzione e adeguamento rapido." },
        { title: "H24 / 7", desc: "Notti, weekend e festivi dove disponibile." },
      ]}
      faqs={[
        { q: "Quanto tempo per arrivare?", a: "Dipende dalla zona e dalla disponibilità: spesso entro un’ora." },
        { q: "Si può pagare con carta?", a: "Sì, salvo diversa indicazione del tecnico in zona." },
        { q: "Preventivo prima di uscire?", a: "Sì: comunichiamo il costo indicativo prima della partenza." },
      ]}
      cities={[
        { slug: "roma", label: "Roma" },
        // { slug: "milano", label: "Milano" },
      ]}
    />
  );
}
