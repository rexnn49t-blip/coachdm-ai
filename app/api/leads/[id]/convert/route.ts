import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getLeadById, updateLead } from "@/lib/leads";
import { createLeadActivity } from "@/lib/lead-activities";

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

    if (lead.stage === "client") {
      return NextResponse.json(
        {
          error: "This lead is already a client.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedLead = await updateLead(
      userId,
      id,
      {
        stage: "client",
        intent: "interested",
        temperature: "hot",
      }
    );

    if (!updatedLead) {
      throw new Error(
        "Failed to convert lead."
      );
    }

    await createLeadActivity(
      userId,
      id,
      {
        activityType: "lead_converted",
        title: "Lead Converted to Client",
        description:
          `${lead.name} was successfully converted into a client.`,
      }
    );

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error(
      "Convert lead API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to convert lead to client.",
      },
      {
        status: 500,
      }
    );
  }
}