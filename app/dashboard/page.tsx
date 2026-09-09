import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react";

import { createUserIfNotExists } from "@/lib/create-user";
import { getReplyById } from "@/lib/replies";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { getLeadById } from "@/lib/leads";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ReplyGenerator from "@/components/dashboard/ReplyGenerator";
import ReplyGeneratorHeader from "@/components/dashboard/ReplyGeneratorHeader";
import ReplyHistoryCard from "@/components/dashboard/ReplyHistoryCard";

type DashboardPageProps = {
  searchParams: Promise<{
    reply?: string;
    leadId?: string;
    view?: string;
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
    email:
      user?.primaryEmailAddress?.emailAddress ?? "",
    fullName: user?.fullName ?? "",
    avatarUrl: user?.imageUrl ?? "",
  });

  const stats = await getDashboardStats(userId);

  const {
    reply,
    leadId,
    view,
  } = await searchParams;

  let initialReply = null;
  let selectedLead = null;

  /*
   * Existing saved reply flow
   */
  if (reply) {
    initialReply = await getReplyById(
      reply,
      userId
    );
  }

  /*
   * Existing lead context flow
   */
  if (leadId) {
    selectedLead = await getLeadById(
      userId,
      leadId
    );
  }

  const showGenerator = view === "generator";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />

      {/* Purple Glow */}
      <div className="pointer-events-none absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

      {/* Blue Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 sm:py-28 lg:space-y-10 lg:px-8 lg:py-32">

        {/* ================================================== */}
        {/* AI REPLY GENERATOR PAGE */}
        {/* ================================================== */}

        {showGenerator ? (
          <div className="space-y-8">

            {/* Welcome Back Header */}
            <ReplyGeneratorHeader
              firstName={user?.firstName}
              email={
                user?.primaryEmailAddress
                  ?.emailAddress
              }
            />

            {/* AI Reply Generator */}
            <ReplyGenerator
              initialReply={initialReply}
              selectedLead={selectedLead}
            />

            {/* Reply History */}
            <ReplyHistoryCard />

          </div>
        ) : (

          /* ================================================== */
          /* MAIN DASHBOARD */
          /* ================================================== */

          <div className="space-y-8">

            {/* CoachDM AI Workspace */}
            <DashboardHeader
              firstName={user?.firstName}
              email={
                user?.primaryEmailAddress
                  ?.emailAddress
              }
            />

            {/* Stats */}
            <StatsCards stats={stats} />

            {/* Interface Entry Cards */}
            <div className="grid gap-5 lg:grid-cols-2">

              {/* ================================================== */}
              {/* AI REPLY GENERATOR */}
              {/* ================================================== */}

              <Link
                href="/dashboard?view=generator"
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.09] via-white/[0.025] to-transparent p-6 transition-all duration-300 hover:border-violet-400/25 hover:bg-white/[0.035] sm:p-7"
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-3xl transition group-hover:bg-violet-500/[0.14]" />

                <div className="relative">

                  {/* Icon + Arrow */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition group-hover:border-violet-400/20 group-hover:bg-violet-400/[0.08] group-hover:text-violet-300">
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>

                  </div>

                  {/* Title */}
                  <h2 className="mt-6 text-lg font-semibold tracking-tight text-white sm:text-xl">
                    AI Reply Generator
                  </h2>

                  {/* Description */}
                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    Generate personalized, high-converting
                    replies for your leads with AI.
                  </p>

                  {/* Button */}
                  <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition group-hover:border-violet-400/20 group-hover:bg-violet-400/[0.06] group-hover:text-white">
                    Open Reply Generator

                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>

                </div>
              </Link>

              {/* ================================================== */}
              {/* LEADS */}
              {/* ================================================== */}

              <Link
                href="/leads"
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.08] via-white/[0.025] to-transparent p-6 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.035] sm:p-7"
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/[0.07] blur-3xl transition group-hover:bg-blue-500/[0.13]" />

                <div className="relative">

                  {/* Icon + Arrow */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
                      <Users className="h-5 w-5" />
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition group-hover:border-blue-400/20 group-hover:bg-blue-400/[0.08] group-hover:text-blue-300">
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>

                  </div>

                  {/* Title */}
                  <h2 className="mt-6 text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Leads & Follow-Ups
                  </h2>

                  {/* Description */}
                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    Manage your leads, priorities,
                    conversations, and follow-ups.
                  </p>

                  {/* Button */}
                  <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition group-hover:border-blue-400/20 group-hover:bg-blue-400/[0.06] group-hover:text-white">
                    Open Leads

                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>

                </div>
              </Link>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}