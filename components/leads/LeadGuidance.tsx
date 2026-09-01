"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CompleteActionModal from "./CompleteActionModal";

type LeadIntent =
  | "unknown"
  | "interested"
  | "unsure"
  | "not_interested";

type LeadTemperature =
  | "cold"
  | "warm"
  | "hot";

type LeadStage =
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

type Guidance = {
  title: string;
  guidance: string;
  suggestedMessage: string;
};

type LeadGuidanceProps = {
  leadId: string;
  currentIntent: LeadIntent;
  currentTemperature: LeadTemperature;
  currentStage: LeadStage;
};

export default function LeadGuidance({
  leadId,
  currentIntent,
  currentTemperature,
  currentStage,
}: LeadGuidanceProps) {
  const router = useRouter();

  const [guidance, setGuidance] =
    useState<Guidance | null>(null);

  const [editableMessage, setEditableMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [messageSent, setMessageSent] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

  async function generateGuidance() {
    try {
      setLoading(true);
      setError("");
      setMessageSent(false);

      const response = await fetch(
        `/api/leads/${leadId}/guidance`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to generate guidance."
        );
      }

      setGuidance(data.guidance);

      setEditableMessage(
        data.guidance.suggestedMessage
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(
        editableMessage
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Failed to copy the message."
      );
    }
  }

  async function markMessageSent() {
    try {
      if (!editableMessage.trim()) {
        setError(
          "Please enter a message before marking it as sent."
        );

        return;
      }

      if (messageSent) {
        return;
      }

      setSending(true);
      setError("");

      const response = await fetch(
        `/api/leads/${leadId}/message-sent`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message:
              editableMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save sent message."
        );
      }

      setMessageSent(true);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save sent message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-500/20 bg-violet-500/[0.05]">
      <div className="border-b border-violet-500/15 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
            ✨
          </div>

          <div>
            <h2 className="font-semibold">
              CoachDM AI Guidance
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Your next recommended action
              for this lead.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!guidance ? (
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-sm leading-7 text-zinc-400">
              CoachDM AI will analyze the lead&apos;s
              current situation and recommend the
              single most important next action.
            </p>

            <button
              onClick={generateGuidance}
              disabled={loading}
              className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Analyzing Lead..."
                : "Generate Next Action →"}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* AI Guidance */}

            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
                Recommended next step
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                {guidance.title}
              </h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                {guidance.guidance}
              </p>
            </div>

            {/* Editable Suggested Message */}

            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Suggested message
                </p>

                <span className="text-xs text-zinc-600">
                  Editable
                </span>
              </div>

              <textarea
                value={editableMessage}
                onChange={(e) => {
                  setEditableMessage(
                    e.target.value
                  );

                  if (messageSent) {
                    setMessageSent(false);
                  }
                }}
                rows={7}
                className="mt-4 w-full resize-y rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm leading-7 text-zinc-300 outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={copyMessage}
                  className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-violet-500/40 hover:bg-zinc-900"
                >
                  {copied
                    ? "Copied ✓"
                    : "Copy Message"}
                </button>

                <button
                  onClick={markMessageSent}
                  disabled={
                    sending || messageSent
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${
                    messageSent
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-white text-black hover:bg-zinc-200"
                  } disabled:opacity-80`}
                >
                  {sending
                    ? "Saving..."
                    : messageSent
                    ? "Message Sent ✓"
                    : "Mark as Sent"}
                </button>
              </div>
            </div>

            {/* Complete Action */}

            <div className="flex flex-wrap items-center gap-3">
              <CompleteActionModal
                leadId={leadId}
                currentIntent={currentIntent}
                currentTemperature={
                  currentTemperature
                }
                currentStage={currentStage}
              />

              <button
                onClick={generateGuidance}
                disabled={loading}
                className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-violet-500/40 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Analyzing..."
                  : "Generate Another Action"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}