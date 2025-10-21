// src/app/_shared/dataFetch.ts

export const SERVICE = "idraulico"; // opzionale se usi factory per servizi
export const CITY = "roma";
export const NUMERO_VERDE = "800 00 24 24";

export function baseUrl() {
  // Ancora disponibile se ti serve altrove,
  // ma per SEO/assignment usiamo fetch relativo.
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Carica il blocco SEO per service/city/area.
 * Ritorna l'oggetto JSON come prima: { title, meta_description, h1, body_html, faqs, json_ld, ... } | null
 */
export async function fetchSeo(service: string, city: string, area?: string) {
  try {
    const qs = new URLSearchParams({ service, city, ...(area ? { area } : {}) }).toString();
    const res = await fetch(`/api/public/seo?${qs}`, {
      // ISR con tag per invalidazione mirata
      next: { revalidate: 600, tags: [`district:${service}:${city}:${area ?? "__city__"}`] },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Carica l'assegnazione cliente (partner) per service/city/area.
 * Ritorna { data: {...} | null } come prima, oppure null in errore.
 */
export async function fetchAssignment(service: string, city: string, area: string) {
  try {
    const qs = new URLSearchParams({ service, city, area }).toString();
    const res = await fetch(`/api/public/clients?${qs}`, {
      next: { revalidate: 300, tags: [`assignment:${service}:${city}:${area}`] },
    });
    if (!res.ok) return null;
    return res.json(); // { data: {...} | null }
  } catch {
    return null;
  }
}

/**
 * Utility: "piazza-navona" -> "Piazza Navona"
 */
export function ucSlug(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

