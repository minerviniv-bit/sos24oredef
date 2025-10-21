// src/app/(admin)/admin/clients/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Client = {
  id?: string;
  name: string;
  company_name?: string;
  vat_id?: string;
  tax_code?: string;
  sdi_code?: string;
  pec_email?: string;
  billing_email?: string;
  billing_address?: string;
  phone?: string;
  bank_name?: string;
  iban?: string;
  signer_name?: string;
  logo_url?: string;
  description?: string;
  active?: boolean;
  whatsapp?: string;
  email?: string;
  website?: string;
  rating?: number;
  anni_attivita?: number;
};

type AreaRow = {
  area_slug: string;
  area_label?: string;
  client_id?: string | null;
  client_name?: string | null;
};

type ClientsResp = { data: Client[] };
type AreasResp = { data: AreaRow[] };

// ---- helpers per evitare `any`
function extractError(x: unknown): string | undefined {
  if (x && typeof x === "object" && "error" in x) {
    const v = (x as { error?: unknown }).error;
    if (typeof v === "string") return v;
  }
  return undefined;
}
function getNumberField(x: unknown, key: string): number | undefined {
  if (x && typeof x === "object" && key in x) {
    const v = (x as Record<string, unknown>)[key];
    if (typeof v === "number") return v;
  }
  return undefined;
}
function getStringField(x: unknown, key: string): string | undefined {
  if (x && typeof x === "object" && key in x) {
    const v = (x as Record<string, unknown>)[key];
    if (typeof v === "string") return v;
  }
  return undefined;
}

function isClientsResp(x: unknown): x is ClientsResp {
  return typeof x === "object" && x !== null && "data" in x && Array.isArray((x as ClientsResp).data);
}
function isAreasResp(x: unknown): x is AreasResp {
  return typeof x === "object" && x !== null && "data" in x && Array.isArray((x as AreasResp).data);
}

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

