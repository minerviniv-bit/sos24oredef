// src/lib/chat/categories/assistenza-stradale.ts
import type { CategoryModule } from "../prompts/common";

export const ASSISTENZA_STRADALE: CategoryModule = {
  name: "assistenza-stradale",
  prompt: `
ASSISTENZA-STRADALE — checklist:
- Posizione precisa (via + civico o punto noto), veicolo, problema (batteria, foratura, incidente),
- Cambio manuale/automatico, ruota di scorta presente?
- Extra: { posizione?: string, veicolo?: string, problema_stradale?: string, cambio?: "manuale"|"automatico" }.
`.trim(),
  vision: `
ASSISTENZA-STRADALE — Vision:
- Se si vede ruota a terra/batteria/urto, descrivilo in modo semplice.
`.trim(),
};

