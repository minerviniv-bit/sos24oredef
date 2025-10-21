// src/app/(admin)/admin/administration/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calcTotals } from "@/lib/billing/calc";
import { InvoicePreview } from "@/components/admin/InvoicePreview";

type ClientLite = { id: string; name: string; company_name?: string };
type Kind = "zones" | "calls";

const SERVICES_STYLE_TRIGGER = "custom-select-trigger";
const SERVICES_STYLE_CONTENT = "";

const eur = (n: number) =>
  n.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

// helper per leggere numeri dagli <input type="number">
function num(v: string, fallback = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}

type InvoicePreviewData = Record<string, unknown>;

/** ---- Type guards per JSON ---- */
function isClientLiteArray(x: unknown): x is ClientLite[] {
  return (
    Array.isArray(x) &&
    x.every(
      (i) =>
        i !== null &&
        typeof i === "object" &&
        "id" in i &&
        "name" in i &&
        typeof (i as { id: unknown }).id === "string" &&
        typeof (i as { name: unknown }).name === "string"
    )
  );
}
function isClientsPayload(x: unknown): x is { data: ClientLite[] } {
  if (x === null || typeof x !== "object") return false;
  if (!("data" in x)) return false;
  const d = (x as { data?: unknown }).data;
  return isClientLiteArray(d);
}
function pickErrorMessage(x: unknown): string | undefined {
  if (x && typeof x === "object" && "error" in x) {
    const v = (x as Record<string, unknown>).error;
    if (typeof v === "string") return v;
  }
  return undefined;
}
function pickPreview(x: unknown): InvoicePreviewData | null {
  if (x && typeof x === "object" && "preview" in x) {
    const v = (x as Record<string, unknown>).preview;
    if (v && typeof v === "object") return v as InvoicePreviewData;
  }
  return null;
}

