import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  getLeadById,
  updateLead,
  type LeadIntent,
  type LeadStage,
  type LeadTemperature,
} from "@/lib/leads";

import {
  createLeadActivity,
} from "@/lib/lead-activities";

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

    const body = await req.json();

    const outcome =
      typeof body.outcome === "string"
        ? body.outcome.trim()
        : "";

    const leadResponse =
      typeof body.leadResponse === "string"
        ? body.leadResponse.trim()
        : "";

    const intent =
      body.intent as LeadIntent | undefined;

    const temperature =
      body.temperature as
        | LeadTemperature
        | undefined;

    const stage =
      body.stage as LeadStage | undefined;

    if (!outcome) {
      return NextResponse.json(
        {
          error:
            "Please describe what happened.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Update the current lead state.
     */
    const updates: {
      intent?: LeadIntent;
      temperature?: LeadTemperature;
      stage?: LeadStage;
      notes?: string;
    } = {};

    if (intent) {
      updates.intent = intent;
    }

    if (temperature) {
      updates.temperature = temperature;
    }

    if (stage) {
      updates.stage = stage;
    }

    /*
     * Keep the existing notes and append
     * the latest action outcome.
     */
    const completionNote = [
      `Action completed: ${outcome}`,
      leadResponse
        ? `Lead response: ${leadResponse}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    updates.notes = lead.notes
      ? `${lead.notes}\n\n${completionNote}`
      : completionNote;

    const updatedLead =
      await updateLead(
        userId,
        id,
        updates
      );

    if (!updatedLead) {
      return NextResponse.json(
        {
          error:
            "Failed to update lead.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Save the completed action
     * to the lead journey history.
     */
    const activityDescription = [
      `Outcome: ${outcome}`,
      leadResponse
        ? `Lead response: ${leadResponse}`
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    await createLeadActivity(
      userId,
      id,
      {
        activityType: "action_completed",

        title: "Action completed",

        description:
          activityDescription,
      }
    );

    /*
     * Save additional activities when
     * important lead values changed.
     */

    if (
      intent &&
      intent !== lead.intent
    ) {
      await createLeadActivity(
        userId,
        id,
        {
          activityType:
            "intent_updated",

          title: `Intent updated to ${intent.replace(
            /_/g,
            " "
          )}`,
        }
      );
    }

    if (
      temperature &&
      temperature !== lead.temperature
    ) {
      await createLeadActivity(
        userId,
        id,
        {
          activityType:
            "temperature_updated",

          title: `Temperature updated to ${temperature}`,
        }
      );
    }

    if (
      stage &&
      stage !== lead.stage
    ) {
      await createLeadActivity(
        userId,
        id,
        {
          activityType:
            "stage_updated",

          title: `Stage moved to ${stage.replace(
            /_/g,
            " "
          )}`,
        }
      );
    }

    return NextResponse.json({
      success: true,

      lead: updatedLead,
    });
  } catch (error) {
    console.error(
      "Complete lead action error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to complete action.",
      },
      {
        status: 500,
      }
    );
  }
}