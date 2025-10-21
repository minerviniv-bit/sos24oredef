// src/lib/chat/prompts/categories/fabbro.ts
import type { CategoryModule } from "../prompts/common";
export const FABBRO: CategoryModule = {
  name: "fabbro",
  prompt: `
FABBRO — checklist:
- Porta o serratura? Blindata? Chiave girata dentro? Chiave spezzata? Saracinesca/basculante?
- Chiedi SUBITO foto della toppa (fronte) + chiave/cilindro per identificare il lock_type.
- Extra: { lock_type: yale_classica|cilindro_europeo|doppia_mappa|blindata_cilindro, chiave_spezzata?: boolean, foto_url?: string }.
- Prezzi: prezzo certo solo con lock_type chiaro; altrimenti range + nota notte/festivi.
`.trim(),
  vision: `
FABBRO — Vision:
- Classifica serratura: yale_classica | cilindro_europeo | doppia_mappa | blindata_cilindro.
- Se sfocata/angolata male, chiedi una foto frontale piú nitida.
`.trim(),
};

