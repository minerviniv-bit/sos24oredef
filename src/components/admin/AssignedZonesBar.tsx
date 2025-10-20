"use client";
import { useEffect, useState, useCallback } from "react";

type Row = { service:string; city:string; area_slug:string; client_id:string; client_name:string; };

export default function AssignedZonesBar({
  service,
  clientId,
  onChanged,
}: {
  service: string | null;
  clientId: string | null;
  onChanged?: () => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!service || !clientId) { setRows([]); return; }
    setLoading(true);
    try {
      // usa l’endpoint che hai creato per il riepilogo
      const res = await fetch(`/api/admin/assign/by-client?service=${encodeURIComponent(service)}&client_id=${encodeURIComponent(clientId)}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore caricamento");
      setRows(json.data || []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [service, clientId]);

  useEffect(() => { load(); }, [load]);

  async function unassign(area_slug: string, city: string) {
    if (!service || !clientId) return;
    const ok = confirm(`Liberare la zona ${area_slug} (${city})?`);
    if (!ok) return;
    const r = await fetch("/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, city, area_slug, client_id: null }),
    });
    const j = await r.json();
    if (!r.ok) { alert(j?.error || "Operazione fallita"); return; }
    await load();
    onChanged?.(); // ricarica la griglia “Zone” sotto
  }

  if (!service || !clientId) return null;

  return (
    <div className="rounded-xl bg-neutral-900/60 border border-white/10 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Zone assegnate al cliente</div>
        {loading && <div className="text-xs text-neutral-400">caricamento…</div>}
      </div>

      {rows.length === 0 ? (
        <div className="text-xs text-neutral-400">Nessuna zona assegnata per questo servizio.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {rows.map((r) => (
            <button
              key={`${r.city}-${r.area_slug}`}
              onClick={() => unassign(r.area_slug, r.city)}
              className="group inline-flex items-center gap-2 rounded-full bg-fuchsia-900/25 border border-fuchsia-600/40 px-3 py-1 text-xs hover:bg-fuchsia-900/40"
              title="Clicca per liberare"
            >
              <span className="opacity-70">{r.city}</span>
              <span className="font-semibold">{r.area_slug}</span>
              <span className="text-neutral-300 group-hover:text-white">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
