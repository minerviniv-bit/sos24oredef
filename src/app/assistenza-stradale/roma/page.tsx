import CityLanding from "@/app/_shared/CityLanding";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="assistenza-stradale"
      heroTitle="Assistenza Stradale a Roma — scegli la tua zona"
      heroSubtitle="Carroattrezzi H24, recupero veicoli e soccorso in tutta Roma."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}

