import { openrouter } from "./openrouter";

type GenerateReplyParams = {
  leadMessage: string;
  tone: string;
  length: string;
};

export async function generateAIReply({
  leadMessage,
  tone,
  length,
}: GenerateReplyParams) {
  const completion = await openrouter.chat.completions.create({
    model: "openai/gpt-4.1-mini",
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `
You are CoachDM AI.

You help online coaches convert leads into paying clients.

Tone:
${tone}

Reply Length:
${length}

Rules:

- Sound natural and human.
- Never sound robotic.
- Build trust quickly.
- Show empathy.
- End with a clear CTA.
- Never mention AI.

Length Guide:
- Short = under 80 words
- Medium = around 120 words
- Detailed = around 180 words.
`,
      },
      {
        role: "user",
        content: leadMessage,
      },
    ],
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    "Sorry, I couldn't generate a reply."
  );
}