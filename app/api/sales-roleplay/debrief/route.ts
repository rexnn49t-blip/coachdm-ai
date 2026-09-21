import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

type RoleplayMessage = {
  role: "coach" | "prospect";
  content: string;
};

const scenarioFocus: Record<string, string> = {
  interested: `
The prospect is genuinely interested.
Focus especially on whether the coach:
- discovered the prospect's actual goal,
- asked useful questions,
- connected the coaching offer to that goal,
- avoided rushing into a pitch,
- and created a natural next step.
`,

  skeptical: `
The prospect is skeptical.
Focus especially on whether the coach:
- acknowledged concerns instead of becoming defensive,
- built trust,
- explored the reason behind the skepticism,
- used relevant evidence or reasoning,
- and avoided making exaggerated claims.
`,

  price: `
The prospect has a price objection.
Focus especially on whether the coach:
- explored what the price concern actually means,
- avoided immediately discounting,
- communicated value clearly,
- connected value to the prospect's goals,
- and handled the next step naturally.
`,

  hesitant: `
The prospect is hesitant.
Focus especially on whether the coach:
- uncovered the actual reason for hesitation,
- asked rather than assumed,
- reduced uncertainty,
- created clarity,
- and proposed an appropriate next step without applying unnecessary pressure.
`,
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const scenario = body.scenario as string | undefined;
    const messages = body.messages as RoleplayMessage[] | undefined;

    if (!scenario || !scenarioFocus[scenario]) {
      return NextResponse.json(
        { error: "Invalid roleplay scenario." },
        { status: 400 }
      );
    }

    if (!Array.isArray(messages) || messages.length < 2) {
      return NextResponse.json(
        {
          error:
            "Not enough conversation data to evaluate.",
        },
        { status: 400 }
      );
    }

    const coachMessages = messages.filter(
      (message) => message.role === "coach"
    );

    const conversation = messages
      .map(
        (message, index) =>
          `${index + 1}. ${
            message.role === "coach"
              ? "COACH"
              : "PROSPECT"
          }: ${message.content}`
      )
      .join("\n\n");

    const systemPrompt = `
You are an expert sales coach evaluating an INTERNAL AI sales roleplay.

The person being evaluated is the COACH.

The prospect is fictional.

Your job is to provide honest, specific, practical feedback based ONLY on the conversation provided.

Do not invent events, statements, intentions, or outcomes that are not present.

Do not reward the coach simply for being polite.

Do not punish the coach for not closing a fictional prospect.

Evaluate the QUALITY of the sales conversation.

SCENARIO:

${scenarioFocus[scenario]}

IMPORTANT EVALUATION RULES:

- A short conversation should not automatically receive a high score.
- If the coach did not demonstrate a skill, score that skill based on the evidence available.
- If there is insufficient evidence for a category, explain that limitation in the feedback rather than inventing evidence.
- Look at the coach's actual wording.
- Identify specific moments that affected the conversation.
- Distinguish between a good intention and an effective sales behavior.
- Do not encourage manipulation, pressure, deception, or unsolicited outreach.
- Favor genuine discovery, relevance, clarity, trust, and appropriate next steps.
- Do not evaluate whether the coaching service itself is good or bad.
- Do not evaluate the prospect.
- Do not provide feedback during the roleplay itself.

SCORING:

Score each category from 0 to 100.

Conversation Strength:
Overall clarity, flow, listening, relevance, and ability to maintain a natural conversation.

Discovery & Questioning:
Ability to uncover goals, problems, context, motivations, and concerns through useful questions.

Objection Handling:
Ability to understand and respond to concerns without becoming defensive, dismissive, or overly pushy.

Value Communication:
Ability to connect the coaching offer to the prospect's specific situation instead of relying on generic claims.

Closing / Next Step:
Ability to establish a clear, appropriate next step without unnecessary pressure.

IMPORTANT:
Do not calculate the overall score as a simple average mechanically.
Use your judgment based on the quality and completeness of the conversation.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": number,
  "conversationStrength": number,
  "discovery": number,
  "objectionHandling": number,
  "valueCommunication": number,
  "closing": number,
  "summary": string,
  "strongestMoment": string,
  "missedOpportunity": string,
  "strengths": string[],
  "improvements": string[],
  "betterResponse": string,
  "takeaway": string
}

Requirements:

- Scores must be integers from 0 to 100.
- summary: 2-3 sentences.
- strongestMoment: identify a SPECIFIC moment from the coach's messages and explain why it worked.
- missedOpportunity: identify a SPECIFIC moment where the coach could have handled the conversation better.
- strengths: exactly 3 concise items.
- improvements: exactly 3 concise items.
- betterResponse: provide one realistic alternative response for the most important missed opportunity.
- takeaway: one concise coaching lesson.
- Keep all feedback practical and specific.
- Do not use markdown inside JSON values.

Conversation:

${conversation}

The coach sent ${coachMessages.length} message(s).
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const content =
      completion.choices[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        {
          error:
            "The AI did not return an evaluation.",
        },
        { status: 500 }
      );
    }

    let evaluation;

    try {
      evaluation = JSON.parse(content);
    } catch {
      console.error(
        "Invalid roleplay evaluation JSON:",
        content
      );

      return NextResponse.json(
        {
          error:
            "Unable to process the AI evaluation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      evaluation,
    });
  } catch (error) {
    console.error(
      "Sales roleplay debrief error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate the sales debrief.",
      },
      { status: 500 }
    );
  }
}