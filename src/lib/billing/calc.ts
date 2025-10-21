// src/lib/billing/calc.ts
export type OrderInput = {
  quantity: number;          // es. 3
  unit_price: number;        // es. 298 (euro)
  vat_percent: number;       // es. 22
  discount_percent: number;  // es. 10
  installments: number;      // es. 3
};

export type OrderTotals = {
  imponibile: number;   // € decimali
  sconto: number;       // €
  imponibile_netto: number; // €
  iva: number;          // €
  totale: number;       // €
  rata: number;         // €
};

export function calcTotals(input: OrderInput): OrderTotals {
  const q = Math.max(1, input.quantity || 1);
  const up = Math.max(0, input.unit_price || 0);
  const disc = Math.max(0, input.discount_percent || 0);
  const vat = Math.max(0, input.vat_percent || 0);
  const inst = Math.max(1, input.installments || 1);

  const imponibile = q * up;
  const sconto = +(imponibile * (disc / 100)).toFixed(2);
  const imponibile_netto = +(imponibile - sconto).toFixed(2);
  const iva = +((imponibile_netto * vat) / 100).toFixed(2);
  const totale = +(imponibile_netto + iva).toFixed(2);
  const rata = +(totale / inst).toFixed(2);

  return { imponibile, sconto, imponibile_netto, iva, totale, rata };
}

