import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  getLeadSearchUsage,
} from "@/lib/subscription-db";

import {
  getLeads,
} from "@/lib/leads";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const usage =
      await getLeadSearchUsage(userId);

    if (!usage) {
      return NextResponse.json(
        {
          error:
            "Unable to load Lead Generator usage.",
        },
        { status: 500 }
      );
    }

    const leads =
      await getLeads(userId);

    const savedByAI =
      leads.filter(
        (lead) =>
          lead.source ===
          "AI Web Prospect Finder"
      ).length;

    return NextResponse.json({
      searchesUsed: usage.used,
      searchesLimit: usage.limit,
      searchesRemaining:
        usage.remaining,
      plan: usage.plan,
      savedLeads: savedByAI,
    });
  } catch (error) {
    console.error(
      "Lead Generator stats error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load Lead Generator stats.",
      },
      { status: 500 }
    );
  }
}