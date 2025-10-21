// src/app/_shared/serviceCityConfig.ts

/* =========================
   Tipi base
   ========================= */
export type ServiceKey =
  | "idraulico"
  | "caldaie"
  | "fabbro"
  | "elettricista"
  | "spurgo"
  | "disinfestazioni"
  | "vetraio"
  | "assistenza-stradale";

/* =========================
   Mascotte per servizio
   ========================= */
export const mascotsByService: Record<ServiceKey, string> = {
  idraulico: "/mascotte/idraulico.webp",
  caldaie: "/mascotte/caldaie-2.webp",
  fabbro: "/mascotte/fabbro.webp",
  elettricista: "/mascotte/elettricista.png", // nel tuo folder è PNG, non .webp
  spurgo: "/mascotte/spurgo.webp",
  disinfestazioni: "/mascotte/disinfestatore.webp",
  vetraio: "/mascotte/vetraio.webp",
  "assistenza-stradale": "/mascotte/capitansos-mappa.webp",
};

// fallback sicuro (se il service non è nel mapping)
export function mascotFor(svc: string): string {
  return mascotsByService[svc as ServiceKey] ?? "/mascotte/capitansos-mappa.webp";
}

/* =========================
   City Copy (SEO / testi)
   ========================= */
export type CityCopy = {
  titleH1: string;
  subH1: string;
  lead: string;
  pills: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

// struttura: cityCopy[servizio][città]
export const cityCopy: Record<ServiceKey, Record<string, CityCopy>> = {
  idraulico: {
    roma: {
      titleH1: "Idraulico Roma – SOS24ORE",
      subH1: "Pronto intervento H24 a Roma. Seleziona il quartiere o contattaci.",
      lead:
        "Per perdite, allagamenti, wc otturati o guasti a Roma, interveniamo rapidamente con tecnici selezionati.",
      pills: [
        { title: "Intervento rapido", desc: "Tecnici selezionati e geolocalizzati." },
        { title: "Preventivo prima dell’uscita", desc: "Costo chiaro e tempi stimati." },
        { title: "H24 / 7", desc: "Anche notti, weekend e festivi." },
      ],
      faqs: [
        { q: "Tempi di arrivo?", a: "In base alla zona di Roma: spesso entro un’ora se c’è disponibilità." },
        { q: "La chiamata è gratuita?", a: "Sì, 800 00 24 24 è un Numero Verde." },
        { q: "Lavorate anche notturni/festivi?", a: "Sì, dove indicato in pagina e in base alla copertura." },
      ],
    },
  },

  vetraio: {
    roma: {
      titleH1: "Vetraio Roma – SOS24ORE",
      subH1: "Sostituzione vetri e vetrine a Roma, anche H24.",
      lead:
        "Riparazioni rapide su vetri rotti, infissi e vetrine negozio, con sopralluoghi urgenti.",
      pills: [
        { title: "Vetri e vetrine", desc: "Emergenze su abitazioni e attività." },
        { title: "Preventivo veloce", desc: "Indicazione costi immediata." },
        { title: "Extra-orario", desc: "Notte e festivi dove indicato." },
      ],
      faqs: [
        { q: "Vetrine negozi?", a: "Sì, dove disponibile interveniamo anche su vetrine." },
      ],
    },
  },

  // gli altri servizi possono essere aggiunti gradualmente
  caldaie: {},
  fabbro: {},
  elettricista: {},
  spurgo: {},
  disinfestazioni: {},
  "assistenza-stradale": {},
};

