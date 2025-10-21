"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  clientId?: string;                 // id del cliente (uuid) per path su storage
  logoUrl?: string | null;           // valore attuale salvato nel form (form.logo_url)
  onChange: (publicUrl: string) => void; // callback: aggiorna form.logo_url
};

type UploadResp = { ok?: boolean; url?: string; error?: string };

export default function LogoField({ clientId, logoUrl, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // mostra anteprima dal valore già salvato (quando carichi/modifichi un cliente)
  useEffect(() => {
    if (logoUrl && !preview) setPreview(logoUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoUrl]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);

    // 0) se manca l'ID cliente, blocchiamo: l'endpoint richiede client_id (uuid)
    if (!clientId) {
      setError("Salva prima il cliente per ottenere un ID (client_id).");
      // ripristino input file
      e.currentTarget.value = "";
      return;
    }

    // 1) anteprima immediata
    const objUrl = URL.createObjectURL(f);
    setPreview(objUrl);

    // 2) upload
    try {
      setUploading(true);

      // controlli lato client (coerenti con la route)
      const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
      if (!allowed.includes(f.type)) throw new Error("Formato non supportato");
      if (f.size > 2 * 1024 * 1024) throw new Error("File troppo grande (max 2MB)");

      const fd = new FormData();
      // /api/admin/upload si aspetta "file" e "client_id"
      fd.append("file", f);
      fd.append("client_id", clientId);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

      let json: UploadResp = {};
      try {
        json = (await res.json()) as UploadResp;
      } catch {
        json = {};
      }
      if (!res.ok || !json.url) {
        throw new Error(json.error || "Upload fallito");
      }

      // 3) aggiorna form + usa subito l'URL pubblico come preview definitiva
      onChange(json.url);
      setPreview(json.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Errore upload";
      setError(msg);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objUrl);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-neutral-300">Logo</label>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={onFileChange}
          className="block cursor-pointer"
        />
        {uploading && <span className="text-sm text-yellow-400">Caricamento…</span>}
        {error && <span className="text-sm text-red-400">Errore: {error}</span>}
      </div>

      {/* PREVIEW */}
      {preview ? (
        <div className="mt-2 h-20 w-auto rounded-md ring-1 ring-white/10 bg-black/30 p-2 relative">
          <Image
            src={preview}
            alt="Anteprima logo"
            fill
            style={{ objectFit: "contain" }}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mt-2 h-20 w-32 rounded-md ring-1 ring-white/10 bg-black/20 grid place-items-center text-xs text-neutral-400">
          Nessun logo
        </div>
      )}

      {/* URL debug/lettura */}
      {logoUrl ? (
        <div className="text-[11px] text-neutral-400 break-all mt-1">{logoUrl}</div>
      ) : null}
    </div>
  );
}

