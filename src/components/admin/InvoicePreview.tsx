"use client";

type Cliente = {
  id?: string;
  ragione_sociale?: string;
  piva?: string;
  cf?: string;
  sdi?: string;
  pec?: string;
  email_fatt?: string;
  indirizzo?: string;
  telefono?: string;
  banca?: string;
  iban?: string;
  sottoscrittore?: string;
};

type Ordine = {
  tipo?: "zones" | "calls";
  servizio?: string | null;
  citta?: string | null;
  quantita?: number;
  prezzo_unit?: number;
  iva?: number;
  sconto?: number;
  rate?: number;
  scadenza_giorni?: number;
  note?: string | null;
};

type Totali = {
  imponibile?: number;
  sconto?: number;
  imponibile_netto?: number;
  iva?: number;
  totale?: number;
  rata?: number;
};

type PreviewData = {
  cliente?: Cliente;
  ordine?: Ordine;
  totali?: Totali;
};

const eur = (n: number) =>
  n.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

export function InvoicePreview({ data }: { data: PreviewData }) {
  const C = data?.cliente ?? {};
  const O = data?.ordine ?? {};
  const T: Required<Totali> = {
    imponibile: data?.totali?.imponibile ?? 0,
    sconto: data?.totali?.sconto ?? 0,
    imponibile_netto: data?.totali?.imponibile_netto ?? 0,
    iva: data?.totali?.iva ?? 0,
    totale: data?.totali?.totale ?? 0,
    rata: data?.totali?.rata ?? 0,
  };

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase text-neutral-400">Anteprima</div>
          <h2 className="text-2xl font-semibold">Fattura</h2>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">SOS24ORE.it</div>
          <div className="text-xs text-neutral-400">Documento non fiscale</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-4">
          <div className="text-xs uppercase text-neutral-400">Intestatario</div>
          <div className="mt-1 font-medium">{C.ragione_sociale || "—"}</div>
          <div className="mt-2 space-y-1 text-sm text-neutral-300">
            {C.indirizzo && <div>{C.indirizzo}</div>}
            <div>IT</div>
            {C.piva && <div>P.IVA: {C.piva}</div>}
            {C.cf && <div>CF: {C.cf}</div>}
            {C.sdi && <div>SDI: {C.sdi}</div>}
            {C.pec && <div>PEC: {C.pec}</div>}
            {C.email_fatt && <div>Email fatturazione: {C.email_fatt}</div>}
            {C.telefono && <div>Tel: {C.telefono}</div>}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <div className="text-xs uppercase text-neutral-400">Pagamento</div>
          <div className="mt-2 space-y-1 text-sm text-neutral-300">
            <div>
              Metodo: <b>SDD</b>
            </div>
            <div>Rate: {O.rate}</div>
            {C.iban && <div>IBAN: {C.iban}</div>}
            {C.banca && <div>Intestatario IBAN: {C.banca}</div>}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-neutral-300">
            <tr>
              <th className="p-3">Descrizione</th>
              <th className="p-3">Qtà</th>
              <th className="p-3">Prezzo</th>
              <th className="p-3">Sconto</th>
              <th className="p-3">IVA</th>
              <th className="p-3 text-right">Totale</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-white/10">
              <td className="p-3">
                <div className="font-medium">
                  {O.tipo === "zones" ? "Pacchetto zone" : "Pacchetto telefonate"}
                </div>
                <div className="text-xs text-neutral-400">
                  {O.servizio ? `Servizio: ${O.servizio} • ` : ""}
                  {O.citta ? `Città: ${O.citta}` : ""}
                </div>
                {O.note && <div className="mt-1 text-xs text-neutral-300">{O.note}</div>}
              </td>
              <td className="p-3">{O.quantita}</td>
              <td className="p-3">{eur(O.prezzo_unit ?? 0)}</td>
              <td className="p-3">{O.sconto ? `${O.sconto}%` : "—"}</td>
              <td className="p-3">{O.iva}%</td>
              <td className="p-3 text-right">{eur(T.imponibile_netto)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-4 text-sm">
          <div className="text-xs uppercase text-neutral-400">Contratto</div>
          <div className="mt-1 text-neutral-300">
            Rate: {O.rate} • Scadenza: {O.scadenza_giorni}gg
          </div>
          {C.sottoscrittore && (
            <div className="mt-1 text-neutral-300">Sottoscrittore: {C.sottoscrittore}</div>
          )}
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Imponibile</span>
              <b>{eur(T.imponibile)}</b>
            </div>
            {T.sconto ? (
              <div className="flex justify-between">
                <span>Sconto</span>
                <b>-{eur(T.sconto)}</b>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Imponibile netto</span>
              <b>{eur(T.imponibile_netto)}</b>
            </div>
            <div className="flex justify-between">
              <span>IVA {O.iva}%</span>
              <b>{eur(T.iva)}</b>
            </div>
            <div className="mt-2 flex justify-between text-base">
              <span>Totale</span>
              <b>{eur(T.totale)}</b>
            </div>
            {O.rate && O.rate > 1 && (
              <div className="flex justify-between">
                <span>Rata ({O.rate})</span>
                <b>{eur(T.rata)}</b>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
