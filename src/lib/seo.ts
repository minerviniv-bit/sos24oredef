export type SeoRecord = {
  path: string;
  title: string;
  description: string;
  h1: string;
  bodyHtml: string;
  faqs?: { q: string; a: string }[];
  status: "draft" | "published";
};

async function fetchAdminSeo(path: string): Promise<SeoRecord | null> {
  try {
    const res = await fetch(`/api/public/seo?path=${encodeURIComponent(path)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.status !== "published") return null;
    return data as SeoRecord;
  } catch {
    return null;
  }
}

export async function getSeoContent(path: string): Promise<SeoRecord> {
  const adminData = await fetchAdminSeo(path);
  if (adminData) return adminData;

  // fallback auto SEO
  return {
    path,
    title: `SOS24ORE.it – Emergenze H24 a ${path}`,
    description: `Contatta un professionista H24 a ${path}. Numero Verde 800 00 24 24.`,
    h1: `Emergenze H24 a ${path}`,
    bodyHtml: `<p>SOS24ORE.it ti mette in contatto con professionisti qualificati a ${path}. Servizi urgenti: idraulico, fabbro, elettricista, spurgo e altro.</p>`,
    faqs: [
      { q: "Il servizio è attivo anche nei festivi?", a: "Sì, 24 ore su 24." },
      { q: "Il numero verde è gratuito?", a: "Sì, le chiamate sono gratuite da tutta Italia." },
    ],
    status: "published",
  };
}
