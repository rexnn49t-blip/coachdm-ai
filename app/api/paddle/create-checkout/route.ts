import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { paddle } from "@/lib/paddle";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await currentUser();

    const email =
      user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 400 }
      );
    }

    const priceId =
      process.env.PADDLE_PRO_PRICE_ID;

    if (!priceId) {
      console.error(
        "PADDLE_PRO_PRICE_ID is not configured."
      );

      return NextResponse.json(
        { error: "Paddle price is not configured." },
        { status: 500 }
      );
    }

   const transaction =
  await paddle.transactions.create({
    items: [
      {
        priceId,
        quantity: 1,
      },
    ],

    customData: {
      clerk_user_id: userId,
      email,
    },
  });

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error(
      "Paddle checkout creation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create Paddle checkout.",
      },
      {
        status: 500,
      }
    );
  }
}