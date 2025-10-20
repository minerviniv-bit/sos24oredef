"use client";
import * as React from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const DialogCtx = React.createContext<Ctx | null>(null);

export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  children: React.ReactNode;
}) {
  const [inner, setInner] = React.useState(!!defaultOpen);
  const isCtrl = typeof open === "boolean";
  const val = isCtrl ? !!open : inner;
  const set = (v: boolean) => {
    if (!isCtrl) setInner(v);
    onOpenChange?.(v);
  };
  return <DialogCtx.Provider value={{ open: val, setOpen: set }}>{children}</DialogCtx.Provider>;
}

export function DialogContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(DialogCtx);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => ctx.setOpen(false)} />
      <div className={`relative z-10 w-[90vw] max-w-2xl rounded-2xl border border-white/10 bg-[#0B1324] p-4 shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}
export function DialogTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}
