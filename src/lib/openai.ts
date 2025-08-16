// src/lib/openai.ts
/**
 * Minimal helper that calls OpenAI Chat Completions and returns JSON text.
 * Requires OPENAI_API_KEY in .env.local
 */
export async function chatJSON(opts: { system: string; user: string; model?: string }) {
  const { system, user, model = "gpt-4o-mini" } = opts;
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in your environment.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI ${res.status}: ${text}`);
  }

  const data = (await res.json()) as any;
  return data?.choices?.[0]?.message?.content ?? "{}";
}
