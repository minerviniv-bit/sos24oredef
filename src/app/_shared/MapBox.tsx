"use client";

type Props = {
  address: string;
  zoom?: number;
  height?: string; // tailwind class, default "h-64"
};

export default function MapBox({ address, zoom = 14, height = "h-64" }: Props) {
  const q = encodeURIComponent(address);
  const src = `https://maps.google.com/maps?&q=${q}&z=${zoom}&output=embed`;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-6 pb-3">
        <h3 className="text-lg font-semibold">Mappa della zona</h3>
        <p className="text-sm text-white/70 mt-1">
          Visualizza dove opera il nostro tecnico partner.
        </p>
      </div>

      {/* ORDINE CLASSI STABILE: height PRIMA, poi w-full */}
      <div className={`${height} w-full`}>
        <iframe
          title={`Mappa ${address}`}
          src={src}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="text-xs text-white/40 p-3 text-right">
        <a
          href={`https://maps.google.com/?q=${q}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Apri in Google Maps
        </a>
      </p>
    </div>
  );
}
