"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

/* =========================
   Tipi utili e helpers
========================= */

type Service =
  | "idraulico"
  | "fabbro"
  | "elettricista"
  | "spurgo"
  | "caldaie"
  | "disinfestazioni"
  | "vetraio"
  | "assistenza-stradale";

type ClientLite = { id: string; name: string };
type ZoneRow = { area_slug: string; area_label?: string };
type ModelKey = "gpt-4o" | "gpt-4o-mini";

type JsonObj = Record<string, unknown>;

type GeneratedSEO = {
  title?: string;
  meta_description?: string;
  h1?: string;
  body_html?: string;
  faqs?: Array<{ q: string; a: string }>;
  json_ld?: JsonObj;
};

type GeneratedItem = {
  key?: string;
  scope: "area" | "city";
  service: string;
  city: string;
  area_slug?: string;
  model_used?: string;
  client_id?: string;
  client_name?: string;
  seo?: GeneratedSEO;
};

/** Risposte API — tipizzate e flessibili */
type ClientsApi =
  | { items: ClientLite[]; error?: string }
  | { data: Array<{ id: string; name: string }>; error?: string }
  | { error: string };

type ZonesApi = { items?: ZoneRow[]; error?: string };

type LoadSeoPayload = {
  scope: "area" | "city";
  service: string;
  city: string;
  area_slug?: string;
  client_id?: string;
};

type SavedSeoRow = {
  status?: "draft" | "published";
  scope?: "area" | "city";
  service?: string;
  city?: string;
  area_slug?: string;
  client_id?: string;
  model_used?: string;
  seo?: GeneratedSEO;
};

type LoadSeoApi = { data?: SavedSeoRow | null; error?: string };

type GenerateApi =
  | { items?: GeneratedItem[]; item?: GeneratedItem; error?: string }
  | { error: string };

type SaveDraftApi = { ok?: boolean; error?: string };
type PublishApi = { ok?: boolean; error?: string };

/** Converte errore in stringa */
function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return String(e);
  } catch {
    return "Errore sconosciuto";
  }
}

/** Prova a leggere JSON; se fallisce ritorna null */
async function readJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* =========================
   Costanti UI
========================= */

const SERVICES: Service[] = [
  "idraulico",
  "fabbro",
  "elettricista",
  "spurgo",
  "caldaie",
  "disinfestazioni",
  "vetraio",
  "assistenza-stradale",
];

const MODELS: { key: ModelKey; label: string }[] = [
  { key: "gpt-4o", label: "GPT-4o (città)" },
  { key: "gpt-4o-mini", label: "GPT-4o mini (quartieri)" },
];

/* =========================
   Pagina
========================= */

