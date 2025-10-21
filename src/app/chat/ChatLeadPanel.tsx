// src/app/chat/ChatLeadPanel.tsx

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
  lead: Lead | null;                 // ⬅️ ora può essere null
  onConfirm: () => void;
  disabled?: boolean;                // opzionale (usato nella page)
  sending?: boolean;                 // opzionale (usato nella page)
  sentOk?: boolean | null;           // opzionale (usato nella page)
};

const Field = ({ label, value }: { label: string; value?: string }) => {
  const empty = !value || String(value).trim() === "";
  return (
    <div className={empty ? "text-yellow-400" : ""}>
      <b>{label}:</b> {empty ? "—" : String(value)}
    </div>
  );
};

export default function ChatLeadPanel({
  lead,
  onConfirm,
  disabled = false,
  sending = false,
  sentOk = null,
}: Props) {
  // stato iniziale: nessun lead ancora
  if (!lead) {
    return (
      <div className="rounded-2xl border border-zinc-800 p-4 card-glow text-sm text-zinc-300">
        Nessun riepilogo ancora. Scrivi in chat: rilevo servizio, zona e problema man mano.
      </div>
    );
  }

  const ready =
    !!lead.servizio &&
    !!lead.zona &&
    (!!lead.problema || !!lead.pricing?.ready);

  const confirmDisabled = disabled || sending || !ready;

  return (
    <div className="rounded-2xl border border-zinc-800 p-4 card-glow">
      <div className="mb-2 text-zinc-400">Riepilogo per operatore</div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2 text-sm">
        <Field label="Servizio" value={lead.servizio} />
        <Field label="Zona" value={lead.zona} />
        <Field label="Urgenza" value={lead.urgenza} />
        <Field label="Fascia" value={lead.fascia_oraria} />
        <div className="md:col-span-2">
          <Field label="Problema" value={lead.problema} />
        </div>
        <div className="md:col-span-2">
          <Field label="Accesso" value={lead.accesso} />
        </div>
        {/* extra/pricing se vuoi, qui sono opzionali */}
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
          disabled={confirmDisabled}
          className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/60 px-3 py-2 font-medium disabled:opacity-50"
          title={
            ready ? "Invia i dati all’operatore" : "Completa i campi mancanti"
          }
        >
          {sending ? "Invio in corso…" : "Confermo, passa i dati"}
        </button>

        {sentOk === true && (
          <span className="text-emerald-300 text-sm">Inviato ✓</span>
        )}
        {sentOk === false && (
          <span className="text-red-400 text-sm">Errore nell’invio</span>
        )}
      </div>
    </div>
  );
}

