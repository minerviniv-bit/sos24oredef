"use client";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  onImagePicked?: (url: string) => void;
};

type UploadResp = { ok?: boolean; url?: string; error?: string };

export default function ChatInput({ onSend, onImagePicked }: Props) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [checked, setChecked] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const r = await fetch("/api/upload", { method: "POST", body: fd });

      let j: UploadResp = {};
      try {
        j = (await r.json()) as UploadResp;
      } catch {
        j = {};
      }

      if (!r.ok || !j?.url) throw new Error(j?.error || "Upload fallito");

      onImagePicked?.(j.url);
    } catch (err: unknown) {
      console.error("Upload errore:", err);
    } finally {
      setUploading(false);
      try {
        inputEl.value = "";
      } catch {
        /* noop */
      }
    }
  }

  function submit() {
    const t = text.trim();
    if (!t || uploading) return;
    if (!checked) {
      alert("Devi accettare l’informativa sulla privacy prima di continuare.");
      return;
    }
    onSend(t);
    setText("");
  }

  return (
    <div className="space-y-2">
      {/* Campo testo */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Scrivi qui (es. 'Perdita dal sifone a Prati, è urgente')"
          className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-3"
          disabled={uploading}
        />

        <label
          className={`inline-flex items-center rounded-2xl border border-zinc-700 px-3 text-sm cursor-pointer ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          title={uploading ? "Caricamento in corso..." : "Allega una foto"}
        >
          {uploading ? "Upload…" : "Allega foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            capture="environment"
            disabled={uploading}
          />
        </label>

        <button
          onClick={submit}
          disabled={uploading || !text.trim()}
          className="rounded-2xl border border-emerald-600/60 px-4 py-2 font-medium disabled:opacity-50"
        >
          Invia
        </button>
      </div>

      {/* Checkbox Privacy */}
      <label className="flex items-start gap-2 text-[12px] text-zinc-400 leading-snug">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-transparent accent-emerald-500"
          required
        />
        <span>
          Accetto l’{" "}
          <a
            href="/privacy-chat"
            target="_blank"
            className="underline text-emerald-400"
          >
            informativa sulla privacy
          </a>{" "}
          e autorizzo il trattamento dei miei dati ai sensi del Reg. UE 679/2016
          (GDPR) e del D.Lgs. 196/2003.
        </span>
      </label>
    </div>
  );
}

