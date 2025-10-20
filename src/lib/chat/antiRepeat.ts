// Taglia ripetizioni tipo "Dalla foto sembra una serratura a cilindro europeo."
// Rimuove frasi duplicate già dette dall'assistente nell'ultimo turno.

export function dedupeAssistantText(newText: string, history: Array<{role: "user"|"assistant", content: string}>) {
  const prevAssistant = [...history].reverse().find(m => m.role === "assistant")?.content || "";
  if (!prevAssistant) return newText;

  const lines = newText.split(/\n+/).map(s => s.trim()).filter(Boolean);
  const prev = prevAssistant.replace(/\s+/g, " ").toLowerCase();
  const filtered = lines.filter(line => {
    const l = line.replace(/\s+/g, " ").toLowerCase();
    // se la riga è molto simile a qualcosa già detto, scarta
    return !(l.length > 15 && prev.includes(l.slice(0, Math.min(40, l.length))));
  });

  // Evita doppia CTA ripetuta
  const once = uniqueByPrefix(filtered, [
    "👉 Per confermare chiama l’800 00 24 24".toLowerCase(),
    "Vuoi che ti metta in contatto".toLowerCase(),
    "Dalla foto sembra".toLowerCase(),
  ]);

  return once.join("\n");
}

function uniqueByPrefix(lines: string[], prefixes: string[]) {
  const seen = new Set<string>();
  return lines.filter(l => {
    const key = prefixes.find(p => l.toLowerCase().startsWith(p)) || `__${l.slice(0,40).toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
