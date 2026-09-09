import { supabaseAdmin } from "@/lib/supabase-admin";

export type FollowUpStatus =
  | "pending"
  | "sent"
  | "skipped"
  | "cancelled";

export type FollowUp = {
  id: string;
  clerk_user_id: string;
  lead_id: string;
  sequence_day: number;
  title: string;
  scheduled_for: string;
  status: FollowUpStatus;
  message: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

/* -------------------------------------------------------
   Get all follow-ups for a user
------------------------------------------------------- */

export async function getFollowUps(
  clerkUserId: string
): Promise<FollowUp[]> {
  const { data, error } = await supabaseAdmin
    .from("follow_ups")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("scheduled_for", { ascending: true });

  if (error) {
    console.error("Get follow-ups error:", error);
    return [];
  }

  return (data ?? []) as FollowUp[];
}

/* -------------------------------------------------------
   Get follow-ups for a specific lead
------------------------------------------------------- */

export async function getLeadFollowUps(
  clerkUserId: string,
  leadId: string
): Promise<FollowUp[]> {
  const { data, error } = await supabaseAdmin
    .from("follow_ups")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("lead_id", leadId)
    .order("scheduled_for", { ascending: true });

  if (error) {
    console.error("Get lead follow-ups error:", error);
    return [];
  }

  return (data ?? []) as FollowUp[];
}

/* -------------------------------------------------------
   Get follow-ups due today
------------------------------------------------------- */

export async function getTodaysFollowUps(
  clerkUserId: string
): Promise<FollowUp[]> {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabaseAdmin
    .from("follow_ups")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("status", "pending")
    .gte("scheduled_for", startOfDay.toISOString())
    .lte("scheduled_for", endOfDay.toISOString())
    .order("scheduled_for", { ascending: true });

  if (error) {
    console.error("Get today's follow-ups error:", error);
    return [];
  }

  return (data ?? []) as FollowUp[];
}

/* -------------------------------------------------------
   Get overdue follow-ups
------------------------------------------------------- */

export async function getOverdueFollowUps(
  clerkUserId: string
): Promise<FollowUp[]> {
  const { data, error } = await supabaseAdmin
    .from("follow_ups")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("status", "pending")
    .lt("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true });

  if (error) {
    console.error("Get overdue follow-ups error:", error);
    return [];
  }

  return (data ?? []) as FollowUp[];
}

/* -------------------------------------------------------
   Create a follow-up
------------------------------------------------------- */

export async function createFollowUp(
  clerkUserId: string,
  followUp: {
    leadId: string;
    sequenceDay: number;
    title: string;
    scheduledFor: string;
    message?: string | null;
  }
): Promise<FollowUp | null> {
  const { data, error } = await supabaseAdmin
    .from("follow_ups")
    .insert({
      clerk_user_id: clerkUserId,
      lead_id: followUp.leadId,
      sequence_day: followUp.sequenceDay,
      title: followUp.title,
      scheduled_for: followUp.scheduledFor,
      status: "pending",
      message: followUp.message?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Create follow-up error:", error);
    return null;
  }

  return data as FollowUp;
}

/* -------------------------------------------------------
   Update a follow-up
------------------------------------------------------- */

export async function updateFollowUp(
  clerkUserId: string,
  followUpId: string,
  updates: {
    scheduledFor?: string;
    status?: FollowUpStatus;
    message?: string | null;
    sentAt?: string | null;
  }
): Promise<FollowUp | null> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.scheduledFor !== undefined) {
    payload.scheduled_for = updates.scheduledFor;
  }

  if (updates.status !== undefined) {
    payload.status = updates.status;
  }

  if (updates.message !== undefined) {
    payload.message = updates.message?.trim() || null;
  }

  if (updates.sentAt !== undefined) {
    payload.sent_at = updates.sentAt;
  }

  const { data, error } = await supabaseAdmin
    .from("follow_ups")
    .update(payload)
    .eq("id", followUpId)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error("Update follow-up error:", error);
    return null;
  }

  return data as FollowUp;
}

/* -------------------------------------------------------
   Mark follow-up as sent
------------------------------------------------------- */

export async function markFollowUpSent(
  clerkUserId: string,
  followUpId: string
): Promise<FollowUp | null> {
  return updateFollowUp(clerkUserId, followUpId, {
    status: "sent",
    sentAt: new Date().toISOString(),
  });
}

/* -------------------------------------------------------
   Skip follow-up
------------------------------------------------------- */

export async function skipFollowUp(
  clerkUserId: string,
  followUpId: string
): Promise<FollowUp | null> {
  return updateFollowUp(clerkUserId, followUpId, {
    status: "skipped",
  });
}

/* -------------------------------------------------------
   Cancel follow-up
------------------------------------------------------- */

export async function cancelFollowUp(
  clerkUserId: string,
  followUpId: string
): Promise<FollowUp | null> {
  return updateFollowUp(clerkUserId, followUpId, {
    status: "cancelled",
  });
}

/* -------------------------------------------------------
   Delete a follow-up
------------------------------------------------------- */

export async function deleteFollowUp(
  clerkUserId: string,
  followUpId: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("follow_ups")
    .delete()
    .eq("id", followUpId)
    .eq("clerk_user_id", clerkUserId);

  if (error) {
    console.error("Delete follow-up error:", error);
    return false;
  }

  return true;
}