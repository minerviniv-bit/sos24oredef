// src/lib/chat/prompts/categories/idraulico.ts
import type { CategoryModule } from "../prompts/common";
export const IDRAULICO: CategoryModule = {
  name: "idraulico",
  prompt: `
IDRAULICO — checklist:
- Tipo problema (perdita/otturazione/nessuna acqua).
- Punto esatto: lavandino, wc, doccia, bidet, sifone, tubo, valvola, autoclave.
- Da quanto tempo, quantità acqua, si può chiudere la valvola generale?
- Se allagamento: consiglia SUBITO di chiudere l’acqua e asciugare il più possibile.

FOTO PRIMA: chiedi una foto del punto (sifone/tubo/attacco) per capire meglio.
Extra da compilare se possibile: { perdita_tipo?, otturazione_punto?, acqua_chiusa?: boolean }.
`.trim(),
  vision: `
IDRAULICO — Vision:
- Evidenzia perdite, sifoni gocciolanti, tubi lesionati, ristagni o otturazioni visibili.
- Se vedi rubinetti/valvole, indica dove provare a chiudere l’acqua (senza istruzioni complesse).
`.trim(),
};

