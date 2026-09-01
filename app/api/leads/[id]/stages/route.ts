import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  updateLeadStage,
  type LeadStage,
} from "@/lib/leads";

const validStages: LeadStage[] = [
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
];

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const body = await req.json();

    const stage = body?.stage;

    if (
      typeof stage !== "string" ||
      !validStages.includes(stage as LeadStage)
    ) {
      return NextResponse.json(
        {
          error: "Invalid lead stage.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedLead =
      await updateLeadStage(
        userId,
        id,
        stage as LeadStage
      );

    if (!updatedLead) {
      return NextResponse.json(
        {
          error:
            "Lead not found or could not be updated.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error(
      "Update lead stage API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update lead stage.",
      },
      {
        status: 500,
      }
    );
  }
}