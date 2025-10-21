// src/data/services.ts
import { SERVICES as NAV_SERVICES } from "@/app/_shared/serviceNavConfig";

// Descrizioni sintetiche per la HOME
const HOME_DESC: Record<string, string> = {
  idraulico: "Ti mettiamo in contatto con un idraulico vicino a te.",
  fabbro: "Ti colleghiamo al fabbro disponibile nella tua zona.",
  elettricista: "Ti colleghiamo a un elettricista disponibile ora.",
  spurgo: "Ti mettiamo in contatto con un autospurgo H24.",
  caldaie: "Tecnici per assistenza e manutenzione caldaie.",
  disinfestazioni: "Disinfestatori certificati per ogni infestazione.",
  vetraio: "Sostituzione vetri e cristalli, anche urgente.",
  "assistenza-stradale": "Carroattrezzi disponibile subito, H24.",
};

// Titolo per la HOME (più markettaro di label)
const HOME_TITLE: Record<string, string> = {
  idraulico: "Idraulico H24",
  fabbro: "Fabbro e Apertura Porte",
  elettricista: "Elettricista Urgente",
  spurgo: "Spurgo & Fognature",
  caldaie: "Assistenza Caldaie",
  disinfestazioni: "Disinfestazioni",
  vetraio: "Vetraio",
  "assistenza-stradale": "Assistenza Stradale",
};

// fallback sicuro se manca l’icona
const iconOrFallback = (icon: string | undefined, slug: string) =>
  icon ?? `/mascotte/${slug}.webp`;

export const HOMESERVICES = NAV_SERVICES.map((s) => ({
  slug: s.slug,
  title: HOME_TITLE[s.slug] ?? s.label,
  desc: HOME_DESC[s.slug] ?? `Pronto intervento ${s.label}.`,
  img: iconOrFallback(s.icon, s.slug),            // ← usa la stessa icona del menu
  imgAlt: `Mascotte ${s.label}`,
  href: s.href ?? `/${s.slug}`,                   // ← pagina mamma nazionale
}));

// (se ti serve altrove) lista servizi + città supportate
export const SERVICES = NAV_SERVICES.map((s) => ({
  slug: s.slug,
  label: s.label,
  cities: ["roma"],                 // estendi qui quando aggiungi altre città
  cityLabels: { roma: "Roma" },
}));

