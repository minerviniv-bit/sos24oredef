"use client";

import Link from "next/link";

export default function CtaNumeroVerde() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <a
        href="tel:800002424"
        className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-green-600 text-white font-semibold shadow hover:bg-green-500 transition"
        aria-label="Chiama subito il numero verde 800 00 24 24"
      >
        <span className="mr-2">📞</span> Chiama subito{" "}
        <span className="ml-2 font-bold">800 00 24 24</span>
      </a>

      <Link
        href="/chat"
        className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-300 transition"
        aria-label="Chatta con noi"
      >
        💬 Chatta con noi
      </Link>
    </div>
  );
}

