// src/app/privacy/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import LegalPageShell, { LegalSection } from "@/app/_shared/legal/LegalPageShell";

const SITE = "https://www.sos24ore.it";
const TITLE = "Privacy Policy | SOS24ORE.it";
const DESC =
  "Informativa completa sul trattamento dei dati personali da parte di SOS24ORE.it in conformità al GDPR (UE 2016/679).";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE}/privacy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE}/privacy`,
    siteName: "SOS24ORE.it",
    type: "website",
  },
};

export default function PrivacyPage() {
  const lastUpdate = "2025-10-22";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: `${SITE}/privacy`,
    dateModified: lastUpdate,
  };

  return (
    <LegalPageShell title="Privacy Policy" lastUpdate={lastUpdate}>
      <LegalSection id="titolare" title="1) Titolare del trattamento">
        <p>
          Titolare: <b>Minervini ADV S.r.l.</b> – P.IVA [inserire].<br />
          Sede legale: [indirizzo completo].<br />
          Email: <a href="mailto:privacy@sos24ore.it" className="underline">privacy@sos24ore.it</a>
        </p>
      </LegalSection>

      <LegalSection id="tipologie" title="2) Tipologie di dati trattati">
        <ul className="list-disc list-inside">
          <li>Dati di navigazione (log tecnici, IP, user agent, cookie).</li>
          <li>Dati forniti da moduli, chat o telefono (nome, email, telefono, testo richieste).</li>
          <li>Dati dei professionisti partner (P.IVA, contatti, descrizione attività).</li>
        </ul>
      </LegalSection>

      <LegalSection id="finalita" title="3) Finalità e base giuridica">
        <ul className="list-disc list-inside">
          <li>Gestione richieste e contatti tramite chat o Numero Verde – art. 6(b) GDPR.</li>
          <li>Adempimenti contabili e fiscali – art. 6(c) GDPR.</li>
          <li>Analisi aggregate, sicurezza e prevenzione abusi – art. 6(f) GDPR.</li>
          <li>Attività promozionali solo previo consenso esplicito – art. 6(a) GDPR.</li>
        </ul>
      </LegalSection>

      <LegalSection id="fornitori" title="4) Fornitori e trasferimenti">
        <p>
          I dati possono essere trattati da fornitori che agiscono come responsabili del trattamento:
        </p>
        <ul className="list-disc list-inside">
          <li><b>Vercel Inc.</b> – hosting e deploy.</li>
          <li><b>Supabase Inc.</b> – database e storage.</li>
          <li><b>OpenAI L.L.C.</b> – gestione chatbot.</li>
          <li><b>Google Ireland Ltd.</b> – analytics e tag manager.</li>
          <li><b>Meta Platforms Ireland</b> – campagne promozionali.</li>
        </ul>
        <p>
          Eventuali trasferimenti extra-UE avvengono su base di clausole contrattuali standard (SCC).
        </p>
      </LegalSection>

      <LegalSection id="conservazione" title="5) Tempi di conservazione">
        <p>
          I dati vengono conservati per il tempo necessario alla gestione della richiesta e comunque
          non oltre 12 mesi dalla chiusura del contatto. Le chat vengono eliminate dopo 30 giorni.
        </p>
      </LegalSection>

      <LegalSection id="sicurezza" title="6) Misure di sicurezza">
        <p>
          I sistemi SOS24ORE.it utilizzano connessioni cifrate (HTTPS/TLS), accessi autenticati e
          controlli di autorizzazione basati su ruoli per proteggere i dati personali.
        </p>
      </LegalSection>

      <LegalSection id="diritti" title="7) Diritti dell’interessato">
        <p>
          L’utente può esercitare i diritti di accesso, rettifica, cancellazione, limitazione,
          portabilità e opposizione scrivendo a{" "}
          <a href="mailto:privacy@sos24ore.it" className="underline">privacy@sos24ore.it</a>.
          È possibile proporre reclamo al Garante Privacy.
        </p>
      </LegalSection>

      <LegalSection id="cookie" title="8) Cookie e tecnologie simili">
        <p>
          Per informazioni sull’uso dei cookie e sulla gestione delle preferenze visita la{" "}
          <Link href="/cookie" className="underline">Cookie Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="contatti" title="9) Contatti">
        <p>Email dedicata: <a href="mailto:privacy@sos24ore.it" className="underline">privacy@sos24ore.it</a></p>
      </LegalSection>

      <Script id="ld-privacy" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </LegalPageShell>
  );
}
