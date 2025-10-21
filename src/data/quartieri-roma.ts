// src/data/quartieri-roma.ts
export type MacroSlug = "roma-centro" | "roma-nord" | "roma-sud" | "roma-ovest" | "roma-est" | "litorale";
export type Area = { slug: string; label: string; macro: MacroSlug };

export const MACRO_TITLES: Record<MacroSlug, string> = {
  "roma-centro": "Roma Centro",
  "roma-nord": "Roma Nord",
  "roma-sud": "Roma Sud",
  "roma-ovest": "Roma Ovest",
  "roma-est": "Roma Est",
  "litorale": "Litorale Romano",
};

export const ROMA_AREAS: Area[] = [
  // ===== CENTRO =====
  { slug: "celio", label: "Celio", macro: "roma-centro" },
  { slug: "colle-oppi", label: "Colle Oppio", macro: "roma-centro" },
  { slug: "campo-marzo", label: "Campo Marzio", macro: "roma-centro" },
  { slug: "esquilino", label: "Esquilino", macro: "roma-centro" },
  { slug: "monti", label: "Monti", macro: "roma-centro" },
  { slug: "piazza-navona", label: "Piazza Navona", macro: "roma-centro" },
  { slug: "prati", label: "Prati", macro: "roma-centro" },
  { slug: "regola", label: "Regola", macro: "roma-centro" },
  { slug: "san-saba", label: "San Saba", macro: "roma-centro" },
  { slug: "sant-angelo", label: "Sant'Angelo", macro: "roma-centro" },
  { slug: "testaccio", label: "Testaccio", macro: "roma-centro" },
  { slug: "trastevere", label: "Trastevere", macro: "roma-centro" },
  { slug: "trevi", label: "Trevi", macro: "roma-centro" },
  { slug: "tor-marancia", label: "Tor Marancia", macro: "roma-centro" },
  { slug: "colosseo", label: "Colosseo", macro: "roma-centro" },
  { slug: "villa-borghese", label: "Villa Borghese", macro: "roma-centro" },
  { slug: "castro-pretorio", label: "Castro Pretorio", macro: "roma-centro" },
  { slug: "sallustiano", label: "Sallustiano", macro: "roma-centro" },
  { slug: "pinciano", label: "Pinciano", macro: "roma-centro" },

  // ===== NORD =====
  { slug: "parioli", label: "Parioli", macro: "roma-nord" },
  { slug: "nomentano", label: "Nomentano", macro: "roma-nord" },
  { slug: "trieste", label: "Trieste", macro: "roma-nord" },
  { slug: "africano", label: "Africano", macro: "roma-nord" },
  { slug: "montesacro", label: "Montesacro", macro: "roma-nord" },
  { slug: "talenti", label: "Talenti", macro: "roma-nord" },
  { slug: "conca-d-oro", label: "Conca d'Oro", macro: "roma-nord" },
  { slug: "tufello", label: "Tufello", macro: "roma-nord" },
  { slug: "fidene", label: "Fidene", macro: "roma-nord" },
  { slug: "tor-di-quinto", label: "Tor di Quinto", macro: "roma-nord" },
  { slug: "cassia", label: "Cassia", macro: "roma-nord" },
  { slug: "tomba-di-nerone", label: "Tomba di Nerone", macro: "roma-nord" },
  { slug: "labaro", label: "Labaro", macro: "roma-nord" },
  { slug: "giustiniana", label: "Giustiniana", macro: "roma-nord" },
  { slug: "grottarossa", label: "Grottarossa", macro: "roma-nord" },
  { slug: "olgiata", label: "Olgiata", macro: "roma-nord" },

  // ===== EST =====
  { slug: "casal-bruciato", label: "Casal Bruciato", macro: "roma-est" },
  { slug: "casalbertone", label: "Casalbertone", macro: "roma-est" },
  { slug: "collatino", label: "Collatino", macro: "roma-est" },
  { slug: "pietralata", label: "Pietralata", macro: "roma-est" },
  { slug: "san-basilio", label: "San Basilio", macro: "roma-est" },
  { slug: "tiburtino", label: "Tiburtino", macro: "roma-est" },
  { slug: "centocelle", label: "Centocelle", macro: "roma-est" },
  { slug: "alessandrino", label: "Alessandrino", macro: "roma-est" },
  { slug: "tor-de-schicchi", label: "Tor de' Schicchi", macro: "roma-est" },
  { slug: "pigneto", label: "Pigneto", macro: "roma-est" },
  { slug: "torpignattara", label: "Torpignattara", macro: "roma-est" },
  { slug: "casilino", label: "Casilino", macro: "roma-est" },
  { slug: "tor-bella-monaca", label: "Tor Bella Monaca", macro: "roma-est" },
  { slug: "torre-angela", label: "Torre Angela", macro: "roma-est" },
  { slug: "giardinetti", label: "Giardinetti", macro: "roma-est" },
  { slug: "torre-maura", label: "Torre Maura", macro: "roma-est" },
  { slug: "borgata-finocchio", label: "Borgata Finocchio", macro: "roma-est" },
  { slug: "grotte-celoni", label: "Grotte Celoni", macro: "roma-est" },

  // ===== SUD =====
  { slug: "appio-latino", label: "Appio Latino", macro: "roma-sud" },
  { slug: "appio-claudio", label: "Appio Claudio", macro: "roma-sud" },
  { slug: "appio-tuscolano", label: "Appio Tuscolano", macro: "roma-sud" },
  { slug: "cinecitta", label: "Cinecittà", macro: "roma-sud" },
  { slug: "don-bosco", label: "Don Bosco", macro: "roma-sud" },
  { slug: "quadraro", label: "Quadraro", macro: "roma-sud" },
  { slug: "garbatella", label: "Garbatella", macro: "roma-sud" },
  { slug: "ostiense", label: "Ostiense", macro: "roma-sud" },
  { slug: "san-paolo", label: "San Paolo", macro: "roma-sud" },
  { slug: "ardeatino", label: "Ardeatino", macro: "roma-sud" },
  { slug: "tor-marancia", label: "Tor Marancia", macro: "roma-sud" },
  { slug: "eur", label: "EUR", macro: "roma-sud" },
  { slug: "laurentino", label: "Laurentino", macro: "roma-sud" },
  { slug: "torrino", label: "Torrino", macro: "roma-sud" },
  { slug: "mezzocammino", label: "Mezzocammino", macro: "roma-sud" },
  { slug: "spinaceto", label: "Spinaceto", macro: "roma-sud" },
  { slug: "mostacciano", label: "Mostacciano", macro: "roma-sud" },
  { slug: "trigoria", label: "Trigoria", macro: "roma-sud" },

  // ===== OVEST =====
  { slug: "marconi", label: "Marconi", macro: "roma-ovest" },
  { slug: "portuense", label: "Portuense", macro: "roma-ovest" },
  { slug: "magliana", label: "Magliana", macro: "roma-ovest" },
  { slug: "monteverde", label: "Monteverde", macro: "roma-ovest" },
  { slug: "bravetta", label: "Bravetta", macro: "roma-ovest" },
  { slug: "casetta-mattei", label: "Casetta Mattei", macro: "roma-ovest" },
  { slug: "primavalle", label: "Primavalle", macro: "roma-ovest" },
  { slug: "torrevecchia", label: "Torrevecchia", macro: "roma-ovest" },
  { slug: "boccea", label: "Boccea", macro: "roma-ovest" },
  { slug: "montespaccato", label: "Montespaccato", macro: "roma-ovest" },
  { slug: "monte-mario", label: "Monte Mario", macro: "roma-ovest" },
  { slug: "balduina", label: "Balduina", macro: "roma-ovest" },
  { slug: "trionfale", label: "Trionfale", macro: "roma-ovest" },
  { slug: "camilluccia", label: "Camilluccia", macro: "roma-ovest" },
  { slug: "ottavia", label: "Ottavia", macro: "roma-ovest" },

  // ===== LITORALE =====
  { slug: "ostia", label: "Ostia", macro: "litorale" },
  { slug: "casal-palocco", label: "Casal Palocco", macro: "litorale" },
  { slug: "infernetto", label: "Infernetto", macro: "litorale" },
  { slug: "axa", label: "AXA", macro: "litorale" },
  { slug: "acilia", label: "Acilia", macro: "litorale" },
];

export const ROMA_BY_MACRO: Record<MacroSlug, Area[]> =
  Object.values(ROMA_AREAS).reduce((acc, a) => {
    (acc[a.macro] ||= []).push(a);
    return acc;
  }, {} as Record<MacroSlug, Area[]>);

export function areasSorted(m: MacroSlug) {
  return [...(ROMA_BY_MACRO[m] || [])].sort((a, b) => a.label.localeCompare(b.label, "it"));
}

export function findArea(slug: string): Area | undefined {
  return ROMA_AREAS.find(a => a.slug === slug);
}

/* ====== BACKWARD COMPAT ======
   Per non rompere vecchie importazioni nel progetto
   (es. QUARTIERI_ROMA, QUARTIERI_SLUGS, findQuartiere)
*/
export type Quartiere = Area;
export const QUARTIERI_ROMA: Quartiere[] = ROMA_AREAS;
export const QUARTIERI_SLUGS: string[] = ROMA_AREAS.map(a => a.slug);
export function findQuartiere(slug: string): Quartiere | undefined {
  return findArea(slug);
}

