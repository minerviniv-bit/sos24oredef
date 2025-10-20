// src/lib/chat/prompts/index.ts

export { buildSystemPrompt } from "./base";
export { COMMON_QUESTIONS, COMMON_RULES } from "./common";

// --- Vision Instructions unificato ---
export function buildVisionInstructions(serviceHint?: string): string {
  // Qui puoi differenziare in base al servizio se vuoi (idraulico, fabbro, ecc.)
  switch (serviceHint) {
    case "fabbro":
      return `
Analizza la foto per capire il tipo di serratura o porta.
Classifica se possibile (cilindro europeo, doppia mappa, yale, blindata).
Se la foto è sfocata o scura, chiedi una foto frontale della toppa e del cilindro.
Non menzionare mai percentuali o "confidence" all’utente.
`.trim();

    case "idraulico":
      return `
Analizza la foto per identificare perdite, tubi rotti o sifoni danneggiati.
Se si nota acqua sul pavimento o vicino ai rubinetti, consiglia di chiudere il rubinetto generale.
Non fornire prezzi, solo suggerimenti visivi utili.
`.trim();

    case "elettricista":
      return `
Analizza la foto per individuare quadri elettrici, prese bruciate o differenziali scattati.
Avvisa di non toccare parti vive o danneggiate.
Non inserire valutazioni di sicurezza o prezzi.
`.trim();

    case "spurgo":
      return `
Analizza la foto per identificare tombini, pozzetti o ristagni.
Non menzionare mai prezzi o tempistiche.
Suggerisci di indicare il punto preciso del problema se non visibile.
`.trim();

    case "disinfestazioni":
      return `
Analizza la foto per capire la presenza di insetti o roditori.
Non dire mai la specie con certezza assoluta; usa formule tipo "sembra", "potrebbe essere".
Non fornire stime o trattamenti.
`.trim();

    case "vetraio":
      return `
Analizza la foto per capire se si tratta di vetro singolo o doppio, e se l’infisso è in alluminio o legno.
Descrivi il tipo di rottura (scheggiatura, crepa, rottura completa).
`.trim();

    case "caldaie":
      return `
Analizza la foto per individuare marca, modello o eventuali codici errore sul display.
Non dare mai diagnosi tecniche o costi.
`.trim();

    case "assistenza-stradale":
      return `
Analizza la foto per individuare ruote a terra, danni visibili o posizione del veicolo.
Non stimare tempi o costi, solo indicazioni visive (ad esempio: "pneumatico forato", "batteria scarica").
`.trim();

    default:
      return `
Analizza la foto per fornire informazioni utili al servizio SOS24ORE.
Evita valutazioni tecniche, prezzi o percentuali di certezza.
`.trim();
  }
}
