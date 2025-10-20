export const metadata = {
  title: "Informativa Privacy – Chat SOS24ORE.it",
  description:
    "Informativa completa sul trattamento dei dati per l’assistente chat di SOS24ORE.it, conforme al Regolamento UE 679/2016 (GDPR).",
};

export default function PrivacyChatPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-zinc-100">
      <h1 className="text-2xl font-bold text-emerald-400 mb-4">
        Informativa sulla Privacy – Chat SOS24ORE.it
      </h1>

      <p className="mb-4 text-zinc-300">
        Ai sensi del Regolamento (UE) 2016/679 (“GDPR”) e del D.Lgs. 196/2003,
        SOS24ORE.it informa gli utenti che i dati personali eventualmente forniti
        tramite la chat automatizzata sono trattati nel rispetto dei principi
        di liceità, correttezza, trasparenza e tutela della riservatezza.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        1. Titolare del trattamento
      </h2>
      <p className="text-zinc-300">
        Il titolare del trattamento è <strong>SOS24ORE S.r.l.</strong>, con sede legale
        in [INSERISCI INDIRIZZO LEGALE COMPLETO], e-mail:{" "}
        <a
          href="mailto:info@sos24ore.it"
          className="text-emerald-400 underline"
        >
          info@sos24ore.it
        </a>.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        2. Finalità e base giuridica del trattamento
      </h2>
      <p className="text-zinc-300">
        I dati forniti volontariamente dall’utente tramite la chat (testo,
        immagini, eventuali recapiti) sono trattati per le seguenti finalità:
      </p>
      <ul className="list-disc list-inside text-zinc-300">
        <li>fornire informazioni preliminari sui servizi di SOS24ORE;</li>
        <li>valutare la tipologia di intervento tecnico richiesto;</li>
        <li>
          trasmettere la richiesta a un operatore umano, previo consenso esplicito
          dell’utente.
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        3. Modalità del trattamento
      </h2>
      <p className="text-zinc-300">
        Il trattamento avviene in modalità digitale e automatizzata tramite
        assistente virtuale. I messaggi vengono anonimizzati e non conservati
        oltre il tempo strettamente necessario alla gestione della conversazione.
        Le eventuali immagini inviate sono utilizzate esclusivamente per valutare
        la richiesta e vengono eliminate dopo l’analisi.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        4. Tipologia dei dati trattati
      </h2>
      <p className="text-zinc-300">
        Possono essere trattati: testo libero, descrizione del problema, zona o
        quartiere, immagini, e – solo se forniti – nome e recapiti di contatto.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        5. Conservazione dei dati
      </h2>
      <p className="text-zinc-300">
        I dati non vengono conservati permanentemente. Le informazioni utili
        alla gestione dell’intervento vengono trasferite all’operatore umano
        e gestite secondo le procedure interne di sicurezza e riservatezza.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        6. Comunicazione e destinatari
      </h2>
      <p className="text-zinc-300">
        I dati potranno essere comunicati esclusivamente a personale autorizzato
        o a partner tecnici incaricati della gestione degli interventi,
        che operano in qualità di Responsabili del trattamento ai sensi dell’art. 28 del GDPR.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        7. Diritti dell’interessato
      </h2>
      <p className="text-zinc-300">
        L’utente può in qualsiasi momento esercitare i diritti previsti dagli
        articoli 15–22 del GDPR (accesso, rettifica, cancellazione, limitazione,
        opposizione, portabilità).  
        Le richieste devono essere inviate a:{" "}
        <a
          href="mailto:privacy@sos24ore.it"
          className="text-emerald-400 underline"
        >
          privacy@sos24ore.it
        </a>.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        8. Sicurezza dei dati
      </h2>
      <p className="text-zinc-300">
        SOS24ORE adotta misure tecniche e organizzative adeguate per garantire
        la sicurezza dei dati personali e prevenire accessi non autorizzati,
        divulgazioni o usi impropri.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        9. Servizi di emergenza e limitazioni
      </h2>
      <p className="text-zinc-300">
        La chat SOS24ORE non costituisce un servizio di pubblica sicurezza.  
        In caso di emergenze (furto, incendio, fughe di gas, incidenti, ecc.),
        l’utente deve contattare immediatamente i numeri di emergenza: **112, 113 o 115**.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        10. Aggiornamenti dell’informativa
      </h2>
      <p className="text-zinc-300">
        La presente informativa potrà essere aggiornata in qualsiasi momento.
        L’ultima versione è sempre disponibile su questa pagina.
      </p>

      <p className="mt-8 text-sm text-zinc-500">
        Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
      </p>
    </main>
  );
}