export default function AdministrationPage() {
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [clientId, setClientId] = useState<string>("");

  const [kind, setKind] = useState<Kind>("zones");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(298);
  const [vat, setVat] = useState<number>(22);
  const [discount, setDiscount] = useState<number>(0);
  const [installments, setInstallments] = useState<number>(1);
  const [dueDays, setDueDays] = useState<number>(30);
  const [notes, setNotes] = useState<string>("");

  const [preview, setPreview] = useState<InvoicePreviewData | null>(null);

  const totals = useMemo(
    () =>
      calcTotals({
        quantity,
        unit_price: unitPrice,
        vat_percent: vat,
        discount_percent: discount,
        installments,
      }),
    [quantity, unitPrice, vat, discount, installments]
  );

  async function loadClients() {
    try {
      const r = await fetch("/api/admin/clients?lite=1", { cache: "no-store" });
      const d = (await r.json().catch(() => null)) as unknown;

      const arr: ClientLite[] = isClientsPayload(d)
        ? d.data
        : isClientLiteArray(d)
        ? d
        : [];

      setClients(arr);
      if (arr[0]?.id && !clientId) setClientId(arr[0].id);
    } catch {
      setClients([]);
    }
  }

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveOrder() {
    if (!clientId) return alert("Seleziona un cliente");
    const r = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        kind,
        quantity,
        unit_price: unitPrice,
        vat_percent: vat,
        discount_percent: discount,
        installments,
        due_days: dueDays,
        notes,
      }),
    });
    const j = (await r.json().catch(() => null)) as unknown;
    if (!r.ok) return alert(pickErrorMessage(j) ?? "Salvataggio fallito");
    alert("Impostazioni salvate.");
  }

  async function previewInvoice() {
    if (!clientId) return alert("Seleziona un cliente");
    const r = await fetch("/api/admin/orders/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        kind,
        quantity,
        unit_price: unitPrice,
        vat_percent: vat,
        discount_percent: discount,
        installments,
        due_days: dueDays,
        notes,
      }),
    });
    const j = (await r.json().catch(() => null)) as unknown;
    if (!r.ok) return alert(pickErrorMessage(j) ?? "Preview fallita");
    setPreview(pickPreview(j));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Amministrazione</h1>

      <Card className="bg-white/5">
        <CardHeader>
          <CardTitle>Pacchetti & anteprima fattura</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selezione cliente + tipo pacchetto */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="mb-1 text-xs text-neutral-400">Cliente</div>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className={SERVICES_STYLE_TRIGGER}>
                  <SelectValue placeholder="Seleziona cliente" />
                </SelectTrigger>
                <SelectContent className={SERVICES_STYLE_CONTENT}>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company_name || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="mb-1 text-xs text-neutral-400">Tipo pacchetto</div>
              <Select value={kind} onValueChange={(v) => setKind(v as Kind)}>
                <SelectTrigger className={SERVICES_STYLE_TRIGGER}>
                  <SelectValue placeholder="Tipo pacchetto" />
                </SelectTrigger>
                <SelectContent className={SERVICES_STYLE_CONTENT}>
                  <SelectItem value="zones">Zone</SelectItem>
                  <SelectItem value="calls">Telefonate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Parametri */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            <div>
              <div className="mb-1 text-xs text-neutral-400">
                Quantità ({kind === "zones" ? "zone" : "telefonate"})
              </div>
              <Input
                type="number"
                inputMode="numeric"
                value={String(quantity)}
                onChange={(e) => setQuantity(num(e.target.value, 0))}
              />
            </div>

            <div>
              <div className="mb-1 text-xs text-neutral-400">Prezzo unitario (€)</div>
              <Input
                type="number"
                inputMode="decimal"
                value={String(unitPrice)}
                onChange={(e) => setUnitPrice(num(e.target.value, 0))}
              />
            </div>

            <div>
              <div className="mb-1 text-xs text-neutral-400">IVA (%)</div>
              <Input
                type="number"
                inputMode="numeric"
                value={String(vat)}
                onChange={(e) => setVat(num(e.target.value, 0))}
              />
            </div>

            <div>
              <div className="mb-1 text-xs text-neutral-400">Sconto (%)</div>
              <Input
                type="number"
                inputMode="numeric"
                value={String(discount)}
                onChange={(e) => setDiscount(num(e.target.value, 0))}
              />
            </div>

            <div>
              <div className="mb-1 text-xs text-neutral-400">Rate (n°)</div>
              <Input
                type="number"
                inputMode="numeric"
                value={String(installments)}
                onChange={(e) => setInstallments(num(e.target.value, 1) || 1)}
              />
            </div>

            <div>
              <div className="mb-1 text-xs text-neutral-400">Scadenza (giorni)</div>
              <Input
                type="number"
                inputMode="numeric"
                value={String(dueDays)}
                onChange={(e) => setDueDays(num(e.target.value, 30) || 30)}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <div className="mb-1 text-xs text-neutral-400">Note (facoltative)</div>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note da includere in fattura / condizioni particolari…"
            />
          </div>

          {/* Totali live */}
          <div className="rounded-xl border border-white/10 p-4 text-sm">
            <div>
              Imponibile: <b>{eur(totals.imponibile)}</b>
            </div>
            {totals.sconto ? (
              <div>
                Sconto €: <b>{eur(totals.sconto)}</b>
              </div>
            ) : null}
            <div>
              IVA {vat}%: <b>{eur(totals.iva)}</b>
            </div>
            <div>
              Totale: <b>{eur(totals.totale)}</b>
            </div>
            {installments > 1 ? (
              <div>
                Rata ({installments}): <b>{eur(totals.rata)}</b>
              </div>
            ) : null}
          </div>

          {/* Azioni */}
          <div className="flex gap-3">
            <Button onClick={saveOrder}>Salva impostazioni</Button>
            <Button variant="secondary" onClick={previewInvoice}>
              Preview fattura
            </Button>
          </div>

          {/* Preview */}
          {preview && <InvoicePreview data={preview} />}

          <div className="text-xs text-neutral-400">
            Collegamenti a Fatture in Cloud e SSD: placeholder pronti (si agganceranno qui).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

