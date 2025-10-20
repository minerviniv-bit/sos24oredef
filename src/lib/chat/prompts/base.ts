// src/lib/chat/prompts/base.ts
import { SHARED_RULES, CLOSING_CTA, LEAD_SCHEMA, type PromptHints } from "./categories/common";

export function baseSystem(quartieri: string[], hints?: PromptHints) {
  const extraHint =
    hints && (hints.service_hint || hints.zone_hint || hints.urgency_hint)
      ? `\nHINTS (usa se coerenti, altrimenti conferma in 1 riga): ` +
        `${hints.service_hint ? `service_hint="${hints.service_hint}" ` : ""}` +
        `${hints.zone_hint ? `zone_hint="${hints.zone_hint}" ` : ""}` +
        `${hints.urgency_hint ? `urgency_hint="${hints.urgency_hint}"` : ""}`
      : "";

  return `
${SHARED_RULES}
${extraHint}

Quartieri di Roma conosciuti: ${quartieri.join(", ")}.

${CLOSING_CTA}

${LEAD_SCHEMA}
`.trim();
}
