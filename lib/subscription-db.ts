import { supabaseAdmin } from "@/lib/supabase-admin";

export type Plan = "free" | "pro";

export type Subscription = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  plan: string;
  status: string;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  paddle_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
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
    })
    .select()
    .single();

  if (error) {
    console.error("Create free subscription error:", error);
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
  const subscription = await getSubscription(clerkUserId);

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
 * Update a user's subscription.
 *
 * This will later be called by the Paddle webhook
 * after Paddle confirms a subscription event.
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
    console.error("Update subscription error:", error);
    return null;
  }

  return data as Subscription;
}