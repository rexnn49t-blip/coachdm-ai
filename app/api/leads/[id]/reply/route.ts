import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getLeadById } from "@/lib/leads";
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

    const reply =
      typeof body.reply === "string"
        ? body.reply.trim()
        : "";

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "Lead reply is required.",
        },
        {
          status: 400,
        }
      );
    }

    const activity =
      await createLeadActivity(
        userId,
        id,
        {
          activityType: "lead_replied",

          title: "Lead replied",

          description: reply,
        }
      );

    if (!activity) {
      return NextResponse.json(
        {
          error:
            "Failed to save lead reply.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error(
      "Lead reply API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save lead reply.",
      },
      {
        status: 500,
      }
    );
  }
}