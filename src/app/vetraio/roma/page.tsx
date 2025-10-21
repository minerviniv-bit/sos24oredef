import CityLanding from "@/app/_shared/CityLanding";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CityLanding
      service="vetraio"
      heroTitle="Vetraio a Roma — scegli la tua zona"
      heroSubtitle="Sostituzione vetri, cristalli e urgenze. Interventi rapidi e garantiti."
      mascotSrc="/mascotte/capitansos-mappa.webp"
      callLabel="Chiama subito 800 00 24 24"
      chatLabel="Chatta con noi"
    />
  );
}

