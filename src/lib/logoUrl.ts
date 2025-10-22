export function resolveLogoUrl(raw?: string | null): string | null {
  if (!raw) return null;

  // Se è già un URL completa (http/https) la restituiamo così com'è
  if (/^https?:\/\//i.test(raw)) return raw;

  // Altrimenti costruiamo la URL completa dal bucket pubblico Supabase
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  return `${base}/storage/v1/object/public/logos/${raw.replace(/^\/+/, "")}`;
}
