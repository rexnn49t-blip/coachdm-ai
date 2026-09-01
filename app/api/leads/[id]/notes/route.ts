import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  getLeadById,
  updateLead,
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

    const note =
      typeof body.note === "string"
        ? body.note.trim()
        : "";

    if (!note) {
      return NextResponse.json(
        {
          error: "Note is required.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedNotes = lead.notes
      ? `${lead.notes}\n\n${note}`
      : note;

    const updatedLead = await updateLead(
      userId,
      id,
      {
        notes: updatedNotes,
      }
    );

    if (!updatedLead) {
      throw new Error(
        "Failed to update lead notes."
      );
    }

    const activity =
      await createLeadActivity(
        userId,
        id,
        {
          activityType: "note_added",
          title: "Coach note added",
          description: note,
        }
      );

    if (!activity) {
      throw new Error(
        "Failed to create note activity."
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Add lead note API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to add note.",
      },
      {
        status: 500,
      }
    );
  }
}