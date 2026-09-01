"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

type CompleteActionModalProps = {
  leadId: string;
  currentIntent: LeadIntent;
  currentTemperature: LeadTemperature;
  currentStage: LeadStage;
};

export default function CompleteActionModal({
  leadId,
  currentIntent,
  currentTemperature,
  currentStage,
}: CompleteActionModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] =
    useState(false);

  const [outcome, setOutcome] =
    useState("");

  const [leadResponse, setLeadResponse] =
    useState("");

  const [intent, setIntent] =
    useState<LeadIntent>(
      currentIntent
    );

  const [temperature, setTemperature] =
    useState<LeadTemperature>(
      currentTemperature
    );

  const [stage, setStage] =
    useState<LeadStage>(currentStage);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!outcome.trim()) {
      setError(
        "Please describe what happened."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/leads/${leadId}/complete-action`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            outcome,
            leadResponse,
            intent,
            temperature,
            stage,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to complete action."
        );
      }

      setOpen(false);

      setOutcome("");
      setLeadResponse("");

      router.refresh();
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
      >
        Mark Action Complete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}

          <button
            aria-label="Close modal"
            onClick={() => !loading && setOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal */}

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="border-b border-zinc-800 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Complete Action
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Tell CoachDM AI what happened
                    after taking the recommended action.
                  </p>
                </div>

                <button
                  onClick={() =>
                    !loading && setOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] overflow-y-auto px-6 py-6"
            >
              <div className="space-y-6">
                {/* What happened */}

                <div>
                  <label className="text-sm font-medium text-white">
                    What happened? *
                  </label>

                  <textarea
                    value={outcome}
                    onChange={(e) =>
                      setOutcome(e.target.value)
                    }
                    placeholder="Describe what you did and what happened..."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                {/* Lead response */}

                <div>
                  <label className="text-sm font-medium text-white">
                    Lead&apos;s response
                  </label>

                  <textarea
                    value={leadResponse}
                    onChange={(e) =>
                      setLeadResponse(
                        e.target.value
                      )
                    }
                    placeholder="What did the lead say or do?"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                {/* Lead state */}

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-white">
                      Intent
                    </label>

                    <select
                      value={intent}
                      onChange={(e) =>
                        setIntent(
                          e.target
                            .value as LeadIntent
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option value="unknown">
                        Unknown
                      </option>

                      <option value="interested">
                        Interested
                      </option>

                      <option value="unsure">
                        Unsure
                      </option>

                      <option value="not_interested">
                        Not interested
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white">
                      Temperature
                    </label>

                    <select
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(
                          e.target
                            .value as LeadTemperature
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option value="cold">
                        Cold
                      </option>

                      <option value="warm">
                        Warm
                      </option>

                      <option value="hot">
                        Hot
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white">
                      Stage
                    </label>

                    <select
                      value={stage}
                      onChange={(e) =>
                        setStage(
                          e.target
                            .value as LeadStage
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                    >
                      <option value="new">
                        New Lead
                      </option>

                      <option value="initial_conversation">
                        Initial Conversation
                      </option>

                      <option value="discovery">
                        Discovery
                      </option>

                      <option value="qualification">
                        Qualification
                      </option>

                      <option value="objection">
                        Objection
                      </option>

                      <option value="offer">
                        Offer
                      </option>

                      <option value="follow_up">
                        Follow Up
                      </option>

                      <option value="call_payment">
                        Call / Payment
                      </option>

                      <option value="client">
                        Client
                      </option>

                      <option value="lost">
                        Lost
                      </option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-5 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : "Save Action Outcome"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}