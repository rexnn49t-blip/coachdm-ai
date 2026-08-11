import { supabaseAdmin } from "@/lib/supabase-admin";

export type Plan = "free" | "pro";

export type Subscription = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  plan: Plan;
  status: string;

  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  paddle_price_id: string | null;

  current_period_start: string | null;
  current_period_end: string | null;

  cancel_at_period_end: boolean;

  replies_used: number;
  replies_limit: number;
  replies_reset_at: string;

  created_at: string;
  updated_at: string;
};

/**
 * Get the user's subscription.
 */
export async function getSubscription(
  clerkUserId: string
): Promise<Subscription | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    console.error("Get subscription error:", error);
    return null;
  }

  return data as Subscription | null;
}

/**
 * Create a FREE subscription for a new user.
 */
export async function createFreeSubscription(
  clerkUserId: string,
  email?: string
): Promise<Subscription | null> {
  const existing = await getSubscription(clerkUserId);

  if (existing) {
    return existing;
  }

const { data, error } = await supabaseAdmin
  .from("subscriptions")
  .insert({
    clerk_user_id: clerkUserId,
    email: email ?? null,
    plan: "free",
    status: "active",
    replies_used: 0,
    replies_limit: 3,
    replies_reset_at: new Date().toISOString(),
  })
  .select()
  .single();

  if (error) {
    console.error(
      "Create free subscription error:",
      error
    );

    return null;
  }

  return data as Subscription;
}

/**
 * Check whether a user is currently on Pro.
 */
export async function isPro(
  clerkUserId: string
): Promise<boolean> {
  const subscription =
    await getSubscription(clerkUserId);

  return (
    subscription?.plan === "pro" &&
    ["active", "trialing"].includes(
      subscription.status.toLowerCase()
    )
  );
}

/**
 * Get the user's current plan.
 */
export async function getUserPlan(
  clerkUserId: string
): Promise<Plan> {
  const pro = await isPro(clerkUserId);

  return pro ? "pro" : "free";
}

/**
 * Reset Free-plan reply usage when a new month begins.
 */
export async function ensureMonthlyReplyReset(
  clerkUserId: string
): Promise<Subscription | null> {
  const subscription = await getSubscription(clerkUserId);

  if (!subscription) {
    return null;
  }

  // Pro users are unlimited, so no monthly reset is required.
  if (subscription.plan === "pro") {
    return subscription;
  }

  const resetDate = new Date(subscription.replies_reset_at);
  const now = new Date();

  const sameMonth =
    resetDate.getUTCFullYear() === now.getUTCFullYear() &&
    resetDate.getUTCMonth() === now.getUTCMonth();

  if (sameMonth) {
    return subscription;
  }

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      replies_used: 0,
      replies_reset_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error(
      "Monthly reply reset error:",
      error
    );

    return subscription;
  }

  return data as Subscription;
}

/**
 * Check whether the user can generate
 * another AI reply.
 *
 * Pro users have unlimited replies.
 *
 * Free users have a limit of 3 replies.
 */
export async function canGenerateReply(
  clerkUserId: string
): Promise<boolean> {
  const subscription =
    await ensureMonthlyReplyReset(clerkUserId);

  if (!subscription) {
    return false;
  }

  /*
   * Pro users have unlimited replies.
   */
  if (
    subscription.plan === "pro" &&
    ["active", "trialing"].includes(
      subscription.status.toLowerCase()
    )
  ) {
    return true;
  }

  /*
   * Free users have 3 replies per month.
   */
  return (
    subscription.plan === "free" &&
    subscription.status.toLowerCase() === "active" &&
    subscription.replies_used <
      subscription.replies_limit
  );
}

/**
 * Get the number of replies the user
 * has already used.
 */
export async function getReplyUsage(
  clerkUserId: string
): Promise<{
  used: number;
  limit: number;
  plan: Plan;
} | null> {
  const subscription =
    await getSubscription(clerkUserId);

  if (!subscription) {
    return null;
  }

  return {
    used: subscription.replies_used,
    limit:
      subscription.plan === "pro"
        ? -1
        : subscription.replies_limit,
    plan: subscription.plan,
  };
}

/**
 * Increment the user's reply usage.
 *
 * Pro users are not limited, but we still
 * track their usage for analytics.
 */
export async function incrementReplyUsage(
  clerkUserId: string
): Promise<Subscription | null> {
  const subscription =
    await getSubscription(clerkUserId);

  if (!subscription) {
    console.error(
      "Cannot increment usage: subscription not found."
    );

    return null;
  }

  const newUsage =
    subscription.replies_used + 1;

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      replies_used: newUsage,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error(
      "Increment reply usage error:",
      error
    );

    return null;
  }

  return data as Subscription;
}

/**
 * Reset reply usage.
 *
 * This will be used when we implement
 * the monthly usage reset.
 */
export async function resetReplyUsage(
  clerkUserId: string
): Promise<Subscription | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      replies_used: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error(
      "Reset reply usage error:",
      error
    );

    return null;
  }

  return data as Subscription;
}

/**
 * Update a user's subscription.
 *
 * Called by the Paddle webhook after Paddle
 * confirms a subscription event.
 */
export async function updateSubscription(
  clerkUserId: string,
  updates: Partial<
    Pick<
      Subscription,
      | "email"
      | "plan"
      | "status"
      | "paddle_customer_id"
      | "paddle_subscription_id"
      | "paddle_price_id"
      | "current_period_start"
      | "current_period_end"
      | "cancel_at_period_end"
    >
  >
): Promise<Subscription | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error(
      "Update subscription error:",
      error
    );

    return null;
  }

  return data as Subscription;
}