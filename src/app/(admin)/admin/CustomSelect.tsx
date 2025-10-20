"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Option = { value: string; label: string };
type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export default function CustomSelect({
  value, onChange, options, placeholder = "— scegli —", className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const current = useMemo(
    () => options.find(o => o.value === value)?.label || "",
    [options, value]
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={boxRef} className={"relative " + className}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-10 w-full rounded-md border border-white/10 bg-[#0b1020] px-3 text-left text-sm text-neutral-100 outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={current ? "" : "text-neutral-400"}>
          {current || placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center opacity-70">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-md border border-white/10 bg-[#0b1020] p-1 shadow-xl"
        >
          {options.map(o => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false); btnRef.current?.focus(); }}
              className={
                "cursor-pointer rounded px-2 py-2 text-sm " +
                (o.value === value ? "bg-white/10 text-white" : "text-neutral-100 hover:bg-white/10")
              }
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
