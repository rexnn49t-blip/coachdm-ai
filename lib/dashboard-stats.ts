import { supabaseAdmin } from "@/lib/supabase-admin";
import { ensureMonthlyReplyReset } from "@/lib/subscription-db";

export type DashboardStats = {
  totalReplies: number;
  repliesToday: number;
  repliesThisMonth: number;
  favoriteTone: string;

  activeLeads: number;
  followUpsDue: number;

  plan: "FREE" | "PRO";
  monthlyLimit: number | null;
};

export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  /*
   * Make sure the user's monthly usage period
   * is current before calculating statistics.
   */
  const subscription =
    await ensureMonthlyReplyReset(userId);

  /*
   * Get all AI generations.
   */
  const {
    data: generations,
    error: generationsError,
  } = await supabaseAdmin
    .from("reply_generations")
    .select("tone, created_at")
    .eq("clerk_user_id", userId);

  if (generationsError) {
    console.error(
      "Dashboard generation stats error:",
      generationsError
    );

    throw generationsError;
  }

  const allGenerations = generations ?? [];

  const now = new Date();

  /*
   * Today's date.
   */
  const today =
    now.toISOString().split("T")[0];

  /*
   * Replies generated today.
   */
  const repliesToday =
    allGenerations.filter(
      (generation) =>
        generation.created_at.slice(0, 10) ===
        today
    ).length;

  /*
   * Determine the current usage period.
   */
  let monthlyStart: Date;

  if (
    subscription?.plan?.toLowerCase() === "free" &&
    subscription.replies_reset_at
  ) {
    monthlyStart = new Date(
      subscription.replies_reset_at
    );
  } else {
    monthlyStart = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        1
      )
    );
  }

  /*
   * Replies generated during the
   * current usage period.
   */
  const repliesThisMonth =
    allGenerations.filter((generation) => {
      const createdAt = new Date(
        generation.created_at
      );

      return createdAt >= monthlyStart;
    }).length;

  /*
   * Favorite tone.
   */
  const toneCount: Record<string, number> = {};

  for (const generation of allGenerations) {
    if (!generation.tone) continue;

    toneCount[generation.tone] =
      (toneCount[generation.tone] ?? 0) + 1;
  }

  const favoriteTone =
    Object.entries(toneCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "-";

  /*
   * =====================================================
   * LEAD STATS
   * =====================================================
   *
   * Reuse the existing `leads` table.
   *
   * Active leads:
   * Everything currently in the pipeline except
   * converted clients and lost leads.
   *
   * Follow-ups:
   * Leads currently sitting in the `follow_up`
   * stage of the Lead Journey.
   */
  const {
    data: leads,
    error: leadsError,
  } = await supabaseAdmin
    .from("leads")
    .select("stage")
    .eq("clerk_user_id", userId);

  if (leadsError) {
    console.error(
      "Dashboard lead stats error:",
      leadsError
    );

    throw leadsError;
  }

  const allLeads = leads ?? [];

  /*
   * Active leads are leads that have not yet been
   * converted or marked as lost.
   */
  const activeLeads =
    allLeads.filter(
      (lead) =>
        lead.stage !== "client" &&
        lead.stage !== "lost"
    ).length;

  /*
   * Follow-ups due are leads currently at the
   * follow_up stage.
   */
  const followUpsDue =
    allLeads.filter(
      (lead) => lead.stage === "follow_up"
    ).length;

  /*
   * Determine current plan.
   */
  const isPro =
    subscription?.plan?.toLowerCase() === "pro" &&
    ["active", "trialing"].includes(
      subscription?.status?.toLowerCase() ?? ""
    );

  const plan: "FREE" | "PRO" = isPro
    ? "PRO"
    : "FREE";

  /*
   * Free users use their configured limit.
   * Pro users are unlimited.
   */
  const monthlyLimit = isPro
    ? null
    : subscription?.replies_limit ?? 3;

  return {
    /*
     * Lifetime AI generations.
     */
    totalReplies: allGenerations.length,

    /*
     * AI generations today.
     */
    repliesToday,

    /*
     * AI generations during the current
     * monthly usage period.
     */
    repliesThisMonth,

    favoriteTone,

    /*
     * Lead pipeline statistics.
     */
    activeLeads,
    followUpsDue,

    /*
     * Subscription statistics.
     */
    plan,
    monthlyLimit,
  };
}