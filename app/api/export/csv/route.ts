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
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  const rows = [
    [
      "Lead Message",
      "AI Reply",
      "Tone",
      "Length",
      "Favorite",
      "Created At",
    ],
    ...data.map((reply) => [
      reply.lead_message,
      reply.ai_reply,
      reply.tone,
      reply.length,
      reply.favorite ? "Yes" : "No",
      new Date(reply.created_at).toLocaleString(),
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) =>
          `"${String(cell).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        'attachment; filename="coachdm-replies.csv"',
    },
  });
}