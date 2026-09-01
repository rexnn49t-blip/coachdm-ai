import { supabaseAdmin } from "@/lib/supabase-admin";

export type LeadActivityType =
  | "lead_created"
  | "ai_guidance_generated"
  | "message_sent"
  | "lead_replied"
  | "stage_updated"
  | "intent_updated"
  | "temperature_updated"
  | "note_added"
  | "action_completed"
  | "lead_converted";

export type LeadActivity = {
  id: string;

  lead_id: string;

  clerk_user_id: string;

  activity_type: LeadActivityType;

  title: string;

  description: string | null;

  created_at: string;
};

/**
 * Get all activities for a lead.
 */
export async function getLeadActivities(
  clerkUserId: string,
  leadId: string
): Promise<LeadActivity[]> {
  const { data, error } = await supabaseAdmin
    .from("lead_activities")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("lead_id", leadId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get lead activities error:",
      error
    );

    return [];
  }

  return (data ?? []) as LeadActivity[];
}

/**
 * Create a new activity.
 */
export async function createLeadActivity(
  clerkUserId: string,
  leadId: string,
  activity: {
    activityType: LeadActivityType;
    title: string;
    description?: string;
  }
): Promise<LeadActivity | null> {
  const { data, error } = await supabaseAdmin
    .from("lead_activities")
    .insert({
      clerk_user_id: clerkUserId,

      lead_id: leadId,

      activity_type:
        activity.activityType,

      title: activity.title,

      description:
        activity.description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Create lead activity error:",
      error
    );

    return null;
  }

  return data as LeadActivity;
}

/**
 * Delete an activity.
 */
export async function deleteLeadActivity(
  clerkUserId: string,
  activityId: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("lead_activities")
    .delete()
    .eq("id", activityId)
    .eq("clerk_user_id", clerkUserId);

  if (error) {
    console.error(
      "Delete lead activity error:",
      error
    );

    return false;
  }

  return true;
}