import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  saveSalesRoleplaySession,
  SalesRoleplayEvaluation,
  SalesRoleplayMessage,
  SalesRoleplayScenario,
} from "@/lib/sales-roleplay";

const validScenarios: SalesRoleplayScenario[] = [
  "interested",
  "skeptical",
  "price",
  "hesitant",
];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const scenario = body.scenario as SalesRoleplayScenario;
    const evaluation = body.evaluation as SalesRoleplayEvaluation;
    const conversation = body.conversation as SalesRoleplayMessage[];

    if (!validScenarios.includes(scenario)) {
      return NextResponse.json(
        { error: "Invalid roleplay scenario." },
        { status: 400 }
      );
    }

    if (!evaluation) {
      return NextResponse.json(
        { error: "Missing roleplay evaluation." },
        { status: 400 }
      );
    }

    if (!Array.isArray(conversation)) {
      return NextResponse.json(
        { error: "Invalid conversation." },
        { status: 400 }
      );
    }

    const session = await saveSalesRoleplaySession({
      clerkUserId: userId,
      scenario,
      evaluation,
      conversation,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unable to save roleplay session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Sales roleplay save API error:", error);

    return NextResponse.json(
      { error: "Unable to save roleplay session." },
      { status: 500 }
    );
  }
}