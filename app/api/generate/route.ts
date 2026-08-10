import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Check authentication
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get Clerk user
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 401 }
    );
  }

  const email =
    user.primaryEmailAddress?.emailAddress ?? "";

  // Your AI generation code starts here

  return NextResponse.json({
    success: true,
    userId,
    email,
  });
}