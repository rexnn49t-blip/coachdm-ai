import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getLeadById } from "@/lib/leads";
import { createFollowUp } from "@/lib/follow-ups";
import {
  getFollowUpStep,
  getFollowUpDate,
} from "@/lib/follow-up-sequence";
import { createLeadActivity } from "@/lib/lead-activities";

export async function POST(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: leadId } = await params;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }

    /*
     * Make sure the lead belongs to the current coach.
     */
    const lead = await getLeadById(userId, leadId);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    /*
     * Follow-ups should not be started for lost leads
     * or existing clients.
     */
    if (lead.stage === "lost") {
      return NextResponse.json(
        {
          error:
            "Follow-ups cannot be started for a lost lead.",
        },
        { status: 400 }
      );
    }

    if (lead.stage === "client") {
      return NextResponse.json(
        {
          error:
            "Follow-ups are not needed for an active client.",
        },
        { status: 400 }
      );
    }

    /*
     * The first active follow-up is Day 2.
     *
     * Day 0 represents the initial reply and is already
     * handled by the normal conversation flow.
     */
    const firstFollowUp = getFollowUpStep(2);

    if (!firstFollowUp) {
      return NextResponse.json(
        { error: "Follow-up sequence is not configured." },
        { status: 500 }
      );
    }

    /*
     * Schedule the follow-up relative to now.
     */
    const scheduledFor = getFollowUpDate(
      new Date(),
      firstFollowUp.day
    );

    /*
     * Create the first follow-up.
     */
    const followUp = await createFollowUp(
      userId,
      {
        leadId,
        sequenceDay: firstFollowUp.day,
        title: firstFollowUp.title,
        scheduledFor: scheduledFor.toISOString(),
        message: null,
      }
    );

    if (!followUp) {
      return NextResponse.json(
        { error: "Failed to create follow-up." },
        { status: 500 }
      );
    }

    /*
     * Record the action in the lead timeline.
     */
    await createLeadActivity(
      userId,
      leadId,
      {
        activityType: "action_completed",
        title: "Smart follow-up started",
        description:
          `Follow-up sequence started. The first follow-up is scheduled for Day ${firstFollowUp.day}.`,
      }
    );

    return NextResponse.json(
      {
        success: true,
        followUp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Start follow-up sequence error:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong while starting the follow-up.",
      },
      { status: 500 }
    );
  }
}