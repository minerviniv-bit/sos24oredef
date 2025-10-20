export type LeadData = {
  servizio?: string;
  zona?: string;
  urgenza?: string;
  fascia_oraria?: string;
  problema?: string;
  accesso?: string;
  note?: string;
  extra?: Record<string, unknown>;
  pricing?: { ready?: boolean; item?: string; price?: number; note?: string };
  contatto?: Record<string, unknown> | null;
};

export function extractLeadAndStrip(
  text: string
): { text: string; lead: LeadData | null } {
  let lead: LeadData | null = null;

  // Estrai LEAD{...}
  const m = text.match(/LEAD\s*\{[\s\S]*\}$/m);
  if (m) {
    try {
      lead = JSON.parse(m[0].replace(/^LEAD\s*/, "")) as LeadData;
    } catch {
      lead = null;
    }
    // Rimuovi LEAD e blocchi ```json```
    text = text
      .replace(/LEAD\s*\{[\s\S]*\}$/m, "")
      .replace(/```json[\s\S]*?```/gm, "")
      .trim();
  }

  // Rimuovi eventuali parole tipo "confidence"/percentuali
  text = text
    .replace(/\b(confidence|certezza|accuratezza)\b.*$/gim, "")
    .replace(/\b0\.\d+\b/g, "")
    .trim();

  return { text, lead };
}
