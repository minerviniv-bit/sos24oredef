import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export function PremiumCTAButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <NumeroVerdeButton>Chiama subito 800 00 24 24</NumeroVerdeButton>
      <ChatAIPremiumButton>Chatta con noi</ChatAIPremiumButton>
    </div>
  );
}

export function NumeroVerdeButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="tel:800002424"
      className="group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,.45)] ring-1 ring-inset ring-emerald-300/60 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_16px_40px_rgba(16,185,129,.55)] active:translate-y-0 active:shadow-[inset_0_2px_8px_rgba(0,0,0,.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
    >
      <span className="relative z-[1] flex items-center gap-2">
        <Phone className="h-5 w-5 text-white opacity-90" aria-hidden />
        {children}
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/30" />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-50 mix-blend-overlay" />
      <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-3xl bg-emerald-400/20 blur-xl" />
    </a>
  );
}

export function ChatAIPremiumButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/chat"
      className="group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-bold text-black bg-gradient-to-b from-[#FFD95A] to-[#FFC107] shadow-[0_10px_30px_rgba(255,193,7,.4)] ring-1 ring-inset ring-yellow-400/60 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_16px_40px_rgba(255,193,7,.55)] active:translate-y-0 active:shadow-[inset_0_2px_8px_rgba(0,0,0,.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
    >
      <span className="relative z-[1] flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-black opacity-90" aria-hidden />
        {children}
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-yellow-300/50" />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-60 mix-blend-overlay" />
      <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-3xl bg-yellow-300/30 blur-xl transition-opacity duration-200 group-hover:opacity-100" />
    </Link>
  );
}
