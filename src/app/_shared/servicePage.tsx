import Image from "next/image";
import Link from "next/link";

export function ServiceHeroV1({
  title,
  subtitle,
  mascotteSrc = "/mascotte/idraulico.webp",
  phone = "800 00 24 24",
}: {
  title: string;
  subtitle?: string;
  mascotteSrc?: string;
  phone?: string;
}) {
  const tel = phone.replace(/\s+/g, "");

  return (
    <section className="bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* COLONNA SINISTRA (logo, h1, sottotitolo, NV + CTA) */}
          <div>
            {/* LOGO GRANDE */}
            <Image src="/logos/logo.webp" alt="SOS24ORE" width={220} height={220} priority className="mb-6" />

            {/* TITOLO */}
            <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-lg text-white/85 max-w-2xl">{subtitle}</p>
            )}

            {/* ⬇️ RIGA NUMERO VERDE + DUE BOTTONI, SOTTO L'H1, SU SFONDO BLU */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Banner Numero Verde grande */}
              <a
                href={`tel:${tel}`}
                className="rounded-[22px] border border-emerald-400/50 bg-[#0A1816] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:border-emerald-300/70 transition"
                aria-label={`Chiama Numero Verde ${phone}`}
              >
                <Image
                  src="/logos/numero-verde2.webp"
                  alt={`Numero Verde ${phone}`}
                  width={360}
                  height={90}
                  priority
                />
              </a>

              {/* Bottoni come v1 */}
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${tel}`}
                  className="rounded-full bg-emerald-500 text-black font-semibold px-6 py-3 hover:opacity-90 active:opacity-80 shadow"
                >
                  Chiama {phone}
                </a>
                <Link
                  href="/chat"
                  className="rounded-full bg-[#FFD12A] text-black font-semibold px-6 py-3 hover:opacity-90 active:opacity-80 shadow"
                >
                  Apri Chat
                </Link>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA (mascotte corretta) */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src={mascotteSrc}
              alt="Capitan SOS Idraulico"
              width={520}
              height={640}
              priority
              className="drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceScaffoldMinimal(props: {
  title: string;
  subtitle?: string;
  mascotteSrc?: string;
  phone?: string;
}) {
  return <ServiceHeroV1 {...props} />;
}
