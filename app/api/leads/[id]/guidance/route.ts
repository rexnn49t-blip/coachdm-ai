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

    const lead = await getLeadById(
      userId,
      id
    );

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

    const activities =
      await getLeadActivities(
        userId,
        id
      );

    const journeyContext =
      activities.length > 0
        ? activities
            .slice(0, 12)
            .reverse()
            .map((activity, index) => {
              return `${index + 1}. ${
                activity.title
              }${
                activity.description
                  ? `\nDetails: ${activity.description}`
                  : ""
              }`;
            })
            .join("\n\n")
        : "No journey activity has been recorded yet.";

    const isClient =
      lead.stage === "client";

    const prompt = `
You are CoachDM AI, an expert AI assistant for professional coaches.

Your job is to recommend the SINGLE best next action for the coach based on the person's CURRENT state and complete recent journey.

IMPORTANT:

The person is currently ${
  isClient
    ? "already a client."
    : "still a lead."
}

CURRENT STATE

Name: ${lead.name}

Current Stage: ${lead.stage}

Current Intent: ${lead.intent}

Current Temperature: ${lead.temperature}

Goal:
${lead.goal || "Not provided"}

Initial Message:
${lead.initial_message || "Not provided"}

Coach Notes:
${lead.notes || "Not provided"}

RECENT JOURNEY
(Oldest to newest)

${journeyContext}

${
  isClient
    ? `
CLIENT MODE

This person has already converted into a client.

The client journey should continue naturally after conversion.

Use the RECENT JOURNEY carefully to determine what onboarding or coaching actions have already happened.

Do not repeatedly recommend the same action if the journey shows that it has already been completed.

CLIENT JOURNEY FLOW

The typical client journey is:

1. Welcome the new client
2. Schedule the first coaching session
3. Collect detailed goals, expectations, and baseline information
4. Create an initial personalized action plan
5. Begin active coaching
6. Check progress and provide support
7. Adjust the coaching plan when necessary
8. Continue regular progress check-ins

IMPORTANT PROGRESSION RULES

- If the client was just converted and no welcome or onboarding action has happened, recommend welcoming or onboarding them.
- If onboarding has started but the first coaching session has not been scheduled, recommend scheduling it.
- If the first coaching session has already been scheduled or completed, do not recommend scheduling it again.
- If the client's goals, expectations, or baseline information have not been collected, recommend collecting them.
- If enough information has already been gathered, recommend creating an initial action plan.
- If the action plan has already been created, focus on beginning active coaching and supporting implementation.
- If active coaching has already begun, focus on progress check-ins, identifying challenges, and adjusting the plan.
- Always use the most recent journey activities to determine what has already happened.
- The recommendation must be the natural NEXT step, not simply the first step in the client journey.

The client has ALREADY committed to coaching.

DO NOT recommend:

- selling coaching
- qualifying the lead
- handling sales objections
- sending follow-ups to close the sale
- discussing whether they want to become a client
- moving them through the sales pipeline
- converting them into a client

DO NOT mention, ask about, or recommend:

- payment plans
- pricing
- affordability
- coaching packages
- coaching options as something to purchase
- sales calls
- closing the sale
- convincing them to join
- qualifying them as a lead

Do not frame the suggested message as if the person is still deciding whether to buy coaching.

Treat them as an active client whose relationship with the coach is continuing.

Choose the SINGLE most useful next action based on:

1. What has already happened in the journey.
2. The most recent activity.
3. The client's goals.
4. What information is still missing.
5. The natural next stage of the client relationship.

Do not recommend repeating completed onboarding or coaching steps.

The suggested message must sound like a message to an existing client, not a sales prospect.
`
    : `
LEAD MODE

This person is still progressing toward becoming a client.

Help the coach move them naturally through the journey.

Do not recommend repeating something that has already happened.

Do not try to close the sale too early.

If the lead recently expressed an objection, help the coach address it.

If the lead has shown strong interest, move them naturally toward the appropriate next commitment.

If the lead is uncertain, focus on understanding or reducing uncertainty.

If the lead is not ready, recommend a suitable follow-up rather than forcing the sale.
`
}

YOUR TASK

Determine the SINGLE best next action.

Base your recommendation primarily on:

1. The current stage.
2. The most recent journey events.
3. What has already been completed.
4. The person's current level of commitment.
5. Their stated goals and concerns.

The recommendation must feel like the natural NEXT step.

Return ONLY valid JSON in exactly this format:

{
  "title": "Short and specific next action title",
  "guidance": "Clear explanation of exactly what the coach should do next and why.",
  "suggestedMessage": "A natural, personalized message the coach can send."
}
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
              "You are an expert AI assistant for professional coaches. For leads, help the coach move naturally through the conversion journey. When the current stage is client, switch completely from lead conversion thinking to client onboarding, relationship management, active coaching, progress support, and long-term client success. Use journey history to avoid repeating completed actions. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type: "json_object",
        },
      });

    const content =
      completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "No guidance generated."
      );
    }

    const guidance = JSON.parse(content);

    if (
      typeof guidance.title !== "string" ||
      typeof guidance.guidance !== "string" ||
      typeof guidance.suggestedMessage !== "string"
    ) {
      throw new Error(
        "AI returned invalid guidance data."
      );
    }

    return NextResponse.json({
      success: true,
      guidance: {
        title: guidance.title,
        guidance: guidance.guidance,
        suggestedMessage:
          guidance.suggestedMessage,
      },
    });
  } catch (error) {
    console.error(
      "Lead guidance API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate AI guidance.",
      },
      {
        status: 500,
      }
    );
  }
}