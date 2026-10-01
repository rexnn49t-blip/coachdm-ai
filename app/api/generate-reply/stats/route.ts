import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  getReplyUsage,
  getUserPlan,
} from "@/lib/subscription-db";

import { getPaginatedReplies } from "@/lib/replies";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const usage = await getReplyUsage(userId);

    if (!usage) {
      return NextResponse.json(
        {
          error:
            "Unable to load AI Reply Generator usage.",
        },
        { status: 500 }
      );
    }

    const plan = await getUserPlan(userId);

    if (!plan) {
      return NextResponse.json(
        {
          error:
            "Unable to determine your current plan.",
        },
        { status: 500 }
      );
    }

    const replyData = await getPaginatedReplies(
      userId,
      1,
      1
    );

    return NextResponse.json({
      repliesUsed: usage.used,

      repliesLimit:
        usage.plan === "pro"
          ? -1
          : usage.limit,

      repliesRemaining:
        usage.plan === "pro"
          ? -1
          : Math.max(
              0,
              usage.limit - usage.used
            ),

      plan:
        plan === "pro"
          ? "pro"
          : "free",

      savedReplies: replyData.total,
    });
  } catch (error) {
    console.error(
      "Reply Generator stats API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load Reply Generator stats.",
      },
      { status: 500 }
    );
  }
}