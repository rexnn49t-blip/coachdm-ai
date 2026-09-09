import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BellRing,
  Clock3,
  Flame,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react";

import {
  getDailyCoachBrief,
  type DailyBriefLead,
} from "@/lib/daily-brief";

type DailyCoachBriefProps = {
  clerkUserId: string;
};

function stageLabel(stage: string) {
  return stage.replace(/_/g, " ");
}

function LeadRow({
  lead,
  icon,
  iconClassName,
  actionLabel,
}: {
  lead: DailyBriefLead;
  icon: React.ReactNode;
  iconClassName: string;
  actionLabel: string;
}) {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.045]">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-black">
            {lead.name}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="capitalize">
              {stageLabel(lead.stage)}
            </span>

            <span className="text-zinc-700">•</span>

            <span className="capitalize">
              {lead.intent.replace(/_/g, " ")}
            </span>

            <span className="text-zinc-700">•</span>

            <span className="capitalize">
              {lead.temperature}
            </span>
          </div>

          <p className="mt-1 text-xs text-zinc-500">
            {lead.reason}
          </p>
        </div>
      </div>

      <Link
        href={`/leads/${lead.id}`}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-black"
      >
        <span className="hidden sm:inline">
          {actionLabel}
        </span>

        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default async function DailyCoachBrief({
  clerkUserId,
}: DailyCoachBriefProps) {
  const [brief, user] = await Promise.all([
    getDailyCoachBrief(clerkUserId),
    currentUser(),
  ]);

  /*
   * Use the same name stored in Clerk that is shown
   * in the dashboard "Welcome back" section.
   */
  const coachName =
    user?.firstName ||
    user?.fullName ||
    user?.username ||
    "Coach";

  /*
   * Build one unified priority list.
   *
   * Priority order:
   * 1. Replies waiting
   * 2. Hot leads
   * 3. Follow-ups
   * 4. Attention needed
   *
   * A lead can only appear once.
   */
  const priorityLeads = new Map<
    string,
    {
      lead: DailyBriefLead;
      icon: React.ReactNode;
      iconClassName: string;
      actionLabel: string;
    }
  >();

  for (const lead of brief.repliesWaiting) {
    priorityLeads.set(lead.id, {
      lead,
      icon: (
        <MessageCircle className="h-4 w-4" />
      ),
      iconClassName:
        "bg-blue-400/10 text-blue-400",
      actionLabel: "Respond",
    });
  }

  for (const lead of brief.hotLeads) {
    if (!priorityLeads.has(lead.id)) {
      priorityLeads.set(lead.id, {
        lead,
        icon: (
          <Flame className="h-4 w-4" />
        ),
        iconClassName:
          "bg-orange-400/10 text-orange-400",
        actionLabel: "View Opportunity",
      });
    }
  }

  for (const lead of brief.followUps) {
    if (!priorityLeads.has(lead.id)) {
      priorityLeads.set(lead.id, {
        lead,
        icon: (
          <Clock3 className="h-4 w-4" />
        ),
        iconClassName:
          "bg-amber-400/10 text-amber-400",
        actionLabel: "Follow Up",
      });
    }
  }

  for (const lead of brief.attentionNeeded) {
    if (!priorityLeads.has(lead.id)) {
      priorityLeads.set(lead.id, {
        lead,
        icon: (
          <Target className="h-4 w-4" />
        ),
        iconClassName:
          "bg-violet-400/10 text-violet-400",
        actionLabel: "Review Lead",
      });
    }
  }

  const priorities = Array.from(
    priorityLeads.values()
  ).slice(0, 6);

  const totalPriorities =
    priorityLeads.size;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.055] via-white/[0.025] to-transparent shadow-2xl shadow-black/20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-blue-500/[0.05] blur-3xl" />

      <div className="relative p-5 sm:p-6 lg:p-7">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/10 bg-violet-400/[0.06] px-3 py-1.5 text-xs font-medium text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Daily Coach Brief
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Good morning, {coachName} 👋
            </h2>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-zinc-500">
              Here&apos;s what needs your attention today.
            </p>
          </div>

          {totalPriorities > 0 && (
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3">
              <BellRing className="h-4 w-4 text-zinc-400" />

              <div>
                <p className="text-xs font-semibold text-white">
                  {totalPriorities}{" "}
                  {totalPriorities === 1
                    ? "priority"
                    : "priorities"}
                </p>

                <p className="text-[11px] text-zinc-500">
                  for today
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Hot Leads
              </p>

              <Flame className="h-4 w-4 text-orange-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {brief.hotLeads.length}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              High-priority opportunities
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Replies
              </p>

              <MessageCircle className="h-4 w-4 text-blue-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {brief.repliesWaiting.length}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              Waiting for your response
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Follow-ups
              </p>

              <Clock3 className="h-4 w-4 text-amber-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {brief.followUps.length}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              Conversations to revisit
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Attention
              </p>

              <Target className="h-4 w-4 text-violet-400" />
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {brief.attentionNeeded.length}
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              Leads going quiet
            </p>
          </div>
        </div>

        {/* Today's priorities */}
        {priorities.length > 0 ? (
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Today&apos;s Priorities
                </h3>

                <p className="mt-1 text-xs text-zinc-600">
                  Start with these conversations.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {priorities.map(
                ({
                  lead,
                  icon,
                  iconClassName,
                  actionLabel,
                }) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    icon={icon}
                    iconClassName={iconClassName}
                    actionLabel={actionLabel}
                  />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-white/[0.06] bg-black/15 px-5 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-white">
              You&apos;re all caught up
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
              No urgent conversations need your attention
              right now. Nice work, {coachName}.
            </p>
          </div>
        )}

        {/* Best opportunity */}
        {brief.bestOpportunity && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-violet-400/10 bg-gradient-to-r from-violet-500/[0.08] via-violet-500/[0.035] to-transparent">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
                <Target className="h-3.5 w-3.5" />
                Best Opportunity Today
              </div>

              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {brief.bestOpportunity.name}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="capitalize">
                      {stageLabel(
                        brief.bestOpportunity.stage
                      )}
                    </span>

                    <span className="text-zinc-700">
                      •
                    </span>

                    <span className="capitalize">
                      {brief.bestOpportunity.intent.replace(
                        /_/g,
                        " "
                      )}
                    </span>

                    <span className="text-zinc-700">
                      •
                    </span>

                    <span className="capitalize">
                      {brief.bestOpportunity.temperature}
                    </span>
                  </div>

                  <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-400">
                    {brief.bestOpportunity.reason}
                  </p>
                </div>

                <Link
                  href={`/leads/${brief.bestOpportunity.id}`}
                 className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-5 py-3 text-sm font-medium text-violet-300 transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
                >
                  Open Lead
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}