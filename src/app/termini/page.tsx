// src/app/termini/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import LegalPageShell, { LegalSection } from "@/app/_shared/legal/LegalPageShell";

export const revalidate = 86400;

async function runtimeBaseUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

const TITLE = "Termini e Condizioni | SOS24ORE.it";
const DESC = "Condizioni d’uso della piattaforma SOS24ORE.it.";

export async function generateMetadata(): Promise<Metadata> {
  const SITE = await runtimeBaseUrl();
  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: `${SITE}/termini` },
    robots: { index: true, follow: true },
    openGraph: {
      title: TITLE,
      description: DESC,
      url: `${SITE}/termini`,
      siteName: "SOS24ORE.it",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  };
}

export default function TermsPage() {
  const lastUpdate = new Date().toISOString().slice(0, 10);

  return (
    <LegalPageShell
      title="Termini e Condizioni di Utilizzo"
      lastUpdate={lastUpdate}
      toc={[
        { href: "#oggetto", label: "Oggetto del servizio" },
        { href: "#richieste", label: "Modalità di richiesta" },
        { href: "#sicurezza", label: "Policy di Sicurezza — Apertura Porte" },
        { href: "#prezzi", label: "Prezzi, Preventivi e Pagamenti" },
        { href: "#limitazioni", label: "Limitazioni di Responsabilità" },
        { href: "#manleva", label: "Clausola di Manleva" },
        { href: "#disponibilita", label: "Disponibilità e Garanzia di Continuità" },
        { href: "#terzieta", label: "Terzietà e assenza di subordinazione" },
        { href: "#abusi", label: "Uso improprio e abusi" },
      ]}
    >
      <LegalSection id="oggetto" title="1) Oggetto del servizio">
        <p>
          SOS24ORE.it è una piattaforma che mette in contatto utenti con professionisti autonomi
          (idraulici, fabbri, elettricisti, spurghi, ecc.). SOS24ORE.it non realizza direttamente gli
          interventi e non è parte del contratto di prestazione, che si perfeziona esclusivamente tra cliente e tecnico.
        </p>
      </LegalSection>

      <LegalSection id="richieste" title="2) Modalità di richiesta">
        <p>
          Le richieste possono avvenire tramite Numero Verde, chat o moduli online. L’utente dichiara che i dati
          forniti sono corretti e veritieri.
        </p>
      </LegalSection>

      <LegalSection id="sicurezza" title="3) Policy di Sicurezza — Apertura Porte">
        <ul className="list-inside list-disc">
          <li>Per ragioni di sicurezza non vengono eseguite aperture porte senza verifica della legittimità della richiesta.</li>
          <li>Richiesti: documento d’identità valido; prova di residenza o titolarità dell’immobile.</li>
          <li>In assenza dei requisiti, l’intervento è eseguibile solo in presenza delle Forze dell’Ordine.</li>
          <li>Dichiarazioni false o richieste fraudolente saranno segnalate alle Autorità.</li>
        </ul>
      </LegalSection>

      <LegalSection id="prezzi" title="4) Prezzi, Preventivi e Pagamenti">
        <p>
          Prezzi e tempi sono concordati direttamente tra cliente e professionista prima dell’uscita.
          SOS24ORE.it non garantisce listini predefiniti né disponibilità dei professionisti, e non incassa
          corrispettivi per conto dei tecnici salvo diverso accordo scritto.
        </p>
      </LegalSection>

      <LegalSection id="limitazioni" title="5) Limitazioni di Responsabilità">
        <p>
          Nei limiti massimi di legge, SOS24ORE.it non risponde per danni indiretti, incidentali o lucro cessante,
          né per ritardi, disservizi o impossibilità di esecuzione dovuti a cause esterne o a condotte dei professionisti.
        </p>
      </LegalSection>

      <LegalSection id="manleva" title="6) Clausola di Manleva">
        <p>
          L’utente manleva e tiene indenne SOS24ORE.it, i suoi amministratori e collaboratori da pretese derivanti
          da violazioni dei presenti termini o da uso illecito del servizio.
        </p>
      </LegalSection>

      <LegalSection id="disponibilita" title="7) Disponibilità e Garanzia di Continuità">
        <p>
          I servizi sono forniti “così come sono”. Non è garantita la continuità senza interruzioni, né la tempestiva
          presa in carico di ogni richiesta; disponibilità e tempi dipendono esclusivamente dall’organizzazione dei professionisti.
        </p>
      </LegalSection>

      <LegalSection id="terzieta" title="8) Terzietà e assenza di subordinazione">
        <p>
          I professionisti operano in piena autonomia, senza vincolo di subordinazione, agenzia o mandato. SOS24ORE.it
          non dirige né controlla la loro esecuzione.
        </p>
      </LegalSection>

      <LegalSection id="abusi" title="9) Uso improprio e abusi">
        <p>
          È vietato utilizzare il sito o il numero verde per richieste fraudolente o illecite. In caso di abusi,
          SOS24ORE.it si riserva di sospendere l’accesso e informare le Autorità competenti.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
