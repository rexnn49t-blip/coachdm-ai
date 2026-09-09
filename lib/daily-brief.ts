import { supabaseAdmin } from "@/lib/supabase-admin";

export type DailyBriefLead = {
  id: string;
  name: string;
  stage: string;
  intent: string;
  temperature: string;
  updated_at: string;
  reason: string;
};

export type DailyBrief = {
  hotLeads: DailyBriefLead[];
  repliesWaiting: DailyBriefLead[];
  followUps: DailyBriefLead[];
  attentionNeeded: DailyBriefLead[];
  bestOpportunity: DailyBriefLead | null;
};

type LeadActivity = {
  id: string;
  lead_id: string;
  activity_type: string;
  created_at: string;
};

export async function getDailyCoachBrief(
  clerkUserId: string
): Promise<DailyBrief> {
  const { data: leads, error: leadsError } =
    await supabaseAdmin
      .from("leads")
      .select(
        "id, name, stage, intent, temperature, updated_at"
      )
      .eq("clerk_user_id", clerkUserId)
      .neq("stage", "lost")
      .order("updated_at", { ascending: false });

  if (leadsError) {
    console.error(
      "Daily brief leads error:",
      leadsError
    );

    return {
      hotLeads: [],
      repliesWaiting: [],
      followUps: [],
      attentionNeeded: [],
      bestOpportunity: null,
    };
  }

  const allLeads = leads ?? [];

  /*
   * Get recent conversation activities.
   *
   * We use these to determine whether the latest
   * conversation event came from the lead or coach.
   */
  const { data: activities, error: activitiesError } =
    await supabaseAdmin
      .from("lead_activities")
      .select(
        "id, lead_id, activity_type, created_at"
      )
      .eq("clerk_user_id", clerkUserId)
      .in("activity_type", [
        "lead_replied",
        "message_sent",
      ])
      .order("created_at", {
        ascending: false,
      });

  if (activitiesError) {
    console.error(
      "Daily brief activities error:",
      activitiesError
    );
  }

  const conversationActivities =
    (activities ?? []) as LeadActivity[];

  /*
   * Build a map containing the latest conversation
   * activity for every lead.
   */
  const latestConversationByLead =
    new Map<string, LeadActivity>();

  for (const activity of conversationActivities) {
    if (
      !latestConversationByLead.has(
        activity.lead_id
      )
    ) {
      latestConversationByLead.set(
        activity.lead_id,
        activity
      );
    }
  }

  /*
   * HOT LEADS
   *
   * Strong buying signals:
   * - Hot temperature
   * - Interested intent
   * - Later-stage conversations
   */
  const hotLeads: DailyBriefLead[] = allLeads
    .filter((lead) => {
      const strongTemperature =
        lead.temperature === "hot";

      const interested =
        lead.intent === "interested";

      const strongStage = [
        "discovery",
        "qualification",
        "objection",
        "offer",
        "call_payment",
      ].includes(lead.stage);

      return (
        strongTemperature ||
        (interested && strongStage)
      );
    })
    .slice(0, 5)
    .map((lead) => ({
      ...lead,
      reason:
        lead.intent === "interested"
          ? "Showing strong buying interest"
          : "High-priority lead",
    }));

  /*
   * REPLIES WAITING
   *
   * A lead appears here ONLY when the latest
   * conversation activity is lead_replied.
   *
   * This prevents already-handled conversations
   * from appearing as pending.
   */
  const repliesWaiting: DailyBriefLead[] =
    allLeads
      .filter((lead) => {
        const latestActivity =
          latestConversationByLead.get(lead.id);

        return (
          latestActivity?.activity_type ===
          "lead_replied"
        );
      })
      .slice(0, 5)
      .map((lead) => ({
        ...lead,
        reason: "Waiting for your response",
      }));

  /*
   * FOLLOW UPS
   */
  const followUps: DailyBriefLead[] = allLeads
    .filter((lead) =>
      ["follow_up", "objection"].includes(
        lead.stage
      )
    )
    .slice(0, 5)
    .map((lead) => ({
      ...lead,
      reason:
        lead.stage === "follow_up"
          ? "Follow-up needed"
          : "Objection needs attention",
    }));

  /*
   * ATTENTION NEEDED
   *
   * Interested leads that have not been updated
   * for at least 3 days.
   */
  const now = Date.now();

  const attentionNeeded: DailyBriefLead[] =
    allLeads
      .filter((lead) => {
        if (lead.intent !== "interested") {
          return false;
        }

        const updatedAt = new Date(
          lead.updated_at
        ).getTime();

        if (Number.isNaN(updatedAt)) {
          return false;
        }

        const daysSinceUpdate =
          (now - updatedAt) /
          (1000 * 60 * 60 * 24);

        return daysSinceUpdate >= 3;
      })
      .slice(0, 5)
      .map((lead) => ({
        ...lead,
        reason:
          "Interested lead hasn't been contacted recently",
      }));

  /*
   * BEST OPPORTUNITY
   *
   * Score leads based on:
   *
   * Hot temperature       +40
   * Interested intent     +40
   * Advanced stage        +20
   * Waiting for response  +10
   */
  const sortedOpportunities = [...allLeads].sort(
    (a, b) => {
      const score = (
        lead: (typeof allLeads)[number]
      ) => {
        let value = 0;

        if (lead.temperature === "hot") {
          value += 40;
        }

        if (lead.intent === "interested") {
          value += 40;
        }

        if (
          [
            "qualification",
            "objection",
            "offer",
            "call_payment",
          ].includes(lead.stage)
        ) {
          value += 20;
        }

        const latestActivity =
          latestConversationByLead.get(
            lead.id
          );

        if (
          latestActivity?.activity_type ===
          "lead_replied"
        ) {
          value += 10;
        }

        return value;
      };

      return score(b) - score(a);
    }
  );

  const best = sortedOpportunities[0];

  const bestOpportunity: DailyBriefLead | null =
    best
      ? {
          ...best,
          reason:
            "Strongest opportunity based on intent, temperature, stage, and recent conversation activity",
        }
      : null;

  return {
    hotLeads,
    repliesWaiting,
    followUps,
    attentionNeeded,
    bestOpportunity,
  };
}