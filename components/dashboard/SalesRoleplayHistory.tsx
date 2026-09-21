"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  MessageSquare,
  Trophy,
} from "lucide-react";

type Scenario =
  | "interested"
  | "skeptical"
  | "price"
  | "hesitant";

type RoleplayMessage = {
  role: "coach" | "prospect";
  content: string;
};

type Session = {
  id: string;
  scenario: Scenario;

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

  conversation: RoleplayMessage[];

  created_at: string;
};

const scenarioLabels: Record<Scenario, string> = {
  interested: "Interested Prospect",
  skeptical: "Skeptical Prospect",
  price: "Price Objection",
  hesitant: "Hesitant Prospect",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function Score({
  value,
  large = false,
}: {
  value: number;
  large?: boolean;
}) {
  return (
    <span
      className={
        large
          ? "text-2xl font-semibold tracking-tight text-white"
          : "text-sm font-semibold text-white"
      }
    >
      {value}
    </span>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-zinc-500">
          {label}
        </span>

        <span className="text-xs font-medium text-zinc-300">
          {value}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function SalesRoleplayHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(
          "/api/sales-roleplay/history",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load roleplay history."
          );
        }

        setSessions(data.sessions ?? []);
      } catch (err) {
        console.error(
          "Load roleplay history error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load roleplay history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        total: 0,
        average: 0,
        best: 0,
      };
    }

    const total = sessions.length;

    const average = Math.round(
      sessions.reduce(
        (sum, session) => sum + session.overall_score,
        0
      ) / total
    );

    const best = Math.max(
      ...sessions.map(
        (session) => session.overall_score
      )
    );

    return {
      total,
      average,
      best,
    };
  }, [sessions]);

  if (loading) {
    return (
      <section className="mt-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.05]" />

          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="mt-6 h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
      </section>
    );
  }

  return (
    <section className="mt-12 border-t border-white/[0.06] pt-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-violet-300">
              <BrainCircuit className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Practice History
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Review your previous sales practice sessions.
              </p>
            </div>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Sessions
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {stats.total}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Average
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {stats.average}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Best
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {stats.best}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!error && sessions.length === 0 && (
        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center">
          <Trophy className="mx-auto h-6 w-6 text-zinc-600" />

          <h3 className="mt-4 text-sm font-medium text-white">
            No practice sessions yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Complete your first AI Sales Roleplay and
            your results will appear here.
          </p>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="mt-6 space-y-3">
          {sessions.map((session) => {
            const expanded =
              expandedId === session.id;

            return (
              <div
                key={session.id}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(
                      expanded ? null : session.id
                    )
                  }
                  className="w-full px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.06]">
                      <Score
                        value={session.overall_score}
                        large
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                        <p className="truncate text-sm font-medium text-white">
                          {scenarioLabels[
                            session.scenario
                          ]}
                        </p>

                        <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />

                        <span className="text-xs text-zinc-600">
                          {formatDate(session.created_at)}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3 w-3" />
                          {formatTime(session.created_at)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquare className="h-3 w-3" />
                          {session.conversation.length} messages
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-zinc-600">
                      {expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-white/[0.06] px-5 py-6 sm:px-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                          Score Breakdown
                        </p>

                        <div className="mt-5 space-y-4">
                          <ScoreBar
                            label="Conversation Strength"
                            value={
                              session.conversation_strength
                            }
                          />

                          <ScoreBar
                            label="Discovery & Questioning"
                            value={session.discovery}
                          />

                          <ScoreBar
                            label="Objection Handling"
                            value={
                              session.objection_handling
                            }
                          />

                          <ScoreBar
                            label="Value Communication"
                            value={
                              session.value_communication
                            }
                          />

                          <ScoreBar
                            label="Closing / Next Step"
                            value={session.closing}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                          Conversation Summary
                        </p>

                        <p className="mt-4 text-sm leading-7 text-zinc-400">
                          {session.summary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                          Strongest Moment
                        </p>

                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                          {session.strongest_moment}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                          Missed Opportunity
                        </p>

                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                          {session.missed_opportunity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-6 lg:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                          What You Did Well
                        </p>

                        <div className="mt-3 space-y-2">
                          {session.strengths.map(
                            (strength, index) => (
                              <div
                                key={index}
                                className="flex gap-3 text-sm leading-6 text-zinc-400"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span>{strength}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                          What To Improve
                        </p>

                        <div className="mt-3 space-y-2">
                          {session.improvements.map(
                            (improvement, index) => (
                              <div
                                key={index}
                                className="flex gap-3 text-sm leading-6 text-zinc-400"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span>
                                  {improvement}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 rounded-xl border border-violet-400/10 bg-violet-500/[0.035] p-5">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300/70">
                        Try This Instead
                      </p>

                      <p className="mt-3 text-sm leading-7 text-zinc-300">
                        {session.better_response}
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 p-5">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                        Your Takeaway
                      </p>

                      <p className="mt-3 text-sm leading-6 text-zinc-400">
                        {session.takeaway}
                      </p>
                    </div>

                    <div className="mt-7">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                        Conversation
                      </p>

                      <div className="mt-4 space-y-3">
                        {session.conversation.map(
                          (message, index) => (
                            <div
                              key={index}
                              className={`rounded-xl border p-4 ${
                                message.role ===
                                "coach"
                                  ? "border-violet-400/10 bg-violet-500/[0.035]"
                                  : "border-white/[0.06] bg-black/20"
                              }`}
                            >
                              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                                {message.role ===
                                "coach"
                                  ? "You"
                                  : "Prospect"}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-zinc-400">
                                {message.content}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs text-zinc-600">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Practiced on{" "}
                      {formatDate(session.created_at)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}