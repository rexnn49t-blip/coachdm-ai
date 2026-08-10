import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { reply, style } = await req.json();

    if (!reply || !style) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

 const prompts: Record<string, string> = {
  shorter: `
Rewrite this coaching reply.

Make it shorter.

Keep the meaning exactly the same.

Don't add new information.

Only return the rewritten reply.
`,

  cta: `
Rewrite this coaching reply.

Strengthen the call-to-action at the end.

Make the CTA clear, natural, and easy for the lead to respond to.

Encourage the lead to take the next step toward working with the coach, without sounding pushy or salesy.

Keep the rest of the message natural and personalized.

Only return the rewritten reply.
`,

  professional: `
Rewrite this coaching reply.

Make it more professional.

Keep the same meaning.

Only return the rewritten reply.
`,

  persuasive: `
Rewrite this coaching reply.

Make it more persuasive.

Keep the same meaning.

Only return the rewritten reply.
`,

  confident: `
Rewrite this coaching reply.

Make it more confident.

Keep the same meaning.

Only return the rewritten reply.
`,
};

   const completion = await openai.chat.completions.create({
  model: "openai/gpt-4.1-mini",

  max_tokens: 300,
  temperature: 0.7,

  messages: [
        {
          role: "system",
          content: prompts[style],
        },
        {
          role: "user",
          content: reply,
        },
      ],
    });

    const rewritten =
      completion.choices?.[0]?.message?.content?.trim();

    if (!rewritten) {
      return NextResponse.json(
        {
          error: "No reply returned from AI.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      reply: rewritten,
    });
  } catch (error: any) {
    console.error("========== REWRITE API ERROR ==========");
    console.error(error);
    console.error("=======================================");

    return NextResponse.json(
      {
        error:
          error?.error?.message ||
          error?.message ||
          "Rewrite failed",
      },
      {
        status: 500,
      }
    );
  }
}