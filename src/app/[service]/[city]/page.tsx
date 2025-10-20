// src/app/[service]/[city]/page.tsx
import type { Metadata } from "next";
import CityLanding from "@/app/_shared/CityLanding";
import { mascotsByService, cityCopy } from "@/app/_shared/serviceCityConfig";
import { notFound } from "next/navigation";

// Tipi base
type Params = { service: string; city: string };
type ServiceKey = keyof typeof mascotsByService;

// ===== SEO Metadata =====
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const s = params.service as keyof typeof cityCopy;
  const c = params.city;
  const copy = cityCopy[s]?.[c];

  return {
    title: copy ? copy.titleH1 : `${params.service} ${c} – SOS24ORE`,
    description: copy ? copy.subH1 : `Trova ${params.service} a ${c} H24.`,
    alternates: {
      canonical: `https://www.sos24ore.it/${params.service}/${c}`,
    },
  };
}

// ===== Pagina principale =====
export default function Page({ params }: { params: Params }) {
  const { service, city } = params;
  const s = service as ServiceKey;

  const mascot = mascotsByService[s];
  const copy = cityCopy[s]?.[city];

  // Se il servizio o la città non sono configurati → 404
  if (!mascot || !copy) return notFound();

  return (
    <CityLanding
      service={s}
      heroTitle={copy.titleH1}
      heroSubtitle={copy.subH1}
      mascotSrc={mascot}
    />
  );
}
