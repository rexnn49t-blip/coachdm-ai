import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

import { getLeadById } from "@/lib/leads";
import { getLeadActivities } from "@/lib/lead-activities";

import LeadWorkspace from "@/components/leads/LeadWorkspace";

type LeadPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadPage({
  params,
}: LeadPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const lead = await getLeadById(userId, id);

  if (!lead) {
    notFound();
  }

  const activities = await getLeadActivities(userId, id);

  return (
    <LeadWorkspace
      lead={lead}
      activities={activities}
    />
  );
}