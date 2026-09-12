import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getSmartNotifications } from "@/lib/notifications";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const notifications = await getSmartNotifications(userId);

    return NextResponse.json({
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error("Notifications API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load notifications.",
      },
      {
        status: 500,
      }
    );
  }
}