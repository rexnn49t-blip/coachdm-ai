import { supabaseAdmin } from "@/lib/supabase-admin";

export type TodayPriorityAction =
  | "reply"
  | "objection"
  | "follow_up"
  | "discovery"
  | "open";

export type TodayPriority = {
  leadId: string;
  name: string;
  stage: string;
  intent: string;
  temperature: string;
  reason: string;
  action: TodayPriorityAction;
  actionLabel: string;
  score: number;
};

type LeadRow = {
  id: string;
  name: string;
  stage: string;
  intent: string;
  temperature: string;
  updated_at: string;
};

type ConversationActivity = {
  lead_id: string;
  activity_type: string;
  created_at: string;
};

function getDaysSince(dateString: string) {
  const timestamp = new Date(dateString).getTime();

  if (Number.isNaN(timestamp)) {
    return Infinity;
  }

  return (
    (Date.now() - timestamp) /
    (1000 * 60 * 60 * 24)
  );
}

function getPriorityDetails(
  lead: LeadRow,
  latestActivity?: ConversationActivity
) {
  let score = 0;

  /*
   * Highest priority:
   * the lead has replied and is waiting for the coach.
   */
  if (latestActivity?.activity_type === "lead_replied") {
    return {
      score: 100,
      reason: "Replied recently and is waiting for your response",
      action: "reply" as TodayPriorityAction,
      actionLabel: "Reply Now",
    };
  }

  /*
   * Strong buying intent.
   */
  if (lead.intent === "interested") {
    score += 50;
  }

  /*
   * Hot leads get additional priority.
   */
  if (lead.temperature === "hot") {
    score += 30;
  }

  /*
   * Later sales stages generally deserve more attention.
   */
  if (
    [
      "qualification",
      "objection",
      "offer",
      "call_payment",
    ].includes(lead.stage)
  ) {
    score += 25;
  }

  /*
   * Objections should receive a specific response,
   * not a generic follow-up.
   */
  if (lead.stage === "objection") {
    score += 20;

    return {
      score,
      reason: "Lead has an objection that needs attention",
      action: "objection" as TodayPriorityAction,
      actionLabel: "Address Objection",
    };
  }

  /*
   * Leads that have been inactive for 3+ days
   * should be considered for follow-up.
   */
  const inactiveDays = getDaysSince(
    lead.updated_at
  );

  if (inactiveDays >= 3) {
    score += Math.min(
      Math.floor(inactiveDays) * 5,
      25
    );

    return {
      score,
      reason: `No activity for ${Math.floor(inactiveDays)} days`,
      action: "follow_up" as TodayPriorityAction,
      actionLabel: "Follow Up",
    };
  }

  /*
   * Early-stage leads should continue discovery.
   */
  if (
    lead.stage === "new" ||
    lead.stage === "initial_conversation" ||
    lead.stage === "discovery"
  ) {
    score += 10;

    return {
      score,
      reason: "Early conversation needs more discovery",
      action: "discovery" as TodayPriorityAction,
      actionLabel: "Continue Discovery",
    };
  }

  return {
    score,
    reason: "Lead is active and may be worth contacting",
    action: "open" as TodayPriorityAction,
    actionLabel: "Open Lead",
  };
}

export async function getTodaysPriorities(
  clerkUserId: string,
  limit = 6
): Promise<TodayPriority[]> {
  /*
   * Get active leads only.
   */
  const {
    data: leads,
    error: leadsError,
  } = await supabaseAdmin
    .from("leads")
    .select(
      "id, name, stage, intent, temperature, updated_at"
    )
    .eq("clerk_user_id", clerkUserId)
    .neq("stage", "lost")
    .neq("stage", "client");

  if (leadsError) {
    console.error(
      "Today's priorities leads error:",
      leadsError
    );

    return [];
  }

  const allLeads = (leads ?? []) as LeadRow[];

  if (allLeads.length === 0) {
    return [];
  }

  const leadIds = allLeads.map(
    (lead) => lead.id
  );

  /*
   * Get conversation activity so we can determine
   * whether the lead replied most recently.
   */
  const {
    data: activities,
    error: activitiesError,
  } = await supabaseAdmin
    .from("lead_activities")
    .select(
      "lead_id, activity_type, created_at"
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
      "Today's priorities activities error:",
      activitiesError
    );
  }

  /*
   * Keep only the latest conversation activity
   * for each lead.
   */
  const latestActivityByLead =
    new Map<string, ConversationActivity>();

  for (const activity of (activities ??
    []) as ConversationActivity[]) {
    if (
      !latestActivityByLead.has(
        activity.lead_id
      )
    ) {
      latestActivityByLead.set(
        activity.lead_id,
        activity
      );
    }
  }

  /*
   * Build the priority list.
   */
  const priorities: TodayPriority[] =
    allLeads.map((lead) => {
      const details = getPriorityDetails(
        lead,
        latestActivityByLead.get(lead.id)
      );

      return {
        leadId: lead.id,
        name: lead.name,
        stage: lead.stage,
        intent: lead.intent,
        temperature: lead.temperature,
        reason: details.reason,
        action: details.action,
        actionLabel: details.actionLabel,
        score: details.score,
      };
    });

  /*
   * Highest priority first.
   */
  return priorities
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}