"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV = [
  { href: "/idraulico", label: "Idraulico" },
  { href: "/fabbro", label: "Fabbro" },
  { href: "/spurgo", label: "Spurgo" },
  { href: "/elettricista", label: "Elettricista" },
  { href: "/contatti", label: "Contatti" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#030814]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="relative w-9 h-9 sm:w-10 sm:h-10">
            <Image src="/logos/logo.webp" alt="SOS24ORE.it" fill className="object-contain" priority />
          </span>
          <span className="hidden sm:block text-white font-bold tracking-wide">SOS24ORE.it</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-neutral-200 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href="tel:800002424"
            className="inline-flex items-center rounded-lg px-3 py-2 bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition"
            aria-label="Chiama subito 800 00 24 24"
          >
            📞 <span className="ml-2">800 00 24 24</span>
          </a>
          <Link
            href="/chat"
            className="inline-flex items-center rounded-lg px-3 py-2 bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 transition"
            aria-label="Chatta con noi"
          >
            💬 <span className="ml-2">Chatta</span>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white"
          aria-label="Apri menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#030814]/95">
          <nav className="px-4 py-3 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-neutral-200 hover:text-white hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="tel:800002424"
                className="flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition"
                onClick={() => setOpen(false)}
              >
                📞 <span className="ml-2">800 00 24 24</span>
              </a>
              <Link
                href="/chat"
                className="flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 transition"
                onClick={() => setOpen(false)}
              >
                💬 <span className="ml-2">Chat</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
