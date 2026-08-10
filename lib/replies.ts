import { supabaseAdmin } from "@/lib/supabase-admin";

export type Reply = {
  id: string;
  clerk_user_id: string;
  lead_message: string;
  ai_reply: string;
  tone: string;
  length: string;
  favorite: boolean;
  created_at: string;
};

export async function getRecentReplies(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("replies")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data ?? []) as Reply[];
}

export async function getAllReplies(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("replies")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Reply[];
}


/* Paginated replies for dashboard */

export async function getPaginatedReplies(
  userId: string,
  page = 1,
  pageSize = 10
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabaseAdmin
    .from("replies")
    .select("*", { count: "exact" })
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const total = count ?? 0;

  return {
    replies: (data ?? []) as Reply[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}


export async function getReplyById(
  id: string,
  userId: string
) {
  const { data, error } = await supabaseAdmin
    .from("replies")
    .select("*")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();

  if (error) return null;

  return data;
}


export async function getReplyStats(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("replies")
    .select("favorite, created_at")
    .eq("clerk_user_id", userId);

  if (error) throw error;

  const replies = data ?? [];

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const repliesThisMonth = replies.filter((reply) => {
    const date = new Date(reply.created_at);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  return {
    totalReplies: replies.length,
    favoriteReplies: replies.filter(
      (reply) => reply.favorite
    ).length,
    repliesThisMonth,
  };
}