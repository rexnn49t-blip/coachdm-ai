import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("replies")
    .select(
      `
      lead_message,
      ai_reply,
      tone,
      length,
      favorite,
      created_at
      `
    )
    .eq("clerk_user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  let text = `CoachDM AI Reply Export\n`;
  text += `Exported: ${new Date().toLocaleString()}\n`;
  text += `${"=".repeat(70)}\n\n`;

  data.forEach((reply, index) => {
    text += `Reply #${index + 1}\n\n`;

    text += `Lead Message:\n`;
    text += `${reply.lead_message}\n\n`;

    text += `AI Reply:\n`;
    text += `${reply.ai_reply}\n\n`;

    text += `Tone: ${reply.tone}\n`;
    text += `Length: ${reply.length}\n`;
    text += `Favorite: ${reply.favorite ? "Yes" : "No"}\n`;
    text += `Created: ${new Date(
      reply.created_at
    ).toLocaleString()}\n`;

    text += `\n${"-".repeat(70)}\n\n`;
  });

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition":
        'attachment; filename="coachdm-replies.txt"',
    },
  });
}