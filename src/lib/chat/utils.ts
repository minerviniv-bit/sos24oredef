// src/lib/chat/utils.ts

// =============================================================
// NORMALIZZAZIONI & MAPPE COMUNI
// =============================================================

export function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export const LOCK_MAP: Record<string, string> = {
  yale_classica: "yale_classica",
  cilindro_europeo: "cilindro_europeo",
  doppia_mappa: "doppia_mappa",
  blindata_cilindro: "blindata_cilindro",
  yale: "yale_classica",
  serratura_yale: "yale_classica",
  cilindro: "cilindro_europeo",
  cilindro_standard: "cilindro_europeo",
  europeo: "cilindro_europeo",
  porta_blindata: "blindata_cilindro",
  blindata: "blindata_cilindro",
  "doppia-mappa": "doppia_mappa",
  doppia_mappa_antik: "doppia_mappa",
};

export function normalizeLockType(raw: string) {
  const n = norm(raw || "");
  if (!n) return "";
  if (LOCK_MAP[n]) return LOCK_MAP[n];
  const keys = Object.keys(LOCK_MAP);
  const hit = keys.find((k) => n.startsWith(k));
  return hit ? LOCK_MAP[hit] : n;
}

// =============================================================
// SCRUB NUMERI / LINK ESTERNI (whitelist 800/112/113/115/118)
// =============================================================
export function scrub(text: string) {
  if (!text) return text;
  const WHITELIST = /(800\s*00\s*24\s*24|112|113|115|118)/;
  text = text.replace(/\+?\d[\d \-]{7,}\b/g, (m) => (WHITELIST.test(m) ? m : "【numero rimosso】"));
  text = text.replace(/\bhttps?:\/\/(?![^ ]*sos24ore\.it)[^\s]+/gi, "【link rimosso】");
  return text;
}

// =============================================================
// CLASSIFICAZIONE SERVIZIO (8 CATEGORIE)
// =============================================================

export type ServiceKey =
  | "idraulico"
  | "fabbro"
  | "spurgo"
  | "elettricista"
  | "caldaie"
  | "disinfestazioni"
  | "vetraio"
  | "assistenza-stradale";

const SERVICE_KEYWORDS: Record<ServiceKey, string[]> = {
  idraulico: [
    "perdita","allag","rubinet","tubo","scarico","wc","water","lavandino",
    "sifone","doccia","bidet","calcare","otturato","otturazione","gomma","valvola","autoclave"
  ],
  fabbro: [
    "chiave","serratura","porta","blindata","bloccata","apertura",
    "cilindro","yale","maniglia","lucchetto","basculante","saracinesca","garage"
  ],
  spurgo: [
    "pozzo nero","fossa biologica","spurgo","autospurgo","fogn",
    "pozzetto","canal-jet","canal jet","stura","fogne","fognatura","aspi"
  ],
  elettricista: [
    "corrente","luce","salvavita","differenziale","quadro","presa",
    "corto","scintilla","impianto elettrico","magnetotermico","mt","dijuntore","blackout"
  ],
  caldaie: [
    "caldaia","termosifone","radiatore","scaldabagno","bollitore",
    "errore a0","fiamma","accensione","pressione caldaia","vaillant","baxi","beretta","ariston"
  ],
  disinfestazioni: [
    "blatte","scarafaggi","cimici","cimex","zanzare","vespe","calabroni",
    "topi","ratti","derattizzazione","disinfestazione","pulci","tarli","formiche","nidi"
  ],
  vetraio: [
    "vetro","vetrata","vetrina","cristallo","vetrocamera","doppio vetro",
    "spaccato","rotto","scheggiato","antisfondamento"
  ],
  "assistenza-stradale": [
    "carro attrezzi","traino","panne","auto in panne","avviamento","batteria scarica",
    "ruota","gomma","foratura","incidente","soccorso stradale"
  ],
};

