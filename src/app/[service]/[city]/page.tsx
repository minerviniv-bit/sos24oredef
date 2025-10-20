// src/app/[service]/[city]/page.tsx
import type { Metadata } from "next";
import CityLanding from "@/app/_shared/CityLanding";
import { mascotsByService, cityCopy } from "@/app/_shared/serviceCityConfig";
import { notFound } from "next/navigation";

type Params = { service: string; city: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = params.service as keyof typeof cityCopy;   // ⬅️ narrow chiave service
  const c = params.city;
  const copy = cityCopy[s]?.[c];
  return {
    title: copy ? copy.titleH1 : `${params.service} ${c} – SOS24ORE`,
    description: copy ? copy.subH1 : `Trova ${params.service} a ${c} H24.`,
  };
}

export default function Page({ params }: { params: Params }) {
  const { service, city } = params;
  const s = service as keyof typeof mascotsByService;  // ⬅️ narrow chiave service
  const mascot = mascotsByService[s];
  const copy = cityCopy[s]?.[city];
  if (!mascot || !copy) return notFound();

  // Quartieri (stub): quando pronto, caricali da Supabase
  const quarters = [
    { slug: "centro", label: "Centro" },
    { slug: "prati", label: "Prati" },
    { slug: "eur", label: "EUR" },
  ];

  return (
    <CityLanding
  service={s as any}
      city={city}
      titleH1={copy.titleH1}
      subH1={copy.subH1}
      numeroVerde="800 00 24 24"
      heroMascotte={mascot}
      heroLogo="/logos/logo.webp"
      lead={copy.lead}
      pills={copy.pills}
      faqs={copy.faqs}
      quarters={quarters}
    />
  );
}
