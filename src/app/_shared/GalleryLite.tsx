export default function GalleryLite({ images }: { images: string[] | undefined }) {
  const imgs = (images || []).filter((x): x is string => typeof x === "string" && x.length > 0);
  if (!imgs.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1828] p-3">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_0_20px_rgba(0,160,255,0.1)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgs[0]} alt="Cover" className="h-full w-full object-cover" />
      </div>
      {imgs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {imgs.slice(1, 6).map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={String(i)}
              src={g}
              alt={`Gallery ${i + 1}`}
              className="h-16 w-24 flex-none rounded-lg object-cover opacity-90 ring-1 ring-white/10"
            />
          ))}
        </div>
      )}
    </div>
  );
}
