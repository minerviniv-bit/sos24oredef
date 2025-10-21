// src/lib/chat/categories/caldaie.ts
import type { CategoryModule } from "../prompts/common";

export const CALDAIE: CategoryModule = {
  name: "caldaie",
  prompt: `
CALDAIE/TERMOSIFONI/SCALDABAGNO — checklist:
- Marca/modello, codice errore o sintomo (pressione bassa, non parte, acqua fredda), ultima manutenzione.
- Extra: { marca?: string, modello?: string, codice_errore?: string, pressione_bassa?: boolean }.
`.trim(),
  vision: `
CALDAIE — Vision:
- Se vedi display con codice errore o targhetta con marca/modello, estraili (solo per la macchina).
`.trim(),
};

