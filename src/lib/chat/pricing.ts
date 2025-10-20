import { normalizeLockType } from "./utils";

/* === Tipi minimi per non usare any === */
type LeadExtra = {
  lock_type?: string;
  chiave_spezzata?: boolean;
};

type LeadLite = {
  urgenza?: string;
  note?: string;
  extra?: LeadExtra;
};

type FabbroExtras = {
  chiave_spezzata?: number | string;
  notte_festivi_molt?: number | string; // moltiplicatore (es. 1.3)
};

type FabbroTariffs = {
  apertura_porta: Record<string, number | string>; // lock_type normalizzato -> prezzo
  extra?: FabbroExtras;
};

type Tariffs = {
  fabbro?: FabbroTariffs;
};

type PriceResult = { item: string; price: number; note: string };

/* === Calcolo prezzo puntuale in base al tipo serratura e extra === */
export function computeFabbroPrice(
  lead: LeadLite,
  tariffs: Tariffs
): PriceResult | null {
  if (!tariffs?.fabbro?.apertura_porta) return null;

  const itemTable = tariffs.fabbro.apertura_porta;
  const extras: FabbroExtras = tariffs.fabbro.extra || {};

  const rawLock = (lead?.extra?.lock_type || "").toString();
  const lock = normalizeLockType(rawLock);
  const base = itemTable[lock];
  if (base == null) return null;

  let price = Number(base);
  if (lead?.extra?.chiave_spezzata) {
    price += Number(extras.chiave_spezzata || 0);
  }

  const urgencyText = `${lead?.urgenza || ""} ${lead?.note || ""}`.toLowerCase();
  const isNightHoliday = /\b(not(te)?|festiv[io])\b/.test(urgencyText);

  const molt = Number(extras.notte_festivi_molt || 0);
  if (isNightHoliday && molt && Number.isFinite(molt) && molt > 1) {
    price = Math.round(price * molt);
  }

  return {
    item: `Apertura porta (${lock.replace(/_/g, " ")})`,
    price,
    note: isNightHoliday ? "notte/festivi" : "",
  };
}

/* === Range prezzi base + delta notte/festivi === */
export function computeFabbroRange(tariffs: Tariffs): {
  min: number;
  max: number;
  nightAdd: { min: number; max: number } | null;
} | null {
  const itemTable = tariffs?.fabbro?.apertura_porta;
  if (!itemTable) return null;

  const prices = Object.values(itemTable)
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);

  if (!prices.length) return null;

  const min = prices[0]!;
  const max = prices[prices.length - 1]!;

  const extras: FabbroExtras = tariffs?.fabbro?.extra || {};
  const molt = Number(extras.notte_festivi_molt || 0);

  let nightAdd: { min: number; max: number } | null = null;
  if (molt && molt > 1) {
    const deltaMin = Math.round(min * (molt - 1));
    const deltaMax = Math.round(max * (molt - 1));
    nightAdd = { min: deltaMin, max: deltaMax };
  }

  return { min, max, nightAdd };
}
