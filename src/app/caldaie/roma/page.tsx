import CityLanding from "@/app/_shared/CityLanding";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="caldaie"
      heroTitle="Caldaie a Roma — scegli la tua zona"
      heroSubtitle="Assistenza, manutenzione, riparazioni urgenti. Tecnici qualificati in ogni quartiere."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}
