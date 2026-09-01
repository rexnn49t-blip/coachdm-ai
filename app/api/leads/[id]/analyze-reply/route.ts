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

const validIntents = [
  "unknown",
  "interested",
  "unsure",
  "not_interested",
] as const;

const validTemperatures = [
  "cold",
  "warm",
  "hot",
] as const;

const validStages = [
  "new",
  "initial_conversation",
  "discovery",
  "qualification",
  "objection",
  "offer",
  "follow_up",
  "call_payment",
  "client",
  "lost",
] as const;

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    // =========================================================
    // AUTH
    // =========================================================

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

    // =========================================================
    // LEAD
    // =========================================================

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

    // =========================================================
    // REQUEST BODY
    // =========================================================

    const body = await req.json();

    const reply =
      typeof body.reply === "string"
        ? body.reply.trim()
        : "";

    if (!reply) {
      return NextResponse.json(
        {
          error: "Lead reply is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // ACTIVITY HISTORY
    // =========================================================

    const activities =
      await getLeadActivities(
        userId,
        id
      );

    const recentActivityContext =
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
        : "No previous activity has been recorded.";

    // =========================================================
    // AI PROMPT
    // =========================================================

    const prompt = `
You are CoachDM AI, an expert AI assistant for professional coaches.

Analyze the lead's CURRENT state after receiving their LATEST reply.

The latest reply is the strongest and most recent signal.

Older conversations should be used as context, but they should NOT automatically outweigh newer buying signals.

LEAD INFORMATION

Name:
${lead.name}

Current Stage:
${lead.stage}

Current Intent:
${lead.intent}

Current Temperature:
${lead.temperature}

Goal:
${lead.goal || "Not provided"}

Initial Message:
${lead.initial_message || "Not provided"}

Coach Notes:
${lead.notes || "Not provided"}


LEAD JOURNEY
(Oldest activity to newest activity)

${recentActivityContext}


LATEST LEAD REPLY

${reply}


YOUR TASK

Determine the lead's CURRENT:

1. Intent
2. Temperature
3. Pipeline stage
4. Short explanation


IMPORTANT DECISION PRINCIPLE

Ask:

"Compared with their previous position, is this latest reply moving the lead forward, keeping them in the same position, or moving them away from becoming a client?"

If the latest reply clearly shows progression, reflect that progression.

Examples:

- General questions or wanting more information may indicate discovery or qualification.
- Asking about specific coaching options, packages, pricing, or payment plans indicates stronger commercial intent.
- Asking when they can talk, book a call, get started, or discuss options is a strong next-step signal.
- Asking about payment AND when to talk can justify call_payment.
- A previous affordability concern should not automatically keep the lead in qualification if the latest reply shows willingness to move forward.
- A concern can still exist while the lead remains highly interested.
- Do not confuse an objection with lack of interest when the lead is actively asking how to proceed.


TEMPERATURE

COLD:
Little interest, weak engagement, avoidance, or weak buying intent.

WARM:
Interested and engaged but still exploring, uncertain, or not ready for a concrete next step.

HOT:
Strong and active buying intent.

Examples of HOT signals:

- asking how to get started
- asking for pricing
- asking about payment options
- asking about packages
- asking to book a call
- asking when they can talk
- asking how to proceed
- expressing readiness to start


STAGE DEFINITIONS

DISCOVERY:
The coach still needs to understand the lead's goals, situation, or problems.

QUALIFICATION:
The lead is interested, but fit, needs, readiness, budget, or commitment still need to be explored.

OBJECTION:
A significant concern or hesitation is currently the main barrier.

OFFER:
The lead is ready to receive or discuss a specific coaching solution, package, or proposal.

CALL_PAYMENT:
The lead is actively moving toward a concrete commitment such as booking a call, discussing final options, payment, or starting.


IMPORTANT

Do not remain at qualification merely because the lead previously had a concern.

Use qualification only when qualification is still the main next step.

If the latest reply clearly shows stronger intent than earlier replies, allow intent, temperature, and stage to move forward.


VALID INTENT VALUES:

unknown
interested
unsure
not_interested


VALID TEMPERATURE VALUES:

cold
warm
hot


VALID STAGE VALUES:

new
initial_conversation
discovery
qualification
objection
offer
follow_up
call_payment
client
lost


Return ONLY JSON.

Use exactly this structure:

{
  "intent": "one valid intent value",
  "temperature": "one valid temperature value",
  "stage": "one valid stage value",
  "reason": "Short explanation based primarily on the latest reply."
}
`;

    // =========================================================
    // OPENROUTER
    // =========================================================

    console.log(
      "Analyzing lead reply with model:",
      process.env.OPENROUTER_MODEL ||
        "openai/gpt-4o-mini"
    );

    const completion =
      await openrouter.chat.completions.create({
        model:
          process.env.OPENROUTER_MODEL ||
          "openai/gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "You are an expert sales conversation analyst. Analyze the latest lead reply and return ONLY valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

        max_tokens: 500,
      });

    // =========================================================
    // AI RESPONSE
    // =========================================================

    const content =
      completion.choices[0]?.message?.content;

    console.log(
      "OpenRouter analysis response:",
      content
    );

    if (!content) {
      throw new Error(
        "OpenRouter returned an empty response."
      );
    }

    // =========================================================
    // CLEAN JSON
    // =========================================================

    let jsonText = content.trim();

    // Remove markdown code fences if the model
    // accidentally returns them.
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
    }

    let analysis: {
      intent?: string;
      temperature?: string;
      stage?: string;
      reason?: string;
    };

    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error(
        "Failed to parse AI JSON:",
        parseError
      );

      console.error(
        "Raw AI response:",
        content
      );

      throw new Error(
        "AI returned invalid JSON."
      );
    }

    // =========================================================
    // VALIDATE AI RESULT
    // =========================================================

    if (
      !validIntents.includes(
        analysis.intent as (typeof validIntents)[number]
      )
    ) {
      throw new Error(
        `Invalid intent returned by AI: ${analysis.intent}`
      );
    }

    if (
      !validTemperatures.includes(
        analysis.temperature as (typeof validTemperatures)[number]
      )
    ) {
      throw new Error(
        `Invalid temperature returned by AI: ${analysis.temperature}`
      );
    }

    if (
      !validStages.includes(
        analysis.stage as (typeof validStages)[number]
      )
    ) {
      throw new Error(
        `Invalid stage returned by AI: ${analysis.stage}`
      );
    }

    if (
      typeof analysis.reason !==
      "string"
    ) {
      throw new Error(
        "AI returned an invalid reason."
      );
    }

    // =========================================================
    // SUCCESS
    // =========================================================

    return NextResponse.json({
      success: true,

      analysis: {
        intent: analysis.intent,
        temperature:
          analysis.temperature,
        stage: analysis.stage,
        reason: analysis.reason,
      },
    });
  } catch (error) {
    // =========================================================
    // REAL ERROR LOGGING
    // =========================================================

    console.error(
      "========================================"
    );

    console.error(
      "ANALYZE LEAD REPLY API ERROR"
    );

    console.error(
      error
    );

    console.error(
      "========================================"
    );

    // Keep the browser response safe,
    // but expose the actual error during development.
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error.";

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV ===
          "development"
            ? message
            : "Failed to analyze lead reply.",
      },
      {
        status: 500,
      }
    );
  }
}