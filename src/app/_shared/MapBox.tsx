"use client";

type Props = {
  address: string;            // es. "Campo Marzio, Roma, Italia"
  zoom?: number;              // default 14
  variant?: "sidebar" | "wide";
};

export default function MapBox({ address, zoom = 14, variant = "sidebar" }: Props) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const q = encodeURIComponent(address);

  // URL ufficiale Embed v1 (con chiave). Se manca la key, fallback “vecchio”:
  const src = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=${zoom}`
    : `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`;

  const boxClass =
    variant === "wide"
      ? "rounded-2xl border border-white/10 bg-white/5 p-3"
      : "rounded-2xl border border-white/10 bg-white/5 p-3";

  return (
    <div className={boxClass}>
      <h3 className="text-lg font-semibold">Mappa della zona</h3>
      <p className="text-sm text-white/70 mt-1">
        Visualizza dove opera il nostro tecnico partner.
      </p>
      <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
        <iframe
          title={`Mappa ${address}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-white/60 mt-2 text-right">
        <a
          href={`https://maps.google.com/?q=${q}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Apri in Google Maps
        </a>
      </p>
    </div>
  );
}
