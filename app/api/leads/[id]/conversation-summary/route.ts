import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getLeadById } from "@/lib/leads";
import { getLeadActivities } from "@/lib/lead-activities";
import { openrouter } from "@/lib/openrouter";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const lead = await getLeadById(userId, id);

    if (!lead) {
      return NextResponse.json(
        {
          error: "Lead not found.",
        },
        {
          status: 404,
        }
      );
    }

    const activities = await getLeadActivities(
      userId,
      id
    );

    const conversationMessages = activities
      .filter(
        (activity) =>
          activity.activity_type === "lead_replied" ||
          activity.activity_type === "message_sent"
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );

    if (conversationMessages.length === 0) {
      return NextResponse.json({
        success: true,
        summary:
          "No conversation has been recorded yet.",
      });
    }

    const conversation = conversationMessages
      .map((message) => {
        const speaker =
          message.activity_type === "lead_replied"
            ? "LEAD"
            : "COACH";

        return `${speaker}: ${
          message.description || ""
        }`;
      })
      .join("\n\n");

    const prompt = `
You are CoachDM AI, an expert assistant for professional coaches.

Create a concise summary of the current sales conversation with this lead.

The summary should help the coach immediately understand:

- what the lead wants
- how interested they are
- their main concerns or objections
- what they are currently asking about
- what the coach should understand about the current conversation

Lead name:
${lead.name}

Lead goal:
${lead.goal || "Not provided"}

Current stage:
${lead.stage}

Current intent:
${lead.intent}

Current temperature:
${lead.temperature}

CONVERSATION:

${conversation}

Write ONE concise paragraph.

Do not use bullet points.

Do not mention that you are an AI.

Do not invent information.

Focus primarily on the latest part of the conversation.

Keep the summary around 30-60 words.
`;

    const completion =
      await openrouter.chat.completions.create({
        model:
          process.env.OPENROUTER_MODEL ||
          "openai/gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "You summarize sales conversations for professional coaches. Be concise, accurate, and grounded only in the provided conversation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const summary =
      completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error(
        "No conversation summary generated."
      );
    }

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(
      "Conversation summary API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate conversation summary.",
      },
      {
        status: 500,
      }
    );
  }
}