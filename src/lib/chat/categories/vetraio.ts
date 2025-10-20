// src/lib/chat/prompts/categories/vetraio.ts
import type { CategoryModule } from "./common";

export const VETRAIO: CategoryModule = {
  name: "vetraio",
  prompt: `
VETRAIO — checklist:
- Tipo vetro (singolo/doppio), dimensioni circa, infisso (porta/finestra/vetrina), messa in sicurezza.
- Extra: { vetrocamera?: boolean, dimensioni?: string, infisso?: "porta"|"finestra"|"vetrina" }.
`.trim(),
  vision: `
VETRAIO — Vision:
- Valuta vetrocamera vs singolo, descrivi rottura e, se possibile, area/infisso.
`.trim(),
};