export default function Page() {
  // ===== UI state =====
  const [service, setService] = useState<Service>("idraulico");
  const [city, setCity] = useState<string>("roma");

  const [clients, setClients] = useState<ClientLite[]>([]);
  const [client, setClient] = useState<ClientLite | null>(null);

  const [zones, setZones] = useState<ZoneRow[]>([]);
  const [activeZone, setActiveZone] = useState<ZoneRow | null>(null);

  const [model, setModel] = useState<ModelKey>("gpt-4o-mini");
  const [asHtml, setAsHtml] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [log, setLog] = useState<string>("");

  const [output, setOutput] = useState<string>("");
  const [lastGenerated, setLastGenerated] = useState<GeneratedItem | null>(null);
  const [savedStatus, setSavedStatus] = useState<"draft" | "published" | null>(null);

  const selectedZoneLabel = useMemo(
    () => activeZone?.area_label || activeZone?.area_slug || "Nessuna zona",
    [activeZone]
  );

  // ===== loaders =====
  const fetchClients = useCallback(async () => {
    setErr(null);
    setLog("");
    try {
      const url = `/api/admin/by-client/list?service=${encodeURIComponent(
        service
      )}&city=${encodeURIComponent(city)}`;
      let res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        res = await fetch(`/api/admin/clients`, { cache: "no-store" });
      }

      const j = await readJsonSafe<ClientsApi>(res);
      if (!res.ok) {
        const msg = (j && "error" in j && j.error) || "Impossibile caricare clienti";
        throw new Error(msg);
      }

      let items: ClientLite[] = [];
      if (j) {
        if ("items" in j && Array.isArray(j.items)) {
          items = j.items;
        } else if ("data" in j && Array.isArray(j.data)) {
          items = j.data.map((c) => ({ id: c.id, name: c.name }));
        }
      }
      setClients(items);

      if (client && !items.some((c) => c.id === client.id)) {
        setClient(null);
        setZones([]);
        setActiveZone(null);
        setLastGenerated(null);
        setOutput("");
        setLog("");
        setSavedStatus(null);
      }
    } catch (e: unknown) {
      setClients([]);
      setErr(errorMessage(e) || "Errore caricamento clienti");
    }
  }, [service, city, client]);

  const fetchZones = useCallback(async () => {
    setErr(null);
    setLog("");
    setZones([]);
    setActiveZone(null);
    setSavedStatus(null);
    if (!client?.id) return;

    try {
      const url = `/api/admin/assign/zones?service=${encodeURIComponent(
        service
      )}&city=${encodeURIComponent(city)}&client_id=${encodeURIComponent(
        client.id
      )}&only_assigned=true`;
      const res = await fetch(url, { cache: "no-store" });
      const j = await readJsonSafe<ZonesApi>(res);

      if (!res.ok) {
        const msg = (j && j.error) || "Errore caricamento zone";
        throw new Error(msg);
      }

      const items = (j?.items ?? []) as ZoneRow[];
      setZones(items);
      if (items.length > 0) setActiveZone(items[0]);
    } catch (e: unknown) {
      setZones([]);
      setErr(errorMessage(e) || "Errore caricamento zone");
    }
  }, [service, city, client]);

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    void fetchZones();
  }, [fetchZones]);

  // ===== carica contenuto salvato (bozza o pubblicato) quando cambi cliente/area =====
  const fetchSavedSeo = useCallback(async () => {
    if (!client?.id || !activeZone?.area_slug) {
      setLastGenerated(null);
      setOutput("");
      setSavedStatus(null);
      return;
    }
    try {
      setErr(null);
      setLog("Carico contenuto salvato…");

      const payload: LoadSeoPayload = {
        scope: "area",
        service: String(service).toLowerCase(),
        city: String(city).toLowerCase(),
        area_slug: activeZone.area_slug,
        client_id: client.id,
      };

      const r = await fetch("/api/admin/seo/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await readJsonSafe<LoadSeoApi>(r);
      if (!r.ok) {
        const msg = (j && j.error) || "Errore caricamento contenuto salvato";
        throw new Error(msg);
      }

      const saved = j?.data || null;
      if (!saved) {
        setSavedStatus(null);
        setLastGenerated(null);
        setOutput("");
        setLog("Nessun contenuto salvato per questa combinazione.");
        return;
      }

      setSavedStatus(saved.status ?? null);

      const item: GeneratedItem = {
        scope: saved.scope ?? "area",
        service: saved.service ?? String(service).toLowerCase(),
        city: saved.city ?? String(city).toLowerCase(),
        area_slug: saved.area_slug ?? activeZone.area_slug,
        client_id: saved.client_id ?? client.id,
        client_name: client.name,
        model_used: saved.model_used,
        seo: saved.seo ?? undefined,
      };

      setLastGenerated(item);

      const html = item.seo?.body_html || "";
      const json = JSON.stringify({ item }, null, 2);
      setOutput(asHtml ? (html || "(vuoto)") : json);
      setLog("Contenuto salvato caricato.");
    } catch (e: unknown) {
      setErr(errorMessage(e) || "Errore nel caricamento contenuto salvato");
      setOutput("");
      setSavedStatus(null);
    }
  }, [client?.id, client?.name, activeZone?.area_slug, service, city, asHtml]);

  useEffect(() => {
    void fetchSavedSeo();
  }, [fetchSavedSeo]);

  // ===== actions =====
  async function onGenerate() {
    if (!client?.id) {
      alert("Seleziona un cliente.");
      return;
    }
    if (!activeZone?.area_slug) {
      alert("Seleziona una zona.");
      return;
    }

    // ---- PRE-CHECK: avvisa se esiste già qualcosa salvato
    if (savedStatus === "published") {
      const ok = confirm(
        "Attenzione: esiste già un SEO PUBBLICATO per questa combinazione.\n" +
          "La nuova generazione potrebbe sostituire il contenuto precedente nelle fasi di salvataggio/pubblicazione.\n" +
          "Vuoi continuare?"
      );
      if (!ok) return;
    } else if (savedStatus === "draft") {
      const ok = confirm(
        "Esiste già una BOZZA salvata per questa combinazione.\n" +
          "Vuoi rigenerare il contenuto e sovrascrivere la bozza?"
      );
      if (!ok) return;
    }

    setBusy(true);
    setErr(null);
    setLog("Genero…");
    setOutput("");
    setLastGenerated(null);

    try {
      const payload = {
        type: "area" as const,
        service: String(service).toLowerCase(),
        city: String(city).toLowerCase(),
        areas: [activeZone.area_slug],
        model,
        client_id: client.id,
        client_name: client.name,
      };

      const res = await fetch("/api/admin/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await readJsonSafe<GenerateApi>(res);
      if (!res.ok) {
        const msg = (j && "error" in j && j.error) || "Generazione fallita";
        throw new Error(msg);
      }

      const item = (j && "items" in j && j.items?.[0]) || (j && "item" in j && j.item) || null;
      if (!item || !item.seo) throw new Error("Output vuoto");

      setLastGenerated(item);
      const out = asHtml ? item.seo.body_html || "" : JSON.stringify(j, null, 2);
      setOutput(out || "(vuoto)");
      setLog("Generazione completata.");
    } catch (e: unknown) {
      setErr(errorMessage(e) || "Errore generazione");
    } finally {
      setBusy(false);
    }
  }

  async function onSaveDraft() {
    if (!client?.id) {
      alert("Seleziona un cliente.");
      return;
    }
    if (!activeZone?.area_slug) {
      alert("Seleziona una zona.");
      return;
    }
    if (!lastGenerated?.seo) {
      alert("Genera prima il contenuto (JSON).");
      return;
    }

    setBusy(true);
    setErr(null);
    setLog("Salvo bozza…");

    try {
      const body = {
        items: [
          {
            scope: "area" as const,
            service: String(service).toLowerCase(),
            city: String(city).toLowerCase(),
            area_slug: activeZone.area_slug,
            client_id: client.id,
            model_used: lastGenerated.model_used || model,
            seo: lastGenerated.seo,
          },
        ],
      };

      const r = await fetch("/api/admin/seo/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const j = await readJsonSafe<SaveDraftApi>(r);
      if (!r.ok) {
        const msg = (j && j.error) || "Salvataggio bozza fallito";
        throw new Error(msg);
      }

      setLog("Bozza salvata.");
      await fetchSavedSeo(); // riallinea
      alert("Bozza salvata.");
    } catch (e: unknown) {
      setErr(errorMessage(e) || "Errore salvataggio bozza");
    } finally {
      setBusy(false);
    }
  }

  async function onPublish() {
    if (!client?.id) {
      alert("Seleziona un cliente.");
      return;
    }
    if (!activeZone?.area_slug) {
      alert("Seleziona una zona.");
      return;
    }

    setBusy(true);
    setErr(null);
    setLog("Pubblico…");

    try {
      const body = {
        items: [
          {
            scope: "area" as const,
            service: String(service).toLowerCase(),
            city: String(city).toLowerCase(),
            area_slug: activeZone.area_slug,
            client_id: client.id,
          },
        ],
      };

      const r = await fetch("/api/admin/seo/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const j = await readJsonSafe<PublishApi>(r);
      if (!r.ok) {
        const msg = (j && j.error) || "Pubblicazione fallita";
        throw new Error(msg);
      }

      setLog("Pubblicato!");
      await fetchSavedSeo(); // mostra lo stato pubblicato
      alert("Pubblicato!");
    } catch (e: unknown) {
      setErr(errorMessage(e) || "Errore pubblicazione");
    } finally {
      setBusy(false);
    }
  }

  // ===== UI =====
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">SEO · Generatore contenuti</h1>

      <Card className="bg-white/5">
        <CardHeader>
          <CardTitle>Parametri</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* riga: servizio / città / cliente */}
          <div className="grid gap-3 md:grid-cols-3">
            {/* Servizio */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-300">Servizio</div>
              <Select
                value={service}
                onValueChange={(v) => {
                  setService(v as Service);
                  setClient(null);
                  setZones([]);
                  setActiveZone(null);
                  setLastGenerated(null);
                  setOutput("");
                  setLog("");
                  setSavedStatus(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona servizio" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Città */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-300">Città</div>
              <Select
                value={city}
                onValueChange={(v) => {
                  setCity(v);
                  setClient(null);
                  setZones([]);
                  setActiveZone(null);
                  setLastGenerated(null);
                  setOutput("");
                  setLog("");
                  setSavedStatus(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona città" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roma">Roma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cliente */}
            <div className="space-y-1">
              <div className="text-sm text-neutral-300">Cliente</div>
              <Select
                value={client?.id ?? ""}
                onValueChange={(id) => {
                  const found = clients.find((c) => c.id === id) || null;
                  setClient(found);
                  setZones([]);
                  setActiveZone(null);
                  setLastGenerated(null);
                  setOutput("");
                  setLog("");
                  setSavedStatus(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="cerca cliente…" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 && (
                    <div className="px-3 py-2 text-sm text-neutral-400">
                      Nessun cliente
                    </div>
                  )}
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* zone assegnate */}
          <div className="space-y-2">
            <div className="text-sm text-neutral-300">Zone assegnate su Roma:</div>
            <div className="min-h-[40px] rounded-xl border border-white/10 p-2">
              {client?.id ? (
                zones.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {zones.map((z) => {
                      const isActive = z.area_slug === activeZone?.area_slug;
                      return (
                        <button
                          key={z.area_slug}
                          onClick={() => {
                            setActiveZone(z);
                            setLastGenerated(null);
                            setOutput("");
                            setLog("");
                            // savedStatus verrà aggiornato da fetchSavedSeo
                          }}
                          className={`rounded-full px-3 py-1 text-sm border transition ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                              : "bg-white/5 border-white/15 hover:bg-white/10"
                          }`}
                        >
                          {z.area_label || z.area_slug}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-400">
                    Nessuna zona. Vai in “Assegnazioni” per collegare aree al cliente.
                  </div>
                )
              ) : (
                <div className="text-sm text-neutral-400">Seleziona un cliente.</div>
              )}
            </div>
          </div>

          {/* modello + azioni */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={model} onValueChange={(v) => setModel(v as ModelKey)}>
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Seleziona modello" />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.key} value={m.key}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button disabled={busy || !client?.id || !activeZone} onClick={onGenerate}>
                Genera (stream)
              </Button>

              <Button
                variant="secondary"
                disabled={busy || !client?.id || !activeZone || !lastGenerated?.seo}
                onClick={onSaveDraft}
                title={!lastGenerated?.seo ? "Genera prima il contenuto" : "Salva bozza"}
              >
                Salva bozza
              </Button>

              <Button variant="default" disabled={busy || !client?.id || !activeZone} onClick={onPublish}>
                Pubblica
              </Button>

              <div className="ml-2 flex items-center gap-2 text-sm">
                <span className={!asHtml ? "font-semibold" : ""}>JSON</span>
                <Switch checked={asHtml} onCheckedChange={(v) => setAsHtml(v)} />
                <span className={asHtml ? "font-semibold" : ""}>HTML</span>
              </div>
            </div>

            <div className="text-sm text-neutral-400">
              Zona selezionata: <span className="text-neutral-200">{selectedZoneLabel}</span>
            </div>
          </div>

          {/* output */}
          <div className="mt-2">
            <div className="rounded-xl border border-white/10 bg-black/30">
              <textarea
                readOnly
                value={output || "Genera per vedere il contenuto…"}
                className="h[320px] h-[320px] w-full resize-none rounded-xl bg-transparent p-4 font-mono text-sm outline-none"
              />
            </div>
          </div>

          {(err || log) && (
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${
                err
                  ? "border-rose-600/40 bg-rose-600/10 text-rose-200"
                  : "border-emerald-600/40 bg-emerald-600/10 text-emerald-200"
              }`}
            >
              {err || log}
            </div>
          )}

          <div className="text-xs text-neutral-500">
            Dopo la pubblicazione, verifica che il testo compaia nella sezione “Scheda Azienda”.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
