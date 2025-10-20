// src/app/_shared/dataFetch.ts
export const SERVICE = "idraulico"; // puoi non usarlo qui se fai factory per servizi
export const CITY = "roma";
export const NUMERO_VERDE = "800 00 24 24";

export function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function fetchSeo(service: string, city: string, area?: string) {
  const url = new URL(`${baseUrl()}/api/public/seo`);
  url.searchParams.set("service", service);
  url.searchParams.set("city", city);
  if (area) url.searchParams.set("area", area);

  const res = await fetch(url.toString(), {
    next: { revalidate: 600, tags: [`district:${service}:${city}:${area ?? "__city__"}`] },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAssignment(service: string, city: string, area: string) {
  const url = new URL(`${baseUrl()}/api/public/clients`);
  url.searchParams.set("service", service);
  url.searchParams.set("city", city);
  url.searchParams.set("area", area);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300, tags: [`assignment:${service}:${city}:${area}`] },
  });
  if (!res.ok) return null;
  return res.json(); // { data: {...} | null }
}

export function ucSlug(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
