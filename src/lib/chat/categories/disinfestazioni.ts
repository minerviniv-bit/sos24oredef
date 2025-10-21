// src/lib/chat/categories/disinfestazioni.ts
import type { CategoryModule } from "../prompts/common";

export const DISINFESTAZIONI: CategoryModule = {
  name: "disinfestazioni",
  prompt: `
DISINFESTAZIONI — checklist:
- Specie (blatte, cimici, vespe, roditori…), numero avvistamenti, ambienti colpiti.
- Presenza bambini/animali domestici?
- Extra: { specie?: string, estensione?: "localizzata"|"diffusa", ambienti?: string }.
`.trim(),
  vision: `
DISINFESTAZIONI — Vision:
- Se possibile riconosci specie/nido e descrivi in modo semplice (niente percentuali).
`.trim(),
};

