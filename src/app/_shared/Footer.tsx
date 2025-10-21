import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-10 grid gap-8 md:grid-cols-3 text-sm text-white/80">
        {/* Colonna 1 */}
        <div>
          <p className="font-semibold text-white mb-2">SOS24ORE</p>
          <p>
            Servizio di pronto intervento H24 dove disponibile. 
            Prezzo chiaro prima dell’uscita, assistenza verificata.
          </p>
          <p className="mt-2">P.IVA / Info legali</p>
        </div>

        {/* Colonna 2 */}
        <div>
          <p className="font-semibold text-white mb-2">Servizi</p>
          <ul className="space-y-1">
            <li><Link href="/idraulico" className="hover:underline">Idraulico</Link></li>
            <li><Link href="/fabbro" className="hover:underline">Fabbro e Apertura Porte</Link></li>
            <li><Link href="/elettricista" className="hover:underline">Elettricista</Link></li>
            <li><Link href="/spurgo" className="hover:underline">Spurgo & Fognature</Link></li>
            <li><Link href="/caldaie" className="hover:underline">Caldaie</Link></li>
            <li><Link href="/disinfestazioni" className="hover:underline">Disinfestazioni</Link></li>
            <li><Link href="/vetraio" className="hover:underline">Vetraio</Link></li>
            <li><Link href="/assistenza-stradale" className="hover:underline">Assistenza Stradale</Link></li>
          </ul>
        </div>

        {/* Colonna 3 */}
        <div>
          <p className="font-semibold text-white mb-2">Contatti</p>
          <ul className="space-y-1">
            <li><a href="tel:800002424" className="hover:underline">800 00 24 24</a></li>
            <li><Link href="/chat" className="hover:underline">Apri Chat</Link></li>
            <li><Link href="/privacy-chat" className="hover:underline">Privacy Chat</Link></li>
            <li><Link href="/privacy-cookie" className="hover:underline">Cookie Policy</Link></li>
            <li><Link href="/termini" className="hover:underline">Termini e Condizioni</Link></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer legale */}
      <div className="text-center text-xs text-white/60 py-4 border-t border-white/10 leading-relaxed px-4">
        © {new Date().getFullYear()} SOS24ORE — Tutti i diritti riservati.
        <br />
        SOS24ORE non è un servizio di pubblica sicurezza. In caso di emergenza contatta i numeri 112, 113 o 115.
      </div>
    </footer>
  );
}

