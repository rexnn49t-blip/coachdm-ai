import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete saved replies
    const { error: repliesError } = await supabaseAdmin
      .from("replies")
      .delete()
      .eq("clerk_user_id", userId);

    if (repliesError) {
      console.error(repliesError);

      return NextResponse.json(
        { error: "Failed to delete replies." },
        { status: 500 }
      );
    }

    // Delete user settings (if table exists)
    await supabaseAdmin
      .from("user_settings")
      .delete()
      .eq("clerk_user_id", userId);

    // Delete user record (if table exists)
    await supabaseAdmin
      .from("users")
      .delete()
      .eq("clerk_user_id", userId);

    // Delete Clerk account
    const clerk = await clerkClient();

    await clerk.users.deleteUser(userId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to delete account.",
      },
      {
        status: 500,
      }
    );
  }
}