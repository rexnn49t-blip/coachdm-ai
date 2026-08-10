import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      leadMessage,
      reply,
      tone,
      length,
    } = await req.json();

    const { error } = await supabaseAdmin
      .from("replies")
      .insert({
        clerk_user_id: userId,
        lead_message: leadMessage,
        ai_reply: reply,
        tone,
        length,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save reply.",
      },
      {
        status: 500,
      }
    );
  }
}