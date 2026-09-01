import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createUserIfNotExists } from "@/lib/create-user";
import { getReplyById } from "@/lib/replies";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { getLeadById } from "@/lib/leads";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ReplyGenerator from "@/components/dashboard/ReplyGenerator";
import ReplyHistoryCard from "../../components/dashboard/ReplyHistoryCard";
import LeadsCard from "@/components/dashboard/LeadsCard";

type DashboardPageProps = {
  searchParams: Promise<{
    reply?: string;
    leadId?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  await createUserIfNotExists({
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    fullName: user?.fullName ?? "",
    avatarUrl: user?.imageUrl ?? "",
  });

  const stats = await getDashboardStats(userId);

  const { reply, leadId } = await searchParams;

  let initialReply = null;
  let selectedLead = null;

  // Existing saved reply flow
  if (reply) {
    initialReply = await getReplyById(
      reply,
      userId
    );
  }

  // Lead context flow
  if (leadId) {
    selectedLead = await getLeadById(
      userId,
      leadId
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />

      {/* Purple Glow */}
      <div className="absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

      {/* Blue Glow */}
      <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 sm:py-28 lg:space-y-10 lg:px-8 lg:py-32">
        <DashboardHeader
          firstName={user?.firstName}
          email={user?.primaryEmailAddress?.emailAddress}
        />

        <StatsCards stats={stats} />

        {/* Main Workspace */}
        <div className="space-y-8">
          <ReplyGenerator
            initialReply={initialReply}
            selectedLead={selectedLead}
          />

          

          <ReplyHistoryCard />
           <LeadsCard />
        </div>
      </div>
    </main>
  );
}