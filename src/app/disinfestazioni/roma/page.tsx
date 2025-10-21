import CityLanding from "@/app/_shared/CityLanding";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="disinfestazioni"
      heroTitle="Disinfestazioni a Roma — scegli la tua zona"
      heroSubtitle="Blatte, zanzare, roditori, sanificazioni. Tecnici rapidi in ogni quartiere."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}

