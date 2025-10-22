"use client";

import { ReactNode } from "react";
import Link from "next/link";

type TocItem = { href: string; label: string };

export function LegalSection({
  id,
  title,
  children,
}: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mt-8 mb-2 text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-zinc-200">{children}</div>
    </section>
  );
}

export default function LegalPageShell({
  title,
  lastUpdate,
  toc = [],
  children,
}: {
  title: string;
  lastUpdate?: string;          // YYYY-MM-DD
  toc?: TocItem[];
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0b1220] text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {lastUpdate && (
          <p className="mt-1 text-sm text-zinc-400">
            Ultimo aggiornamento: <time dateTime={lastUpdate}>{lastUpdate}</time>
          </p>
        )}

        {/* TOC opzionale */}
        {toc.length > 0 && (
          <nav className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm text-zinc-400">Indice</div>
            <ol className="list-inside list-decimal space-y-1 text-sm">
              {toc.map((i) => (
                <li key={i.href}>
                  <Link className="hover:underline" href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Body */}
        {children}
      </div>
    </main>
  );
}
