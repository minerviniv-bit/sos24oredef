"use client";

export default function StickyCta({
  numeroVerde,
  telefono,
  whatsapp,
}: {
  numeroVerde?: string | null;
  telefono?: string | null;
  whatsapp?: string | null;
}) {
  const nv = numeroVerde?.replace(/\s/g, "");
  const tel = telefono?.replace(/\s/g, "");
  const wa = whatsapp?.replace(/\D/g, "");

  if (!nv && !tel && !wa) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-6xl p-3">
        <div className="rounded-2xl border border-white/10 bg-black/75 px-4 py-3 backdrop-blur">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="text-sm text-white/80">Serve aiuto subito?</span>
            <div className="flex gap-2">
              {nv && (
                <a href={`tel:${nv}`} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-medium">
                  Chiama NV
                </a>
              )}
              {tel && (
                <a href={`tel:${tel}`} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-medium">
                  Chiama diretto
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-medium">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
