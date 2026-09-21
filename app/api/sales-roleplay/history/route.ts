import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getSalesRoleplaySessions } from "@/lib/sales-roleplay";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sessions = await getSalesRoleplaySessions(userId);

    return NextResponse.json({
      sessions,
    });
  } catch (error) {
    console.error(
      "Sales roleplay history API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load roleplay history.",
      },
      {
        status: 500,
      }
    );
  }
}