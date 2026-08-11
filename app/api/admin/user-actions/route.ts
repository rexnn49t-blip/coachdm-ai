import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  req: NextRequest
) {
  try {
    // -----------------------------------------
    // AUTHENTICATION
    // -----------------------------------------

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

    // -----------------------------------------
    // ADMIN CHECK
    // -----------------------------------------

    if (
      userId !==
      process.env.ADMIN_USER_ID
    ) {
      return NextResponse.json(
        {
          error: "Forbidden.",
        },
        {
          status: 403,
        }
      );
    }

    // -----------------------------------------
    // REQUEST
    // -----------------------------------------

    const body = await req.json();

    const targetUserId =
      body?.userId;

    const action =
      body?.action;

    if (!targetUserId) {
      return NextResponse.json(
        {
          error:
            "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      action !== "upgrade" &&
      action !== "downgrade"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid admin action.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // PREVENT ADMIN FROM MODIFYING THEMSELVES
    // -----------------------------------------

    if (targetUserId === userId) {
      return NextResponse.json(
        {
          error:
            "You cannot change your own admin subscription.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // CHECK TARGET USER
    // -----------------------------------------

    const {
      data: existingUser,
      error: lookupError,
    } = await supabaseAdmin
      .from("subscriptions")
      .select(
        "id, clerk_user_id, email, plan, status, paddle_subscription_id"
      )
      .eq(
        "clerk_user_id",
        targetUserId
      )
      .maybeSingle();

    if (lookupError) {
      console.error(
        "Admin user lookup error:",
        lookupError
      );

      return NextResponse.json(
        {
          error:
            "Could not find the user.",
        },
        {
          status: 500,
        }
      );
    }

    if (!existingUser) {
      return NextResponse.json(
        {
          error:
            "Subscription record not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // UPDATE PLAN
    // -----------------------------------------

    const newPlan =
      action === "upgrade"
        ? "pro"
        : "free";

    const newStatus =
      action === "upgrade"
        ? "active"
        : "active";

    const { data, error } =
      await supabaseAdmin
        .from("subscriptions")
        .update({
          plan: newPlan,
          status: newStatus,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "clerk_user_id",
          targetUserId
        )
        .select()
        .single();

    if (error) {
      console.error(
        "Admin subscription update error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to update the user's plan.",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      `Admin ${action}:`,
      targetUserId
    );

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error(
      "Admin user action error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}