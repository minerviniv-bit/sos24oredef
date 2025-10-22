import type { ServiceKey } from "@/app/_shared/serviceCityConfig";
import type { Metadata } from "next";
import DistrictPageShell from "./DistrictPageShell";
import { baseUrl, fetchSeo, fetchAssignment, ucSlug, CITY, NUMERO_VERDE } from "./dataFetch";
import { mascotsByService } from "@/app/_shared/serviceCityConfig";

function labelFromService(svc: string) {
  switch (svc) {
    case "idraulico": return "Idraulico H24";
    case "fabbro": return "Fabbro e Apertura Porte";
    case "elettricista": return "Elettricista Urgente";
    case "spurgo": return "Spurgo & Fognature";
    case "disinfestazioni": return "Disinfestazioni";
    case "caldaie": return "Assistenza Caldaie";
    case "vetraio": return "Vetraio";
    case "assistenza-stradale": return "Assistenza Stradale";
    default: return svc;
  }
}

function ensureSeoReady(html: string, numeroVerde: string) {
  let out = html || "";
  if (!/800\s*00\s*24\s*24/.test(out)) {
    out += `<h2>Chiama ora</h2><p>Numero Verde <strong>${numeroVerde}</strong>. Prezzo e tempi comunicati prima dell’uscita.</p>`;
  }
  if (!/collega gli utenti a professionisti indipendenti/i.test(out)) {
    out += `<p class="text-xs opacity-70"><em>SOS24ORE.it collega gli utenti a professionisti indipendenti; non eseguiamo lavori e non siamo responsabili degli interventi.</em></p>`;
  }
  return out;
}

export function buildQuartiereHandlers(service: string) {
  async function generateMetadata({ params }: { params: { quartiere: string } }): Promise<Metadata> {
    const area = params.quartiere;
    const seo = await fetchSeo(service, CITY, area);

    const title = seo?.title || `${labelFromService(service)} ${ucSlug(area)} – Roma | SOS24ORE.it`;
    const description =
      seo?.meta_description ||
      `Interventi ${labelFromService(service).toLowerCase()} a ${ucSlug(area)} (Roma). Prezzo comunicato prima dell’uscita.`;
    const canonical = `${baseUrl()}/${service}/${CITY}/${area}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: "article", locale: "it_IT" },
    };
  }

  async function Page({ params }: { params: { quartiere: string } }) {
    const area = params.quartiere;

    const [seo, assignmentWrap] = await Promise.all([
      fetchSeo(service, CITY, area),
      fetchAssignment(service, CITY, area),
    ]);

    const ass = assignmentWrap?.data || null;

    const serviceLabel = labelFromService(service);
    const cityLabel = "Roma";
    const districtLabel = ucSlug(area);

    const client = ass
      ? { name: ass.client_name || "Partner", logoUrl: ass.logo_url || undefined, isFallback: false }
      : { name: "SOS24ORE.it", isFallback: true as const };

    const jsonLd = seo?.json_ld || null;

    const companySeoHtml = `<p>Interventi ${serviceLabel.toLowerCase()} a ${districtLabel} (Roma). Diagnosi rapida, preventivo chiaro prima dell’uscita e operatività H24 in zona.</p>`;

    const seoBottomHtml = ensureSeoReady(seo?.body_html || "", NUMERO_VERDE);
    const faqs = Array.isArray(seo?.faqs) ? seo.faqs : [];

    const s = service as ServiceKey;
    const mascotSrc = mascotsByService[s] ?? "/mascotte/capitansos-mappa.webp";

    const piva = (ass as { piva?: string | null } | null)?.piva ?? null;
    const rating = (ass as { rating?: number | null } | null)?.rating ?? null;
    const interventiMese = (ass as { interventi_mese?: number | null } | null)?.interventi_mese ?? null;
    const telefonoCliente = (ass as { telefono?: string | null } | null)?.telefono ?? null;

    return (
      <>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}

        <DistrictPageShell
          mascotSrc={mascotSrc}
          serviceLabel={serviceLabel}
          cityLabel={cityLabel}
          districtLabel={districtLabel}
          heroSubtitle={`Interventi H24 a ${districtLabel}. Perdite d’acqua, tubi rotti, WC otturati, allagamenti.`}
          sponsorNote={ass ? "Partner SOS24ORE" : "Disponibile per sponsorizzazione"}
          tags={[districtLabel, "H24", "Uscita rapida"]}
          client={client}
          companySeoHtml={companySeoHtml}
          nearby={[]}
          servicesOffered={
            ass?.servizi_offerti || [
              "Riparazioni perdite",
              "Stasatura WC",
              "Ricerca infiltrazioni",
              "Sostituzione tubi",
              "Emergenze idrauliche",
            ]
          }
          infoRapide={[
            { label: "Orari", value: "H24 • 7/7" },
            { label: "Pagamenti", value: "Contanti, carte, POS" },
            ...(ass?.anni_attivita ? [{ label: "Anni attività", value: String(ass.anni_attivita) }] : []),
          ]}
          numeroVerde={NUMERO_VERDE}
          whatsappHref={ass?.whatsapp ? `https://wa.me/${String(ass.whatsapp).replace(/\D/g, "")}` : undefined}
          piva={piva}
          rating={rating}
          interventiMese={interventiMese}
          telefonoCliente={telefonoCliente}
          seoBottomHtml={seoBottomHtml}
          faqs={faqs}
        />
      </>
    );
  }

  return { Page, generateMetadata };
}

export const dynamic = "force-dynamic";
