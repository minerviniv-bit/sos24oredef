import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({
  href, title, desc, img, imgAlt,
}: { href:string; title:string; desc:string; img:string; imgAlt:string }) {
  return (
    <Link
      href={href}
      className="
        group card-glow relative block rounded-2xl
        bg-[#0c1320] ring-1 ring-white/5 shadow-xl
        hover:shadow-2xl hover:ring-white/10
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/40
        p-5
      "
    >
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/40 mb-4">
        <Image
          src={img}
          alt={imgAlt}
          fill
          className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
          sizes="(min-width:1280px) 280px, (min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
          priority={false}
        />
      </div>

      <h3 className="text-white text-lg font-semibold mb-1.5">{title}</h3>
      <p className="text-neutral-300 text-sm leading-snug">{desc}</p>

      <span className="text-yellow-400 text-sm font-semibold inline-flex items-center mt-3">
        Pronto Intervento&nbsp;↗
      </span>
    </Link>
  );
}