// sinonimi singola parola (retrocompat)
export const SERVICE_SYNONYMS: Record<string, "idraulico"|"fabbro"|"elettricista"|"spurgo"> = {
  rubinetto:"idraulico", perdita:"idraulico", tubo:"idraulico", sifone:"idraulico", allagamento:"idraulico",
  serratura:"fabbro", chiave:"fabbro", porta:"fabbro", blindata:"fabbro", sblocco:"fabbro",
  corto:"elettricista", salvavita:"elettricista", presa:"elettricista", quadro:"elettricista",
  fogna:"spurgo", wc:"spurgo", pozzo:"spurgo", tombino:"spurgo", intasato:"spurgo",
};

export function inferServiceFromText(t: string) {
  const words = (t || "").toLowerCase().split(/\W+/);
  for (const w of words) if (SERVICE_SYNONYMS[w]) return SERVICE_SYNONYMS[w];
  return null;
}

export function detectService(raw: string): ServiceKey | null {
  if (!raw) return null;
  const text = raw.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  for (const [svc, keys] of Object.entries(SERVICE_KEYWORDS) as [ServiceKey, string[]][]) {
    if (keys.some(k => text.includes(k))) return svc;
  }
  const legacy = inferServiceFromText(text);
  return (legacy as ServiceKey) || null;
}

// =============================================================
// SALUTI
// =============================================================
export function isGreeting(raw: string): boolean {
  if (!raw) return false;
  const t = raw.trim().toLowerCase();
  return /^(ciao|buongiorno|buonasera|salve|hey|hola|hi|hello)\b/.test(t);
}

// =============================================================
// URGENZA
// =============================================================
export type UrgenzaKey = "subito" | "oggi" | "non urgente";

export function detectUrgency(raw: string): UrgenzaKey | null {
  if (!raw) return null;
  const t = raw.toLowerCase();

  if (/(subito|adesso|ora|immediato|urgent[ea]|allagament|acqua (in|dentro)|tubo rotto|chius[eo] acqua)/i.test(t)) {
    return "subito";
  }
  if (/(oggi|stasera|entro oggi|in giornata)/i.test(t)) return "oggi";
  if (/(domani|quando puoi|senza urgenza|non urgente)/i.test(t)) return "non urgente";
  return null;
}

// =============================================================
// ZONA (match quartieri di Roma)
// =============================================================
function normalizeForMatch(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectZoneFromText(raw: string, quartieri: string[]): string | null {
  if (!raw || !quartieri?.length) return null;
  const txt = normalizeForMatch(raw).replace(/\b(all|al|alla|allo|nel|nella|nello|in|a)\b\s+/g, "");
  let best: string | null = null;
  let bestLen = 0;
  for (const q of quartieri) {
    const qn = normalizeForMatch(q);
    if (!qn) continue;
    if (txt.includes(qn) && qn.length > bestLen) {
      best = q; bestLen = qn.length;
    }
  }
  return best;
}

// =============================================================
// EMERGENZE DI PUBBLICA SICUREZZA / SOCCORSO
// =============================================================
export type EmergencyType = "fire" | "crime" | "medical" | "gas" | "unspecified";

/** Rileva richieste da deviare a emergenza 112/113/115/118 */
export function detectPublicSafetyEmergency(raw: string): EmergencyType | null {
  if (!raw) return null;
  const t = raw.toLowerCase();

  if (/\b(112|113|115|118)\b/.test(t)) return "unspecified";

  // GAS — match robusto (gas/metano/gpl + odore/puzza/fuga/perdita/sento/bombola/in casa)
  if (
    /(fuga|puzza|odore|perdita|sento|si sente).{0,12}\b(gas|metano|gpl)\b/.test(t) ||
    /\b(gas|metano|gpl)\b.{0,12}\b(in casa|in appartamento|in cucina|odore|puzza|fuga|perdita|bombola)\b/.test(t)
  ) return "gas";

  if (/(incendio|fiamme|fumo|sta bruciando|pompiere|pompieri)/.test(t)) return "fire";

  if (/(ladro|ladri|furto|rapina|scasso|aggressione|violenza|minaccia|polizia|carabinieri)/.test(t))
    return "crime";

  if (/(malore|infarto|ictus|svenimento|emorragia|ambulanza|118)/.test(t)) return "medical";

  return null;
}

