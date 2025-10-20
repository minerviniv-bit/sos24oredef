// src/lib/chat/prompts/categories/spurgo.ts
import type { CategoryModule } from "./common";

export const SPURGO: CategoryModule = {
  name: "spurgo",
  prompt: `
SPURGO — checklist:
- Punto intasamento (wc, pozzetto, fossa biologica), esce acqua/odore?
- Accesso strada per autospurgo e distanza dall’area lavoro?
- Extra: { punto_intasato?, autospurgo_accesso?: boolean }.
`.trim(),
  vision: `
SPURGO — Vision:
- Riconosci pozzetti/fogne, ristagni e traboccamenti; segnala se serva accesso autospurgo.
`.trim(),
};
