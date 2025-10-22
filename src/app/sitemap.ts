// src/app/sitemap.ts
import type { MetadataRoute } from "next";

/**
 * Sitemap dinamica per SOS24ORE.it
 * - Sorgente primaria: /api/public/seo  → { service, city, area, updated_at }
 * - Fallback: /api/public/assignments e /api/public/areas
 * - Fallback finale: rotte statiche + landing di servizio note
 *
 * NOTE:
 * - Usiamo le API pubbliche del progetto per NON dipendere da chiavi Supabase lato server.
 * - Se in futuro la cardinalità supera ~45k URL, valuta uno split in index multipli (next-sitemap).
 */

type SitemapItem = MetadataRoute.Sitemap[number];

type SeoRow = {
  service: string;         // es. "idraulico"
  city?: string | null;    // es. "roma"
  area?: string | null;    // es. "prati"
  updated_at?: string | null;
};

type AssignmentRow = {
  service: string;
  city: string;
  area?: string | null;
  updated_at?: string | null;
};

type AreaRow = {
  city: string;            // es. "roma"
  slug: string;            // es. "prati"
  updated_at?: string | null;
};

const KNOWN_SERVICES = [
  "idraulico",
  "fabbro",
  "elettricista",
  "spurgo",
  "caldaie",
  "disinfestazioni",
  "vetraio",
  "assistenza-stradale",
] as const;

function siteBase() {
  // Preferisci l'ENV in produzione; in dev va bene localhost
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function makeItem(url: string, last?: string | Date | null, cf?: SitemapItem["changeFrequency"], prio?: number): SitemapItem {
  return {
    url,
    lastModified: last ? new Date(last) : new Date(),
    changeFrequency: cf,
    priority: prio,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE = siteBase();
  const now = new Date();

  // 0) Rotte statiche “core”
  const staticRoutes: SitemapItem[] = [
    makeItem(`${SITE}/`, now, "daily", 1),
    makeItem(`${SITE}/privacy`, now, "yearly", 0.3),
    makeItem(`${SITE}/cookie`, now, "yearly", 0.3),
    makeItem(`${SITE}/termini`, now, "yearly", 0.3),
    makeItem(`${SITE}/privacy-chat`, now, "yearly", 0.2),
    makeItem(`${SITE}/contatti`, now, "yearly", 0.4),
  ];

  // 1) Sorgente primaria: SEO consolidation
  const seoData = await fetchJson<SeoRow[]>(
    `${SITE}/api/public/seo`
  );

  if (seoData && seoData.length) {
    const items: SitemapItem[] = [];
    for (const row of seoData) {
      if (!row?.service) continue;

      let path = `/${row.service}`;
      let prio = 0.9;
      let cf: SitemapItem["changeFrequency"] = "weekly";

      if (row.city) {
        path += `/${row.city}`;
        prio = 0.8;
        cf = "weekly";
        if (row.area) {
          path += `/${row.area}`;
          prio = 0.6;
          cf = "monthly";
        }
      }

      items.push(makeItem(`${SITE}${path}`, row.updated_at ?? now, cf, prio));
    }

    // Aggiungi comunque landing servizio principali (se mancasse qualche root)
    for (const s of KNOWN_SERVICES) {
      const url = `${SITE}/${s}`;
      if (!items.some(i => i.url === url)) {
        items.push(makeItem(url, now, "weekly", 0.9));
      }
    }

    return [...staticRoutes, ...items];
  }

  // 2) Fallback: assignments + areas
  const [assignments, areas] = await Promise.all([
    fetchJson<AssignmentRow[]>(`${SITE}/api/public/assignments`),
    fetchJson<AreaRow[]>(`${SITE}/api/public/areas`),
  ]);

  if ((assignments && assignments.length) || (areas && areas.length)) {
    const items: SitemapItem[] = [];

    // Landing servizio (se presenti assegnazioni)
    if (assignments?.length) {
      const byService = new Set(assignments.map(a => a.service).filter(Boolean));
      for (const s of byService) {
        items.push(makeItem(`${SITE}/${s}`, now, "weekly", 0.9));
      }
      // City e district
      for (const a of assignments) {
        if (!a.service || !a.city) continue;
        const base = `${SITE}/${a.service}/${a.city}`;
        items.push(makeItem(base, a.updated_at ?? now, "weekly", 0.8));
        if (a.area) {
          items.push(makeItem(`${base}/${a.area}`, a.updated_at ?? now, "monthly", 0.6));
        }
      }
    } else {
      // Se non ho assignments, ma ho elenco aree per città, provo a combinare coi servizi noti (meno preciso)
      const byCityAreas = new Map<string, string[]>();
      for (const ar of areas ?? []) {
        if (!ar.city || !ar.slug) continue;
        const arr = byCityAreas.get(ar.city) ?? [];
        if (!arr.includes(ar.slug)) arr.push(ar.slug);
        byCityAreas.set(ar.city, arr);
      }
      for (const service of KNOWN_SERVICES) {
        items.push(makeItem(`${SITE}/${service}`, now, "weekly", 0.9));
        for (const [city, districtList] of byCityAreas) {
          items.push(makeItem(`${SITE}/${service}/${city}`, now, "weekly", 0.8));
          for (const d of districtList) {
            items.push(makeItem(`${SITE}/${service}/${city}/${d}`, now, "monthly", 0.6));
          }
        }
      }
    }

    return [...staticRoutes, ...items];
  }

  // 3) Fallback finale “di cortesia”: solo statiche + landing note
  const minimalServices: SitemapItem[] = KNOWN_SERVICES.map(s =>
    makeItem(`${SITE}/${s}`, now, "weekly", 0.9)
  );
  return [...staticRoutes, ...minimalServices];
}
