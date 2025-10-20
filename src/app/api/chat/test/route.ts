// src/app/api/chat/test/route.ts
import OpenAI from "openai";

export const runtime = "nodejs"; // meglio nodejs per i test, non edge

export async function GET() {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return new Response(JSON.stringify({ ok: false, error: "OPENAI_API_KEY mancante" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const client = new OpenAI({ apiKey: key });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Rispondi solo OK" }],
      temperature: 0,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ ok: true, reply }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore generico";
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
