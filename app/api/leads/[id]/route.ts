import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  updateLead,
  deleteLead,
  type LeadIntent,
  type LeadStage,
  type LeadTemperature,
} from "@/lib/leads";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
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

    const body = await req.json();

    const updatedLead = await updateLead(
      userId,
      id,
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        source: body.source,
        goal: body.goal,
        notes: body.notes,
        stage: body.stage as LeadStage,
        intent: body.intent as LeadIntent,
        temperature:
          body.temperature as LeadTemperature,
      }
    );

    if (!updatedLead) {
      return NextResponse.json(
        {
          error: "Failed to update lead.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error(
      "Update lead API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the lead.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Delete a lead.
 */
export async function DELETE(
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

    const deleted = await deleteLead(
      userId,
      id
    );

    if (!deleted) {
      return NextResponse.json(
        {
          error: "Failed to delete lead.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete lead API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while deleting the lead.",
      },
      {
        status: 500,
      }
    );
  }
}