import { supabaseAdmin } from "@/lib/supabase-admin";

export type SalesRoleplayScenario =
  | "interested"
  | "skeptical"
  | "price"
  | "hesitant";

export type SalesRoleplayMessage = {
  role: "coach" | "prospect";
  content: string;
};

export type SalesRoleplayEvaluation = {
  overallScore: number;
  conversationStrength: number;
  discovery: number;
  objectionHandling: number;
  valueCommunication: number;
  closing: number;

  summary: string;
  strongestMoment: string;
  missedOpportunity: string;

  strengths: string[];
  improvements: string[];

  betterResponse: string;
  takeaway: string;
};

export type SalesRoleplaySession = {
  id: string;
  clerk_user_id: string;
  scenario: SalesRoleplayScenario;

  overall_score: number;
  conversation_strength: number;
  discovery: number;
  objection_handling: number;
  value_communication: number;
  closing: number;

  summary: string;
  strongest_moment: string;
  missed_opportunity: string;

  strengths: string[];
  improvements: string[];

  better_response: string;
  takeaway: string;

  conversation: SalesRoleplayMessage[];

  created_at: string;
};

export async function saveSalesRoleplaySession({
  clerkUserId,
  scenario,
  evaluation,
  conversation,
}: {
  clerkUserId: string;
  scenario: SalesRoleplayScenario;
  evaluation: SalesRoleplayEvaluation;
  conversation: SalesRoleplayMessage[];
}): Promise<SalesRoleplaySession | null> {
  const { data, error } = await supabaseAdmin
    .from("sales_roleplay_sessions")
    .insert({
      clerk_user_id: clerkUserId,
      scenario,

      overall_score: evaluation.overallScore,
      conversation_strength: evaluation.conversationStrength,
      discovery: evaluation.discovery,
      objection_handling: evaluation.objectionHandling,
      value_communication: evaluation.valueCommunication,
      closing: evaluation.closing,

      summary: evaluation.summary,
      strongest_moment: evaluation.strongestMoment,
      missed_opportunity: evaluation.missedOpportunity,

      strengths: evaluation.strengths,
      improvements: evaluation.improvements,

      better_response: evaluation.betterResponse,
      takeaway: evaluation.takeaway,

      conversation,
    })
    .select()
    .single();

  if (error) {
    console.error("Save sales roleplay session error:", error);
    return null;
  }

  return {
    ...data,
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    improvements: Array.isArray(data.improvements)
      ? data.improvements
      : [],
    conversation: Array.isArray(data.conversation)
      ? data.conversation
      : [],
  } as SalesRoleplaySession;
}

export async function getSalesRoleplaySessions(
  clerkUserId: string
): Promise<SalesRoleplaySession[]> {
  const { data, error } = await supabaseAdmin
    .from("sales_roleplay_sessions")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get sales roleplay sessions error:", error);
    return [];
  }

  return (data ?? []).map((session) => ({
    ...session,
    strengths: Array.isArray(session.strengths)
      ? session.strengths
      : [],
    improvements: Array.isArray(session.improvements)
      ? session.improvements
      : [],
    conversation: Array.isArray(session.conversation)
      ? session.conversation
      : [],
  })) as SalesRoleplaySession[];
}