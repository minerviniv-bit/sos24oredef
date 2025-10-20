// src/lib/chat/prompts/categories/elettricista.ts
import type { CategoryModule } from "./common";

export const ELETTRICISTA: CategoryModule = {
  name: "elettricista",
  prompt: `
ELETTRICISTA — checklist:
- Salta salvavita o magnetotermico? Quali ambienti senza corrente?
- Odore di bruciato/scintille? Interrompere uso e non toccare parti vive.
- Extra: { salvavita?: boolean, magnetotermico?: boolean, stanze_coinvolte?: string }.
`.trim(),
  vision: `
ELETTRICISTA — Vision:
- Quadro elettrico, differenziale scattato, prese annerite o cavi danneggiati: descrivi senza gergo.
`.trim(),
};
