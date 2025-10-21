// src/app/idraulico/roma/page.tsx
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function runtimeBaseUrl() {
  const h = await headers(); // Next 15: async
  const host = h.get("host") ?? "localhost:3002";
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

type Macro = {
  slug: string;
  title: string;
  description: string | null;
  areas_count: number;
  popular: { area_slug: string; label: string }[];
};

async function getMacro(): Promise<Macro[]> {
  const base = await runtimeBaseUrl();
  const res = await fetch(`${base}/api/public/macro-aree`, { next: { revalidate: 600 } });
  if (!res.ok) return [];
  return res.json();
}

/** palette macro-aree */
const macroColors: Record<string, { ring: string; chip: string; glow: string }> = {
  "centro-prati": { ring: "ring-emerald-500/40", chip: "bg-emerald-600/15 border-emerald-600/30", glow: "from-emerald-500/25" },
  nord:           { ring: "ring-sky-500/40",     chip: "bg-sky-600/15 border-sky-600/30",       glow: "from-sky-500/25" },
  est:            { ring: "ring-violet-500/40",  chip: "bg-violet-600/15 border-violet-600/30", glow: "from-violet-500/25" },
  sud:            { ring: "ring-rose-500/40",    chip: "bg-rose-600/15 border-rose-600/30",     glow: "from-rose-500/25" },
  ovest:          { ring: "ring-amber-500/40",   chip: "bg-amber-600/15 border-amber-600/30",   glow: "from-amber-500/25" },
  litorale:       { ring: "ring-cyan-500/40",    chip: "bg-cyan-600/15 border-cyan-600/30",     glow: "from-cyan-500/25" },
};

export default async function CityPage() {
  const macros = await getMacro();

  return (
    <main className="bg-app-premium">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Idraulico a Roma H24 —<br className="hidden md:block" />
              <span className="text-white/90"> scegli la tua zona</span>
            </h1>
            <p className="mt-4 text-neutral-300 max-w-xl">
              Trova il pronto intervento nel tuo quartiere. Prezzo chiaro prima dell’uscita.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:800002424" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500">
                Chiama subito 800 00 24 24
              </a>
              <Link href="/chat" className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-medium hover:bg-yellow-400">
                Chatta con noi
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* glow dietro la mascotte */}
            <div className="absolute -inset-10 bg-gradient-to-b from-emerald-500/12 via-transparent to-transparent blur-3xl" />
            <Image
              src="/mascotte/capitansos-mappa.webp"
              alt="Capitan SOS cerca la tua zona con lente e mappa"
              width={560}
              height={520}
              priority
              sizes="(min-width: 1024px) 560px, 80vw"
              className="relative mx-auto drop-shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[float_5s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </section>

      {/* CARDS macro-aree */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {macros.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-300">
            Nessuna macro-area trovata. Controlla l’API <code>/api/public/macro-aree</code>.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {macros.map((m) => {
              const c = macroColors[m.slug] ?? macroColors.nord;
              return (
                <article
                  key={m.slug}
                  className={[
                    "premium-border relative rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur",
                    "ring-1", c.ring, "p-5",
                    "transition-transform hover:-translate-y-0.5"
                  ].join(" ")}
                >
                  {/* glow premium */}
                  <div className={`pointer-events-none absolute -inset-20 bg-gradient-to-b ${c.glow} via-transparent to-transparent blur-3xl opacity-30`} />

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-100">{m.title}</h2>
                      {m.description && <p className="text-sm text-neutral-400 mt-1">{m.description}</p>}
                    </div>
                    <span className="shrink-0 rounded-full px-3 py-1 text-xs border border-neutral-700 bg-neutral-950 text-neutral-300">
                      {m.areas_count} quartieri
                    </span>
                  </div>

                  {/* popolari */}
                  {m.popular?.length > 0 && (
                    <div className="relative mt-4 flex flex-wrap gap-2">
                      {m.popular.slice(0, 10).map((a) => (
                        <Link
                          key={a.area_slug}
                          href={`/idraulico/roma/${a.area_slug}`}
                          className={[
                            "px-3 py-1.5 rounded-full border text-sm font-medium",
                            "bg-black/30 border-white/15 hover:border-white/40", c.chip
                          ].join(" ")}
                        >
                          {a.label.replace(/^Q\.\s*/, "")}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* tutti i quartieri */}
                  <details className="relative mt-4 rounded-xl border border-neutral-800 bg-black/20 open:bg-black/30">
                    <summary className="cursor-pointer select-none list-none px-4 py-2 text-sm text-neutral-300">
                      Vedi tutti i quartieri ({m.areas_count})
                    </summary>
                    <MacroAreasList macroSlug={m.slug} />
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

async function MacroAreasList({ macroSlug }: { macroSlug: string }) {
  const base = await runtimeBaseUrl();
  const res = await fetch(`${base}/api/public/areas?macro=${macroSlug}`, { next: { revalidate: 600 } });
  const areas: { area_slug: string; label: string }[] = res.ok ? await res.json() : [];
  if (!areas.length) return <div className="px-4 pb-4 text-sm text-neutral-400">Nessun quartiere trovato.</div>;
  return (
    <div className="px-4 pb-4">
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
        {areas.map((a) => (
          <Link
            key={a.area_slug}
            href={`/idraulico/roma/${a.area_slug}`}
            className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm hover:border-neutral-700"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

