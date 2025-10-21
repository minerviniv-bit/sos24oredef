import CityLanding from "@/app/_shared/CityLanding";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="fabbro"
      heroTitle="Fabbro a Roma H24 — scegli la tua zona"
      heroSubtitle="Apertura porte, sostituzione serrature e pronto intervento. Prezzo chiaro prima dell’uscita."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}

