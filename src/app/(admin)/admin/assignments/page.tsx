// src/app/(admin)/admin/assignments/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/admin/CustomSelect";
import AssignedZonesBar from "@/components/admin/AssignedZonesBar";

type AreaRow = {
  area_slug: string;
  area_label?: string;
  client_id?: string | null;
  client_name?: string | null;
};

type Client = {
  id: string;
  name: string;
  company_name?: string;
};

const SERVICES = [
  "idraulico",
  "fabbro",
  "elettricista",
  "spurgo",
  "caldaie",
  "disinfestazioni",
  "vetraio",
  "assistenza-stradale",
] as const;

const CITY = "roma" as const;

/* ---------- type guards utili, senza any ---------- */
function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function pickError(j: unknown): string | null {
  if (isObject(j) && typeof j.error === "string") return j.error;
  return null;
}
function pickDataArray<T>(j: unknown): T[] {
  if (isObject(j) && Array.isArray((j as { data?: unknown }).data)) {
    return (j as { data: unknown[] }).data as T[];
  }
  return [];
}
function getErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (isObject(err) && typeof err.message === "string") return err.message;
  return "Errore sconosciuto";
}

export default function AssignmentsPage() {
  const [service, setService] =
    useState<(typeof SERVICES)[number]>("idraulico");
  const city = CITY;

  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);

  // Carica clienti
  const loadClients = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/clients", { cache: "no-store" });
      const j = (await r.json().catch(() => null)) as unknown;
      if (!r.ok) throw new Error(pickError(j) ?? "Errore caricamento clienti");
      const arr = pickDataArray<Client>(j);
      setClients(arr);
      setErr(null);
    } catch (e: unknown) {
      setClients([]);
      setErr(getErrMessage(e));
    }
  }, []);

  // Carica aree (dipende da service/city)
  const loadAreas = useCallback(async () => {
    try {
      const r = await fetch(
        `/api/public/assignments?service=${service}&city=${city}`,
        { cache: "no-store" }
      );
      const j = (await r.json().catch(() => null)) as unknown;
      if (!r.ok) throw new Error(pickError(j) ?? "Errore caricamento aree");
      const arr = pickDataArray<AreaRow>(j);
      setAreas(arr);
      setErr(null);
    } catch (e: unknown) {
      setAreas([]);
      setErr(getErrMessage(e));
    }
  }, [service, city]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  // Filtra aree
  const filteredAreas = useMemo(() => {
    const qq = q.toLowerCase();
    return areas.filter((a) =>
      (a.area_label || a.area_slug).toLowerCase().includes(qq)
    );
  }, [areas, q]);

  // Toggle assegnazione
  async function toggleAssign(a: AreaRow) {
    if (!selectedClientId) return alert("Seleziona prima un cliente.");
    if (a.client_id && a.client_id !== selectedClientId) return; // non posso rubare

    const target = a.client_id === selectedClientId ? null : selectedClientId;
    const r = await fetch("/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service,
        city,
        area_slug: a.area_slug,
        client_id: target,
      }),
    });
    const j = (await r.json().catch(() => null)) as unknown;
    if (!r.ok) {
      alert(pickError(j) ?? "Operazione fallita");
      return;
    }
    loadAreas();
  }

  function areaClass(a: AreaRow) {
    const isMine = a.client_id === selectedClientId;
    const isTaken = !!a.client_id && a.client_id !== selectedClientId;

    if (isMine)
      return "border-emerald-500 bg-emerald-600/15 hover:bg-emerald-600/20 text-emerald-200";
    if (isTaken)
      return "border-rose-500 bg-rose-600/15 text-rose-200 cursor-not-allowed opacity-80";
    return "border-white/15 bg-white/5 hover:bg-white/10";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Assegnazioni</h1>
        <button
          onClick={loadAreas}
          className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-500"
        >
          Ricarica
        </button>
      </div>

      {/* --- FILTRI --- */}
      <Card className="bg-white/5">
        <CardHeader>
          <CardTitle>Filtri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm text-neutral-300">Servizio</label>
              <CustomSelect
                value={service}
                onChange={(v: string) =>
                  setService(v as (typeof SERVICES)[number])
                }
                options={SERVICES.map((s) => ({ value: s, label: s }))}
                placeholder="— scegli servizio —"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Cliente</label>
              <CustomSelect
                value={selectedClientId}
                onChange={(v: string) => setSelectedClientId(v)}
                options={clients.map((c) => ({
                  value: c.id,
                  label: c.company_name || c.name,
                }))}
                placeholder="— scegli cliente —"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Cerca zona…</label>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digita nome zona"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- RIEPILOGO ASSEGNAZIONI --- */}
      <AssignedZonesBar
        service={service}
        clientId={selectedClientId || null}
        onChanged={loadAreas}
      />

      {/* --- LISTA ZONE --- */}
      <Card className="bg-white/5">
        <CardHeader>
          <CardTitle>Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filteredAreas.map((a) => {
              const isTaken =
                !!a.client_id && a.client_id !== selectedClientId;
              return (
                <div
                  key={a.area_slug}
                  onClick={() => {
                    if (!isTaken) toggleAssign(a);
                  }}
                  className={`cursor-pointer rounded-xl border p-3 transition ${areaClass(
                    a
                  )}`}
                >
                  <div className="font-medium">
                    {a.area_label || a.area_slug}
                  </div>
                  <div className="text-xs opacity-80">
                    {a.client_id
                      ? a.client_id === selectedClientId
                        ? "Assegnata a questo cliente"
                        : `Occupata da ${a.client_name || "altro"}`
                      : "Libera — click per assegnare"}
                  </div>
                </div>
              );
            })}
          </div>
          {err && <div className="pt-2 text-xs text-red-400">⚠️ {err}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
