"use client";

import { useEffect, useRef, useState } from "react";

type Option = { label: string; value: string };

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "— scegli —",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Evita mismatch SSR/CSR: montiamo e poi mostriamo il valore reale
  useEffect(() => { setMounted(true); }, []);

  // chiudi se clicchi fuori
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);
  // Testo da mostrare: in SSR mostriamo sempre placeholder per coerenza;
  // al client, dopo mounted=true, mostriamo il valore reale.
  const displayLabel = mounted ? (selected?.label ?? "") : "";

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="custom-select-trigger relative h-10 w-full rounded-md px-3 text-left text-sm outline-none"
      >
        {/* suppressHydrationWarning evita warning se il testo cambia tra server e client */}
        {displayLabel ? (
          <span suppressHydrationWarning>{displayLabel}</span>
        ) : (
          <span className="opacity-60">{placeholder}</span>
        )}

        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-70">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="custom-select-menu absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-md p-1"
        >
          {options.map((o) => {
            const isSel = o.value === value;
            return (
              <div
                key={o.value}
                role="option"
                aria-selected={isSel}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  btnRef.current?.focus();
                }}
                className={`custom-select-item cursor-pointer rounded px-2 py-2 text-sm ${isSel ? "font-medium" : ""}`}
              >
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

