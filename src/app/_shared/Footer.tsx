// src/app/_shared/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm text-white/80 md:grid-cols-3 md:px-6">
        {/* Colonna 1 */}
        <div>
          <p className="mb-2 font-semibold text-white">SOS24ORE</p>
          <p>
            Servizio di pronto intervento H24 dove disponibile.
            Prezzo chiaro prima dell’uscita, assistenza verificata.
          </p>
          <p className="mt-2">P.IVA Minervini ADV S.r.l.: {/* inserisci P.IVA */}</p>
        </div>

        {/* Colonna 2 */}
        <div>
          <p className="mb-2 font-semibold text-white">Servizi</p>
          <ul className="space-y-1">
            <li><Link href="/idraulico" className="hover:underline">Idraulico</Link></li>
            <li><Link href="/fabbro" className="hover:underline">Fabbro e Apertura Porte</Link></li>
            <li><Link href="/elettricista" className="hover:underline">Elettricista</Link></li>
            <li><Link href="/spurgo" className="hover:underline">Spurgo &amp; Fognature</Link></li>
            <li><Link href="/caldaie" className="hover:underline">Caldaie</Link></li>
            <li><Link href="/disinfestazioni" className="hover:underline">Disinfestazioni</Link></li>
            <li><Link href="/vetraio" className="hover:underline">Vetraio</Link></li>
            <li><Link href="/assistenza-stradale" className="hover:underline">Assistenza Stradale</Link></li>
          </ul>
        </div>

        {/* Colonna 3 */}
        <div>
          <p className="mb-2 font-semibold text-white">Contatti &amp; Legale</p>
          <ul className="space-y-1">
            <li>
              <a
                href="tel:800002424"
                aria-label="Chiama il Numero Verde 800 00 24 24"
                className="hover:underline"
              >
                800 00 24 24
              </a>
            </li>
            <li><Link href="/chat" className="hover:underline">Apri Chat</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/privacy-chat" className="hover:underline">Privacy Chat</Link></li>
            <li><Link href="/cookie" className="hover:underline">Cookie Policy</Link></li>
            <li><Link href="/termini" className="hover:underline">Termini e Condizioni</Link></li>
            <li><Link href="/condizioni-commerciali" className="hover:underline">Condizioni Commerciali Professionisti</Link></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer legale + marchi */}
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs leading-relaxed text-white/60">
        © {new Date().getFullYear()} SOS24ORE — Tutti i diritti riservati.
        <br />
        SOS24ORE.it non effettua direttamente interventi tecnici e non incassa pagamenti per conto dei professionisti.
        I tecnici operano in piena autonomia e sotto la propria responsabilità.
        <br />
        SOS24ORE.it e Capitan SOS sono marchi di <b>Minervini ADV S.r.l.</b>.
      </div>
    </footer>
  );
}
