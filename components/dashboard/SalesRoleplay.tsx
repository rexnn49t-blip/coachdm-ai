"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  MessageCircle,
  Send,
  ShieldQuestion,
  Target,
  UserRound,
  Zap,
} from "lucide-react";

import SalesRoleplayHistory from "./SalesRoleplayHistory";

type Scenario = {
  id: string;
  title: string;
  description: string;
  icon: typeof Target;
};

type Message = {
  role: "coach" | "prospect";
  content: string;
};

type Evaluation = {
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

const scenarios: Scenario[] = [
  {
    id: "interested",
    title: "Interested Prospect",
    description:
      "Practice turning genuine interest into a meaningful sales conversation.",
    icon: MessageCircle,
  },
  {
    id: "skeptical",
    title: "Skeptical Prospect",
    description:
      "Handle doubts from someone who is interested but not fully convinced.",
    icon: ShieldQuestion,
  },
  {
    id: "price",
    title: "Price Objection",
    description:
      "Practice responding naturally when a prospect says your coaching is too expensive.",
    icon: Target,
  },
  {
    id: "hesitant",
    title: "Hesitant Prospect",
    description:
      "Build confidence when a prospect keeps saying they need more time to decide.",
    icon: Zap,
  },
];

function Score({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-zinc-400">
          {label}
        </span>

        <span className="text-sm font-semibold text-white">
          {value}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function SalesRoleplay() {
  const [selectedScenario, setSelectedScenario] =
    useState("interested");

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [evaluation, setEvaluation] =
    useState<Evaluation | null>(null);

  const selected =
    scenarios.find(
      (scenario) => scenario.id === selectedScenario
    ) ?? scenarios[0];

  async function startRoleplay() {
    setLoading(true);
    setError("");
    setMessages([]);
    setEvaluation(null);

    try {
      const response = await fetch(
        "/api/sales-roleplay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenario: selectedScenario,
            messages: [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start the roleplay."
        );
      }

      setMessages([
        {
          role: "prospect",
          content: data.reply,
        },
      ]);

      setStarted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the roleplay."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const trimmed = input.trim();

    if (!trimmed || loading) {
      return;
    }

    const coachMessage: Message = {
      role: "coach",
      content: trimmed,
    };

    const updatedMessages = [
      ...messages,
      coachMessage,
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/sales-roleplay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenario: selectedScenario,
            messages: updatedMessages.map(
              (message) => ({
                role:
                  message.role === "coach"
                    ? "user"
                    : "assistant",
                content: message.content,
              })
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to continue the roleplay."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "prospect",
          content: data.reply,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue the roleplay."
      );
    } finally {
      setLoading(false);
    }
  }

 async function finishRoleplay() {
  if (messages.length < 2) {
    endRoleplay();
    return;
  }

  setEvaluating(true);
  setError("");

  try {
    const response = await fetch(
      "/api/sales-roleplay/debrief",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          messages,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to generate the sales debrief."
      );
    }

    const evaluation = data.evaluation;

    // Show the debrief immediately
    setEvaluation(evaluation);
    setStarted(false);

    // Save the completed roleplay session
    // without breaking the debrief if saving fails.
    try {
      await fetch("/api/sales-roleplay/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          evaluation,
          conversation: messages,
        }),
      });
    } catch (saveError) {
      console.error(
        "Unable to save roleplay session:",
        saveError
      );
    }
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to generate the sales debrief."
    );
  } finally {
    setEvaluating(false);
  }
}

