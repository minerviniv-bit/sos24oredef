"use client";
import * as React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export default function NativeSelect({ label, className = "", children, ...rest }: Props) {
  return (
    <div className="space-y-1">
      {label ? <label className="text-sm text-neutral-300">{label}</label> : null}
      <div className="relative">
        <select
          {...rest}
          className={
            "h-10 w-full appearance-none rounded-md border border-white/10 " +
            "bg-[#0b1020] text-neutral-100 px-3 text-sm outline-none " + // <-- forza testo chiaro e bg scuro
            "placeholder:text-neutral-400 " +
            className
          }
        >
          {children}
        </select>
        {/* chevron */}
        <span className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-neutral-400">
          ▾
        </span>
      </div>
    </div>
  );
}
