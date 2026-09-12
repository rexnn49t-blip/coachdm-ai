import { supabaseAdmin } from "@/lib/supabase-admin";

export type SmartNotificationType =
  | "lead_reply"
  | "follow_up_due"
  | "objection"
  | "hot_lead";

export type SmartNotification = {
  id: string;
  type: SmartNotificationType;
  title: string;
  description: string;
  actionLabel: string;
  leadId: string;
  createdAt: string;
  priority: number;
};

type LeadRow = {
  id: string;
  name: string;
  stage: string;
  intent: string;
  temperature: string;
  updated_at: string;
};

type ActivityRow = {
  id: string;
  lead_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
};

type FollowUpRow = {
  id: string;
  lead_id: string;
  sequence_day: number;
  title: string;
  scheduled_for: string;
  status: string;
};

export async function getSmartNotifications(
  clerkUserId: string
): Promise<SmartNotification[]> {
  const notifications: SmartNotification[] = [];

  /*
   * Get active leads.
   *
   * Lost and converted/client leads should no longer
   * generate action notifications.
   */
  const { data: leads, error: leadsError } =
    await supabaseAdmin
      .from("leads")
      .select(
        "id, name, stage, intent, temperature, updated_at"
      )
      .eq("clerk_user_id", clerkUserId)
      .not("stage", "in", '("lost","client")');

  if (leadsError) {
    console.error(
      "Get notification leads error:",
      leadsError
    );

    return [];
  }

  const leadRows = (leads ?? []) as LeadRow[];

  if (leadRows.length === 0) {
    return [];
  }

  const leadMap = new Map(
    leadRows.map((lead) => [lead.id, lead])
  );

  const leadIds = leadRows.map(
    (lead) => lead.id
  );

  /*
   * Get conversation activities.
   *
   * We need both lead replies and coach messages so we
   * can determine whether the latest conversation event
   * is still waiting for the coach.
   */
  const {
    data: activities,
    error: activitiesError,
  } = await supabaseAdmin
    .from("lead_activities")
    .select(
      "id, lead_id, activity_type, title, description, created_at"
    )
    .eq("clerk_user_id", clerkUserId)
    .in("lead_id", leadIds)
    .in("activity_type", [
      "lead_replied",
      "message_sent",
    ])
    .order("created_at", {
      ascending: false,
    });

  if (activitiesError) {
    console.error(
      "Get notification activities error:",
      activitiesError
    );
  }

  const conversationActivities =
    (activities ?? []) as ActivityRow[];

  /*
   * Determine the latest conversation activity for
   * every lead.
   *
   * Because the query is ordered newest first, the first
   * activity we encounter for a lead is its latest event.
   */
  const latestConversationByLead =
    new Map<string, ActivityRow>();

  for (const activity of conversationActivities) {
    if (
      latestConversationByLead.has(
        activity.lead_id
      )
    ) {
      continue;
    }

    latestConversationByLead.set(
      activity.lead_id,
      activity
    );
  }

  /*
   * Leads whose latest conversation activity is a
   * lead reply are waiting for the coach.
   */
  const repliedLeadIds = new Set<string>();

  for (const [
    leadId,
    activity,
  ] of latestConversationByLead) {
    if (
      activity.activity_type !==
      "lead_replied"
    ) {
      continue;
    }

    const lead = leadMap.get(leadId);

    if (!lead) {
      continue;
    }

    repliedLeadIds.add(leadId);

    const isHot =
      lead.temperature === "hot" ||
      lead.intent === "interested";

    notifications.push({
      id: `reply-${activity.id}`,
      type: "lead_reply",
      title: `${lead.name} is waiting for a reply`,
      description: isHot
        ? `${lead.name} replied recently and is currently marked Hot.`
        : `${lead.name} replied recently and may need your attention.`,
      actionLabel: "Reply",
      leadId: lead.id,
      createdAt: activity.created_at,
      priority: isHot ? 100 : 90,
    });
  }

  /*
   * Get follow-ups that are currently due.
   */
  const now = new Date().toISOString();

  const {
    data: followUps,
    error: followUpsError,
  } = await supabaseAdmin
    .from("follow_ups")
    .select(
      "id, lead_id, sequence_day, title, scheduled_for, status"
    )
    .eq("clerk_user_id", clerkUserId)
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .order("scheduled_for", {
      ascending: true,
    });

  if (followUpsError) {
    console.error(
      "Get notification follow-ups error:",
      followUpsError
    );
  }

  const dueFollowUps =
    (followUps ?? []) as FollowUpRow[];

  /*
   * Only show a follow-up notification when the lead
   * isn't currently waiting for a response from the coach.
   *
   * If the lead has just replied, the reply notification
   * is more important and the coach should respond first.
   */
  for (const followUp of dueFollowUps) {
    const lead = leadMap.get(
      followUp.lead_id
    );

    if (!lead) {
      continue;
    }

    if (repliedLeadIds.has(lead.id)) {
      continue;
    }

    notifications.push({
      id: `follow-up-${followUp.id}`,
      type: "follow_up_due",
      title: `Follow up with ${lead.name}`,
      description: `${followUp.title} is due now.`,
      actionLabel: "View follow-up",
      leadId: lead.id,
      createdAt: followUp.scheduled_for,
      priority:
        lead.temperature === "hot"
          ? 95
          : 80,
    });
  }

  /*
   * Detect leads currently sitting in the objection
   * stage.
   *
   * We don't show an objection notification when:
   * - the lead is already waiting for a reply
   * - the lead has been converted/lost
   *
   * The lead's updated_at gives this notification a
   * stable timestamp instead of generating a new date
   * every time the navbar refreshes.
   */
  for (const lead of leadRows) {
    if (
      lead.stage !== "objection" ||
      repliedLeadIds.has(lead.id)
    ) {
      continue;
    }

    notifications.push({
      id: `objection-${lead.id}`,
      type: "objection",
      title: `${lead.name} has an objection`,
      description:
        "Consider addressing the concern before sending another follow-up.",
      actionLabel: "Handle objection",
      leadId: lead.id,
      createdAt: lead.updated_at,
      priority: 70,
    });
  }

  /*
   * Sort by importance first, then newest activity.
   */
  notifications.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  return notifications;
}