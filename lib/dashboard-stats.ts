import { supabaseAdmin } from "@/lib/supabase-admin";

export type DashboardStats = {
  totalReplies: number;
  repliesToday: number;
  repliesThisMonth: number;
  favoriteTone: string;

  plan: "FREE" | "PRO";
  monthlyLimit: number | null;
};

export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  // Get all replies
  const { data: replies, error: repliesError } = await supabaseAdmin
    .from("replies")
    .select("tone, created_at")
    .eq("clerk_user_id", userId);

  if (repliesError) {
    throw repliesError;
  }

  const allReplies = replies ?? [];

  const now = new Date();

  const today = now.toISOString().split("T")[0];

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Replies today
  const repliesToday = allReplies.filter(
    (reply) => reply.created_at.slice(0, 10) === today
  ).length;

  // Replies this month
  const repliesThisMonth = allReplies.filter((reply) => {
    const date = new Date(reply.created_at);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  // Favorite tone
  const toneCount: Record<string, number> = {};

  for (const reply of allReplies) {
    toneCount[reply.tone] =
      (toneCount[reply.tone] ?? 0) + 1;
  }

  const favoriteTone =
    Object.entries(toneCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "-";

  // Subscription
  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("plan")
    .eq("clerk_user_id", userId)
    .single();

  const plan: "FREE" | "PRO" =
    subscription?.plan === "PRO"
      ? "PRO"
      : "FREE";

  // Free users get 10 replies/month
  const monthlyLimit =
    plan === "PRO"
      ? null
      : 3;

  return {
    totalReplies: allReplies.length,
    repliesToday,
    repliesThisMonth,
    favoriteTone,

    plan,
    monthlyLimit,
  };
}