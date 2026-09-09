"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Flame,
  MessageCircle,
  Target,
  UserRound,
} from "lucide-react";

import type {
  TodayPriority,
  TodayPriorityAction,
} from "@/lib/todays-priorities";

type TodaysPrioritiesProps = {
  priorities: TodayPriority[];
};

function getActionIcon(action: TodayPriorityAction) {
  switch (action) {
    case "reply":
      return MessageCircle;

    case "objection":
      return Target;

    case "follow_up":
      return Clock3;

    case "discovery":
      return UserRound;

    default:
      return ArrowRight;
  }
}

function getActionStyle(action: TodayPriorityAction) {
  switch (action) {
    case "reply":
      return "border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300";

    case "objection":
      return "border-amber-400/10 bg-amber-400/[0.06] text-amber-300";

    case "follow_up":
      return "border-blue-400/10 bg-blue-400/[0.06] text-blue-300";

    case "discovery":
      return "border-violet-400/10 bg-violet-400/[0.06] text-violet-300";

    default:
      return "border-white/[0.08] bg-white/[0.04] text-zinc-300";
  }
}

function getTemperatureStyle(
  temperature: string
) {
  switch (temperature) {
    case "hot":
      return "text-orange-300";

    case "warm":
      return "text-amber-300";

    default:
      return "text-blue-300";
  }
}

function getActionHref(
  priority: TodayPriority
) {
  if (priority.action === "reply") {
    return `/dashboard?leadId=${priority.leadId}`;
  }

  return `/leads/${priority.leadId}`;
}

export default function TodaysPriorities({
  priorities,
}: TodaysPrioritiesProps) {
  return (
    <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
              <Flame className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Who Should I Message Today?
              </h2>

              <p className="mt-0.5 text-xs text-zinc-500">
                Your highest-priority conversations right now.
              </p>
            </div>
          </div>
        </div>

        {priorities.length > 0 && (
          <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-zinc-500">
            {priorities.length}{" "}
            {priorities.length === 1
              ? "priority"
              : "priorities"}
          </span>
        )}
      </div>

      {/* Empty state */}
      {priorities.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/10 px-4 py-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Target className="h-4 w-4" />
          </div>

          <p className="mt-3 text-sm font-medium text-zinc-200">
            You're all caught up
          </p>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
            There are no high-priority conversations
            that need your attention right now.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {priorities.map((priority, index) => {
            const ActionIcon = getActionIcon(
              priority.action
            );

            const actionHref =
              getActionHref(priority);

            return (
              <div
                key={priority.leadId}
                className="group rounded-2xl border border-white/[0.06] bg-black/10 p-3.5 transition hover:border-white/[0.1] hover:bg-white/[0.035]"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-xs font-semibold text-zinc-500">
                    {index + 1}
                  </div>

                  {/* Lead */}
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <Link
                        href={`/leads/${priority.leadId}`}
                        className="truncate text-sm font-semibold text-white transition hover:text-zinc-300"
                      >
                        {priority.name}
                      </Link>

                      {priority.temperature === "hot" && (
                        <Flame
                          className={`h-3.5 w-3.5 shrink-0 ${getTemperatureStyle(
                            priority.temperature
                          )}`}
                        />
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {priority.reason}
                    </p>
                  </div>

                  {/* Action */}
                  <Link
                    href={actionHref}
                    className={`hidden shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-semibold transition sm:inline-flex ${getActionStyle(
                      priority.action
                    )}`}
                  >
                    <ActionIcon className="h-3 w-3" />
                    {priority.actionLabel}
                  </Link>

                  {/* Mobile action */}
                  <Link
                    href={actionHref}
                    aria-label={priority.actionLabel}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-400 transition hover:bg-white/[0.05] hover:text-white sm:hidden"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {priorities.length > 0 && (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-white"
          >
            View all leads
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}