export default function ClientsPage() {
  const [client, setClient] = useState<Client>({ name: "", description: "", active: true });
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [errClients, setErrClients] = useState<string | null>(null);
  const [errAreas, setErrAreas] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [service, setService] = useState<(typeof SERVICES)[number]>("idraulico");
  const [city, setCity] = useState("roma");
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [q, setQ] = useState("");

  const loadClients = useCallback(async () => {
    setErrClients(null);
    try {
      const r = await fetch("/api/admin/clients", { cache: "no-store" });
      const j = (await r.json().catch(() => null)) as unknown;

      if (!r.ok) {
        setClients([]);
        setErrClients(extractError(j) || "Errore caricamento clienti");
        return;
      }

      const arr = isClientsResp(j) ? j.data : Array.isArray(j) ? (j as Client[]) : [];
      setClients(arr);

      if (selectedId) {
        const found = arr.find((c) => c.id === selectedId);
        if (found) setClient(found);
      }
    } catch {
      setClients([]);
      setErrClients("Errore rete /clients");
    }
  }, [selectedId]);

  const loadAreas = useCallback(async () => {
    setErrAreas(null);
    try {
      const r = await fetch(`/api/public/assignments?service=${service}&city=${city}`, {
        cache: "no-store",
      });
      const j = (await r.json().catch(() => null)) as unknown;

      if (!r.ok) {
        setAreas([]);
        setErrAreas(extractError(j) || "Errore caricamento aree");
        return;
      }

      const arr = isAreasResp(j) ? j.data : Array.isArray(j) ? (j as AreaRow[]) : [];
      setAreas(arr);
    } catch {
      setAreas([]);
      setErrAreas("Errore rete /assignments");
    }
  }, [service, city]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  function newClient() {
    setSelectedId("");
    setClient({ name: "", description: "", active: true });
    setLogoFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onSelectClient(id: string) {
    setSelectedId(id);
    const c = clients.find((x) => x.id === id);
    if (c) {
      setClient(c);
      setLogoFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function persistLogoUrl(id: string, url: string) {
    const r2 = await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client: { ...client, id, logo_url: url } }),
    });
    const j2 = (await r2.json().catch(() => null)) as unknown;
    if (!r2.ok) {
      throw new Error(extractError(j2) || "Errore aggiornamento logo_url");
    }
    return (isClientsResp(j2) ? j2.data?.[0] : (j2 as Client)) as Client;
  }

  async function saveClient() {
    if (!client.name) return alert("Inserisci il nome del cliente.");
    if ((client.description || "").length > 800) return alert("Scheda > 800 battute.");

    setSaving(true);
    try {
      const method = client.id ? "PUT" : "POST";
      const r = await fetch("/api/admin/clients", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client }),
      });
      const j = (await r.json().catch(() => null)) as unknown;
      if (!r.ok) {
        throw new Error(extractError(j) || "Errore salvataggio");
      }

      let saved = (isClientsResp(j) ? j.data?.[0] : (j as Client)) as Client;

      if (logoFile && saved?.id) {
        const fd = new FormData();
        fd.append("file", logoFile);
        fd.append("client_id", saved.id);
        const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const uj = (await up.json().catch(() => null)) as unknown;
        if (!up.ok) {
          throw new Error(extractError(uj) || "Upload logo fallito");
        }
        const url = getStringField(uj, "url");
        if (url) saved = await persistLogoUrl(saved.id!, url);
      }

      await loadClients();
      if (saved?.id) {
        setSelectedId(saved.id);
        setClient(saved);
      }
      alert(client.id ? "Cliente aggiornato." : "Cliente creato.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient() {
    if (!client.id) return;

    let r = await fetch(`/api/admin/clients?id=${encodeURIComponent(client.id)}`, {
      method: "DELETE",
    });

    if (r.status === 409) {
      const j = (await r.json().catch(() => null)) as unknown;
      const n = getNumberField(j, "count") ?? 0;

      const ok = window.confirm(
        `Attenzione: questo cliente ha ${n} zone assegnate.\n` +
          `Vuoi eliminarlo comunque? Le zone verranno disassegnate automaticamente.`
      );
      if (!ok) return;

      r = await fetch(`/api/admin/clients?id=${encodeURIComponent(client.id)}&force=1`, {
        method: "DELETE",
      });
    }

    const j = (await r.json().catch(() => null)) as unknown;
    if (!r.ok) {
      alert(extractError(j) || "Eliminazione fallita");
      return;
    }

    newClient();
    await loadClients();
    alert("Cliente eliminato.");
  }

  const filteredAreas = useMemo(() => {
    const qq = q.toLowerCase();
    return areas.filter((a) => (a.area_label || a.area_slug).toLowerCase().includes(qq));
  }, [areas, q]);

  async function toggleAssign(a: AreaRow) {
    if (!client.id) return alert("Salva prima il cliente.");
    if (a.client_id && a.client_id !== client.id) return;
    const target = a.client_id === client.id ? null : client.id;
    const r = await fetch("/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, city, area_slug: a.area_slug, client_id: target }),
    });
    const j = (await r.json().catch(() => null)) as unknown;
    if (!r.ok) {
      alert(extractError(j) || "Operazione fallita");
      return;
    }
    loadAreas();
  }

  function areaClass(a: AreaRow) {
    const isMine = a.client_id === client.id;
    const isTaken = !!a.client_id && a.client_id !== client.id;
    if (isMine) return "border-emerald-500 bg-emerald-600/15 hover:bg-emerald-600/20 text-emerald-200";
    if (isTaken) return "border-rose-500 bg-rose-600/15 text-rose-200 cursor-not-allowed opacity-80";
    return "border-white/15 bg-white/5 hover:bg-white/10";
  }

  const isEdit = Boolean(client.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Clienti</h1>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              isEdit ? "bg-amber-500/20 text-amber-300" : "bg-sky-500/20 text-sky-300"
            }`}
          >
            {isEdit ? "Modifica" : "Crea"}
          </span>
        </div>
        <Button onClick={newClient}>+ Nuovo cliente</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5">
          <CardHeader>
            <CardTitle>{isEdit ? "Modifica Cliente" : "Nuovo Cliente"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Ragione sociale"
              value={client.company_name || ""}
              onChange={(e) => setClient({ ...client, company_name: e.target.value })}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Nome commerciale"
                value={client.name || ""}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
              />
              <Input
                placeholder="Telefono"
                value={client.phone || ""}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                placeholder="P.IVA"
                value={client.vat_id || ""}
                onChange={(e) => setClient({ ...client, vat_id: e.target.value })}
              />
              <Input
                placeholder="CF"
                value={client.tax_code || ""}
                onChange={(e) => setClient({ ...client, tax_code: e.target.value })}
              />
              <Input
                placeholder="Codice SDI"
                value={client.sdi_code || ""}
                onChange={(e) => setClient({ ...client, sdi_code: e.target.value })}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="PEC"
                value={client.pec_email || ""}
                onChange={(e) => setClient({ ...client, pec_email: e.target.value })}
              />
              <Input
                placeholder="Email fatturazione"
                value={client.billing_email || ""}
                onChange={(e) => setClient({ ...client, billing_email: e.target.value })}
              />
            </div>
            <Input
              placeholder="Indirizzo fatturazione"
              value={client.billing_address || ""}
              onChange={(e) => setClient({ ...client, billing_address: e.target.value })}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Banca (intestatario IBAN)"
                value={client.bank_name || ""}
                onChange={(e) => setClient({ ...client, bank_name: e.target.value })}
              />
              <Input
                placeholder="IBAN"
                value={client.iban || ""}
                onChange={(e) => setClient({ ...client, iban: e.target.value })}
              />
            </div>
            <Input
              placeholder="Sottoscrittore contratto"
              value={client.signer_name || ""}
              onChange={(e) => setClient({ ...client, signer_name: e.target.value })}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              <Input placeholder="logo_url (pubblico)" value={client.logo_url || ""} readOnly />
            </div>
            {client.logo_url && (
              <div className="h-16 w-16 rounded bg-white p-1">
                <Image
                  src={client.logo_url}
                  alt="logo"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}
            <div className="text-sm text-neutral-400">Scheda azienda (max 800 battute)</div>
            <Textarea
              rows={6}
              value={client.description || ""}
              onChange={(e) =>
                setClient({ ...client, description: e.target.value.slice(0, 800) })
              }
            />
            <div className="text-right text-xs text-neutral-400">
              {(client.description || "").length}/800
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={client.active ?? true}
                onChange={(e) => setClient({ ...client, active: e.target.checked })}
              />
              Attivo
            </label>
            <div className="flex gap-3 pt-2">
              <Button disabled={saving} onClick={saveClient}>
                {isEdit ? "Salva modifiche" : "Crea cliente"}
              </Button>
              {isEdit && (
                <Button variant="destructive" onClick={deleteClient}>
                  Elimina cliente
                </Button>
              )}
            </div>
            {errClients ? (
              <div className="pt-2 text-xs text-red-400">
                {"\u26A0\uFE0F"} {errClients}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-white/5">
          <CardHeader>
            <CardTitle>Assegnazioni zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-neutral-300">Seleziona cliente esistente</label>
              <Select value={selectedId} onValueChange={(v) => onSelectClient(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="— scegli —" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id || `c-${c.name}`} value={c.id || ""}>
                      {c.company_name || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-sm text-neutral-300">Servizio</label>
                <Select value={service} onValueChange={(v) => setService(v as typeof service)}>
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

              <div className="space-y-1">
                <label className="text-sm text-neutral-300">Città</label>
                <Select value={city} onValueChange={(v) => setCity(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona città" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roma">Roma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca zona…" />
            </div>

            <div className="flex flex-wrap gap-2">
              {areas
                .filter((a) => a.client_id === client.id)
                .map((a) => (
                  <span
                    key={a.area_slug}
                    className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300"
                  >
                    {a.area_label || a.area_slug}
                  </span>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {filteredAreas.map((a) => {
                const isTaken = !!a.client_id && a.client_id !== client.id;
                return (
                  <div
                    key={a.area_slug}
                    onClick={() => {
                      if (!isTaken) toggleAssign(a);
                    }}
                    aria-disabled={isTaken}
                    className={`cursor-pointer rounded-xl border p-3 transition ${areaClass(a)}`}
                  >
                    <div className="font-medium">{a.area_label || a.area_slug}</div>
                    <div className="text-xs opacity-80">
                      {a.client_id
                        ? a.client_id === client.id
                          ? "Assegnata a questo cliente"
                          : `Occupata da ${a.client_name || "altro"}`
                        : "Libera — click per assegnare"}
                    </div>
                  </div>
                );
              })}
            </div>

            {errAreas && <div className="pt-2 text-xs text-red-400">⚠️ {errAreas}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

