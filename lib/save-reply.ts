import { supabaseAdmin } from "./supabase-admin";

type SaveReplyParams = {
  clerkUserId: string;
  leadMessage: string;
  reply: string;
  tone: string;
  length: string;
};

export async function saveReply({
  clerkUserId,
  leadMessage,
  reply,
  tone,
  length,
}: SaveReplyParams) {
  const { error } = await supabaseAdmin
    .from("replies")
    .insert({
      clerk_user_id: clerkUserId,
      lead_message: leadMessage,
      ai_reply: reply,
      tone,
      length,
    });

  if (error) {
    console.error(error);
  }
}