function endRoleplay() {
  setStarted(false);
  setMessages([]);
  setInput("");
  setError("");
  setEvaluation(null);
}

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  if (evaluation) {
    return (
      <section
        id="roleplay"
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.025] to-transparent p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/[0.08] blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Sales Debrief
                  </h1>

                  <span className="rounded-lg border border-violet-400/10 bg-violet-400/[0.05] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-violet-300">
                    AI Analysis
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Here is what the AI noticed about your
                  sales conversation.
                </p>
              </div>
            </div>

          <button
  type="button"
  onClick={startRoleplay}
  disabled={loading}
  className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  Practice Again
  <ArrowRight className="h-4 w-4" />
</button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[220px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                Overall Score
              </span>

              <div className="mt-4 text-6xl font-semibold tracking-tight text-white">
                {evaluation.overallScore}
              </div>

              <span className="mt-2 text-sm text-zinc-500">
                out of 100
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Score
                label="Conversation Strength"
                value={
                  evaluation.conversationStrength
                }
              />

              <Score
                label="Discovery & Questioning"
                value={evaluation.discovery}
              />

              <Score
                label="Objection Handling"
                value={
                  evaluation.objectionHandling
                }
              />

              <Score
                label="Value Communication"
                value={
                  evaluation.valueCommunication
                }
              />

              <Score
                label="Closing / Next Step"
                value={evaluation.closing}
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              Conversation Summary
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
      Strongest Moment
    </p>

    <p className="mt-3 text-sm leading-7 text-zinc-300">
      {evaluation.strongestMoment}
    </p>
  </div>

  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
      Missed Opportunity
    </p>

    <p className="mt-3 text-sm leading-7 text-zinc-300">
      {evaluation.missedOpportunity}
    </p>
  </div>
</div>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {evaluation.summary}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-white">
                What you did well
              </h2>

              <div className="mt-4 space-y-3">
                {evaluation.strengths.map(
                  (strength, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                        <Check className="h-3 w-3" />
                      </div>

                      <p className="text-sm leading-6 text-zinc-400">
                        {strength}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-white">
                What to improve
              </h2>

              <div className="mt-4 space-y-3">
                {evaluation.improvements.map(
                  (improvement, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
                        <ArrowRight className="h-3 w-3" />
                      </div>

                      <p className="text-sm leading-6 text-zinc-400">
                        {improvement}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300/70">
              Try This Instead
            </p>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              “{evaluation.betterResponse}”
            </p>
          </div>

          <div className="mt-6 border-t border-white/[0.06] pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              Your Takeaway
            </p>

            <p className="mt-3 text-sm font-medium leading-6 text-white">
              {evaluation.takeaway}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (started) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.025] to-transparent">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/[0.08] blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={endRoleplay}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition hover:border-white/[0.14] hover:text-white"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-white">
                    {selected.title}
                  </h1>

                  <span className="rounded-lg border border-violet-400/10 bg-violet-400/[0.05] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-violet-300">
                    Practice
                  </span>
                </div>

                <p className="mt-1 text-sm text-zinc-500">
                  You are the coach. AI is the prospect.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={finishRoleplay}
              disabled={loading || evaluating}
              className="w-fit rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {evaluating
                ? "Analyzing..."
                : "Finish & Get Feedback"}
            </button>
          </div>

          <div className="min-h-[420px] space-y-5 p-6 sm:p-8">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "coach"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] items-end gap-3 ${
                    message.role === "coach"
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      message.role === "coach"
                        ? "bg-white/[0.06] text-zinc-400"
                        : "bg-violet-500/10 text-violet-300"
                    }`}
                  >
                    {message.role === "coach" ? (
                      <UserRound className="h-4 w-4" />
                    ) : (
                      <BrainCircuit className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "coach"
                        ? "bg-white/[0.07] text-zinc-200"
                        : "border border-white/[0.07] bg-white/[0.025] text-zinc-300"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <BrainCircuit className="h-4 w-4" />
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm text-zinc-500">
                  Prospect is thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.06] p-5 sm:p-6">
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-2">
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Respond as the coach..."
                rows={3}
                disabled={loading || evaluating}
                className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <div className="flex items-center justify-between px-2 pb-1 pt-2">
                <span className="text-xs text-zinc-600">
                  Enter to send · Shift + Enter for a new line
                </span>

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={
                    !input.trim() ||
                    loading ||
                    evaluating
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
     <div>
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.025] to-transparent p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
              <BrainCircuit className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                AI Sales Roleplay
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Practice real sales conversations with AI
                prospects and build confidence before speaking
                with your next client.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-violet-400/10 bg-violet-400/[0.05] px-3 py-2 text-xs font-medium text-violet-300">
            <BrainCircuit className="h-3.5 w-3.5" />
            AI Practice
          </div>
        </div>

        <div className="mt-10">
          <div>
            <h2 className="text-base font-semibold text-white">
              Choose a scenario
            </h2>

            <p className="mt-1.5 text-sm text-zinc-500">
              Pick a conversation you want to practice.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              const selected =
                selectedScenario === scenario.id;

              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() =>
                    setSelectedScenario(
                      scenario.id
                    )
                  }
                  className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                    selected
                      ? "border-violet-400/30 bg-violet-500/[0.08]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.035]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        selected
                          ? "bg-violet-400/10 text-violet-300"
                          : "bg-white/[0.04] text-zinc-500"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        selected
                          ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                          : "border-white/[0.1] text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-white">
                    {scenario.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {scenario.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-300">
              Ready to practice?
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Your AI prospect will respond based on the
              scenario you choose.
            </p>
          </div>

          <button
            type="button"
            onClick={startRoleplay}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Starting..."
              : "Start Roleplay"}

            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

               {error && (
          <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </section>

    <SalesRoleplayHistory />
  </div>
);
}