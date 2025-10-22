import type { Metadata } from "next";
import LegalPageShell from "@/app/_shared/legal/LegalPageShell";

const SITE = "https://www.sos24ore.it";
const TITLE = "Privacy Chat | SOS24ORE.it";
const DESC = "Informativa sintetica sul trattamento dei dati trasmessi tramite chat SOS24ORE.it.";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE}/privacy-chat` },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESC, url: `${SITE}/privacy-chat`, siteName: "SOS24ORE.it" },
};

export default function PrivacyChat() {
  const lastUpdate = "2025-10-22";

  return (
    <LegalPageShell title="Privacy Chat" lastUpdate={lastUpdate}>
      <p>
        I messaggi inviati tramite la chat SOS24ORE.it vengono trattati al solo fine di fornire
        assistenza o inoltrare la richiesta al professionista disponibile.
      </p>
      <p>
        Le conversazioni sono conservate per massimo <b>30 giorni</b> e poi eliminate. Non inserire
        dati sensibili (salute, religione, orientamento, ecc.).
      </p>
      <p>
        Titolare del trattamento: <b>Minervini ADV S.r.l.</b> – Email:{" "}
        <a href="mailto:privacy@sos24ore.it" className="underline">
          privacy@sos24ore.it
        </a>.
      </p>
    </LegalPageShell>
  );
}
