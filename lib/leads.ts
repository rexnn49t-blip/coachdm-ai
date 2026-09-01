import { supabaseAdmin } from "@/lib/supabase-admin";

export type LeadStage =
  | "new"
  | "initial_conversation"
  | "discovery"
  | "qualification"
  | "objection"
  | "offer"
  | "follow_up"
  | "call_payment"
  | "client"
  | "lost";

export type LeadIntent =
  | "unknown"
  | "interested"
  | "unsure"
  | "not_interested";

export type LeadTemperature =
  | "cold"
  | "warm"
  | "hot";

export type Lead = {
  id: string;

  clerk_user_id: string;

  name: string;

  email: string | null;

  phone: string | null;

  source: string | null;

  initial_message: string | null;

  goal: string | null;

  notes: string | null;

  stage: LeadStage;

  intent: LeadIntent;

  temperature: LeadTemperature;

  last_activity_at: string;

  created_at: string;

  updated_at: string;
};

export type CreateLeadInput = {
  name: string;

  email?: string;

  phone?: string;

  source?: string;

  initial_message?: string;

  goal?: string;

  notes?: string;

  stage?: LeadStage;

  intent?: LeadIntent;

  temperature?: LeadTemperature;
};

/**
 * Get all leads belonging to a user.
 */
export async function getLeads(
  clerkUserId: string
): Promise<Lead[]> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("last_activity_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get leads error:",
      error
    );

    return [];
  }

  return (data ?? []) as Lead[];
}

/**
 * Get one lead.
 *
 * Parameter order:
 * getLeadById(leadId, clerkUserId)
 */
export async function getLeadById(
  clerkUserId: string,
  leadId: string
): Promise<Lead | null> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    console.error("Get lead error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return null;
  }

  return data as Lead | null;
}

/**
 * Create a new lead.
 */
export async function createLead(
  clerkUserId: string,
  input: CreateLeadInput
): Promise<Lead | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({
      clerk_user_id: clerkUserId,

      name: input.name.trim(),

      email:
        input.email?.trim() || null,

      phone:
        input.phone?.trim() || null,

      source:
        input.source?.trim() || null,

      initial_message:
        input.initial_message?.trim() || null,

      goal:
        input.goal?.trim() || null,

      notes:
        input.notes?.trim() || null,

      stage:
        input.stage ?? "new",

      intent:
        input.intent ?? "unknown",

      temperature:
        input.temperature ?? "cold",

      last_activity_at: now,

      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Create lead error:",
      error
    );

    return null;
  }

  return data as Lead;
}

/**
 * Update an existing lead.
 */
export async function updateLead(
  clerkUserId: string,
  leadId: string,
  updates: Partial<CreateLeadInput>
): Promise<Lead | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update({
      ...updates,
      updated_at: now,
      last_activity_at: now,
    })
    .eq("id", leadId)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error(
      "Update lead error:",
      error
    );

    return null;
  }

  return data as Lead;
}

/**
 * Update only the pipeline stage.
 */
export async function updateLeadStage(
  clerkUserId: string,
  leadId: string,
  stage: LeadStage
): Promise<Lead | null> {
  return updateLead(
    clerkUserId,
    leadId,
    { stage }
  );
}

/**
 * Update the lead's last activity time.
 */
export async function updateLeadActivity(
  clerkUserId: string,
  leadId: string
): Promise<Lead | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update({
      last_activity_at: now,
      updated_at: now,
    })
    .eq("id", leadId)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    console.error(
      "Update lead activity error:",
      error
    );

    return null;
  }

  return data as Lead;
}

/**
 * Delete a lead.
 */
export async function deleteLead(
  clerkUserId: string,
  leadId: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("leads")
    .delete()
    .eq("id", leadId)
    .eq("clerk_user_id", clerkUserId);

  if (error) {
    console.error(
      "Delete lead error:",
      error
    );

    return false;
  }

  return true;
}