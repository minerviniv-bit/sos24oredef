import CityLanding from "@/app/_shared/CityLanding";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="spurgo"
      heroTitle="Spurgo & Fognature a Roma — scegli la tua zona"
      heroSubtitle="Stasatura WC, disostruzioni, videoispezioni. Squadre rapide in tutta Roma."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}
