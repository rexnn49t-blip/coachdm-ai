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

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error:
            "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    await createLeadActivity(
      userId,
      id,
      {
        activityType: "message_sent",

        title: "Message sent to lead",

        description: message,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Message sent API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save sent message.",
      },
      {
        status: 500,
      }
    );
  }
}