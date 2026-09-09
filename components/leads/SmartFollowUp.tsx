"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

type SmartFollowUpProps = {
  leadId: string;
};

type FollowUpResponse = {
  success?: boolean;
  followUp?: {
    id: string;
    sequence_day: number;
    title: string;
    scheduled_for: string;
    status: string;
  };
  error?: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SmartFollowUp({
  leadId,
}: SmartFollowUpProps) {
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] =
    useState<FollowUpResponse["followUp"]>(undefined);
  const [error, setError] = useState<string | null>(null);

  const startFollowUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/leads/${leadId}/follow-up`,
        {
          method: "POST",
        }
      );

      const data =
        (await response.json()) as FollowUpResponse;

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to start the follow-up sequence."
        );
        return;
      }

      setFollowUp(data.followUp);
    } catch (err) {
      console.error("Start follow-up error:", err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <Sparkles className="h-4.5 w-4.5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Smart Follow-Up
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              CoachDM keeps track of when this lead should
              be contacted again.
            </p>
          </div>
        </div>
      </div>

      {!followUp ? (
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/15 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
              <CalendarClock className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Start a follow-up sequence
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                CoachDM will schedule the first follow-up
                for 2 days from now.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-3 py-2.5 text-xs text-red-300">
              {error}
            </div>
          )}

        <button
  type="button"
  onClick={startFollowUp}
  disabled={loading}
  style={{ color: "#000000" }}
  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
>
  {loading ? (
    <>
      <Loader2
        className="h-3.5 w-3.5 animate-spin"
        style={{ color: "#000000" }}
      />

      <span style={{ color: "#000000" }}>
        Starting...
      </span>
    </>
  ) : (
    <>
      <span style={{ color: "#000000" }}>
        Start Follow-Up
      </span>

      <ArrowRight
        className="h-3.5 w-3.5"
        style={{ color: "#000000" }}
      />
    </>
  )}
</button>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-violet-400/10 bg-violet-400/[0.04] p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <Check className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  Follow-Up Active
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Your next follow-up is scheduled.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-violet-400/10 bg-violet-400/[0.08] px-2.5 py-1 text-[10px] font-medium text-violet-300">
              Active
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[11px] text-zinc-600">
                Next step
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-200">
                Day {followUp.sequence_day} ·{" "}
                {followUp.title}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3">
              <p className="text-[11px] text-zinc-600">
                Scheduled
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-200">
                {formatDate(followUp.scheduled_for)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/15 px-3.5 py-3">
            <p className="text-xs leading-5 text-zinc-500">
              When the follow-up is due, CoachDM will use
              the conversation context to create a
              personalized message.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}