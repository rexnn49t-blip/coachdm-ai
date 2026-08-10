import { supabaseAdmin } from "@/lib/supabase-admin";
import { createFreeSubscription } from "@/lib/subscription-db";

type CreateUserParams = {
  clerkUserId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
};

export async function createUserIfNotExists({
  clerkUserId,
  email,
  fullName,
  avatarUrl,
}: CreateUserParams) {
  console.log("Checking user:", clerkUserId);

  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (checkError) {
    console.error("Check user error:", checkError);
    throw checkError;
  }

if (existingUser) {
  console.log("User already exists");

  await createFreeSubscription(
    clerkUserId,
    email
  );

  console.log(
    "Subscription checked for existing user:",
    clerkUserId
  );

  return existingUser;
}

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      clerk_user_id: clerkUserId,
      email,
      full_name: fullName ?? null,
      avatar_url: avatarUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Create user error:", error);
    throw error;
  }

console.log("User created:", data);

await createFreeSubscription(
  clerkUserId,
  email
);

console.log("Free subscription created for:", clerkUserId);

return data;
}