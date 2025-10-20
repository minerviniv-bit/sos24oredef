export type City = { slug: string; label: string; sponsor?: { name: string; logo_url?: string } | null };

export const MOCK_CITIES: Record<string, City[]> = {
  idraulico: [{ slug: "roma", label: "Roma", sponsor: null }],
  fabbro:    [{ slug: "roma", label: "Roma", sponsor: null }],
  elettricista: [{ slug: "roma", label: "Roma", sponsor: null }],
  spurgo:    [{ slug: "roma", label: "Roma", sponsor: null }],
};
