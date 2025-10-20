type Lead = {
  servizio?: string;
  zona?: string;
  urgenza?: string;
  fascia_oraria?: string;
  problema?: string;
  accesso?: string;
  pricing?: { ready?: boolean; item?: string; price?: number; note?: string };
  extra?: Record<string, unknown>;
};

type Props = {
  lead: Lead;
  onConfirm: () => void;
};

const Field = ({ label, value }: { label: string; value?: string }) => {
  const empty = !value || String(value).trim() === "";
  return (
    <div className={empty ? "text-yellow-400" : ""}>
      <b>{label}:</b> {empty ? "—" : String(value)}
    </div>
  );
};

export default function ChatLeadPanel({ lead, onConfirm }: Props) {
  const ready =
    !!lead?.servizio &&
    !!lead?.zona &&
    (lead?.problema || lead?.pricing?.ready);

  return (
    <div className="rounded-2xl border border-zinc-800 p-4 card-glow">
      <div className="mb-2 text-zinc-400">Riepilogo per operatore</div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2 text-sm">
        <Field label="Servizio" value={lead?.servizio} />
        <Field label="Zona" value={lead?.zona} />
        <Field label="Urgenza" value={lead?.urgenza} />
        <Field label="Fascia" value={lead?.fascia_oraria} />
        <div className="md:col-span-2">
          <Field label="Problema" value={lead?.problema} />
        </div>
        <div className="md:col-span-2">
          <Field label="Accesso" value={lead?.accesso} />
        </div>
        {/* extra e pricing opzionali */}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href="tel:800002424"
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/60 px-3 py-2 font-medium hover:bg-emerald-500/10"
        >
          Chiama ora 800 00 24 24
        </a>
        <button
          onClick={onConfirm}
          disabled={!ready}
          className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/60 px-3 py-2 font-medium disabled:opacity-50"
          title={
            ready
              ? "Invia i dati all’operatore"
              : "Completa i campi mancanti"
          }
        >
          Confermo, passa i dati
        </button>
      </div>
    </div>
  );
}
