// src/app/[service]/[city]/[quartiere]/page.tsx
import Link from "next/link";

export default function QuartierePage({ params }: { params: { service: string; city: string; quartiere: string }}) {
  const { service, city, quartiere } = params;
  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#0B1220" }}>
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-16">
        <nav className="text-xs text-white/60 mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Home</Link></li><li>/</li>
            <li><Link href={`/${service}`} className="capitalize hover:underline">{service}</Link></li><li>/</li>
            <li><Link href={`/${service}/${city}`} className="capitalize hover:underline">{city}</Link></li><li>/</li>
            <li className="capitalize">{quartiere}</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight capitalize">
          {service} {city} – {quartiere}
        </h1>
        <p className="mt-4 text-white/80">Qui inseriremo la scheda cliente, recapiti e CTA.</p>
      </div>
    </main>
  );
}
