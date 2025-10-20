import CityLanding from "@/app/_shared/CityLanding";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="elettricista"
      heroTitle="Elettricista a Roma H24 — scegli la tua zona"
      heroSubtitle="Guasti, corto circuiti, salvavita e impianti. Intervento rapido e trasparente."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}
