"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Check,
  Loader2,
  MessageSquare,
  X,
} from "lucide-react";

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

type Analysis = {
  intent: LeadIntent;
  temperature: LeadTemperature;
  stage: LeadStage;
  reason: string;
};

type RecordLeadReplyProps = {
  leadId: string;
};

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

function getTemperatureStyle(
  temperature: LeadTemperature
) {
  if (temperature === "hot") {
    return "border-orange-500/20 bg-orange-500/10 text-orange-300";
  }

  if (temperature === "warm") {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-sky-500/20 bg-sky-500/10 text-sky-300";
}

function getIntentStyle(intent: LeadIntent) {
  if (intent === "interested") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (intent === "not_interested") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  if (intent === "unsure") {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-zinc-700 bg-zinc-900 text-zinc-400";
}

export default function RecordLeadReply({
  leadId,
}: RecordLeadReplyProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [savingReply, setSavingReply] =
    useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] = useState("");

  async function saveAndAnalyzeReply() {
    if (!reply.trim()) {
      setError("Please enter the lead's reply.");
      return;
    }

    try {
      setSavingReply(true);
      setError("");

      const saveResponse = await fetch(
        `/api/leads/${leadId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reply: reply.trim(),
          }),
        }
      );

      const saveData =
        await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(
          saveData.error ||
            "Failed to save lead reply."
        );
      }

      setSavingReply(false);
      setAnalyzing(true);

      const analysisResponse = await fetch(
        `/api/leads/${leadId}/analyze-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reply: reply.trim(),
          }),
        }
      );

      const analysisData =
        await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(
          analysisData.error ||
            "Failed to analyze lead reply."
        );
      }

      setAnalysis(
        analysisData.analysis
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSavingReply(false);
      setAnalyzing(false);
    }
  }

  async function acceptSuggestions() {
    if (!analysis) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await fetch(
        `/api/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intent: analysis.intent,
            temperature:
              analysis.temperature,
            stage: analysis.stage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update lead."
        );
      }

      setReply("");
      setAnalysis(null);
      setOpen(false);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update lead."
      );
    } finally {
      setUpdating(false);
    }
  }

  function closeModal() {
    if (
      savingReply ||
      analyzing ||
      updating
    ) {
      return;
    }

    setReply("");
    setAnalysis(null);
    setError("");
    setOpen(false);
  }

  function openModal() {
    setReply("");
    setAnalysis(null);
    setError("");
    setOpen(true);
  }

  return (
    <>
      {/* ===================================================== */}
      {/* RECORD REPLY BUTTON */}
      {/* ===================================================== */}

      <button
        type="button"
        onClick={openModal}
        className="group flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-left transition hover:border-violet-500/40 hover:bg-violet-500/[0.04]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
          <MessageSquare className="h-4 w-4 text-violet-400 transition group-hover:text-violet-300" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-200">
            Record Lead Reply
          </p>

          <p className="mt-0.5 text-xs text-zinc-600">
            Save and let AI analyze the response
          </p>
        </div>
      </button>

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close modal"
            onClick={closeModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex shrink-0 items-start justify-between gap-5 border-b border-white/[0.06] p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                  {analysis ? (
                    <Brain className="h-5 w-5 text-violet-400" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-violet-400" />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white">
                    {analysis
                      ? "AI Reply Analysis"
                      : "Record Lead Reply"}
                  </h2>

                  <p className="mt-1.5 max-w-lg text-sm leading-6 text-zinc-500">
                    {analysis
                      ? "Review the AI's suggested updates before applying them to this lead."
                      : "Add the lead's latest response and CoachDM AI will analyze their intent and journey stage."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  savingReply ||
                  analyzing ||
                  updating
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="overflow-y-auto p-6 sm:p-7">
              {!analysis ? (
                <>
                  {/* Reply label */}

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-300">
                      Lead's latest reply
                    </label>

                    <span className="text-xs text-zinc-600">
                      {reply.length} characters
                    </span>
                  </div>

                  {/* Textarea */}

                  <textarea
                    value={reply}
                    onChange={(e) =>
                      setReply(e.target.value)
                    }
                    placeholder="Paste or type the lead's latest message here..."
                    rows={9}
                    disabled={
                      savingReply ||
                      analyzing
                    }
                    autoFocus
                    className="mt-3 w-full resize-y rounded-2xl border border-white/[0.08] bg-black/70 px-4 py-4 text-sm leading-7 text-zinc-300 outline-none transition placeholder:text-zinc-700 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {/* AI loading */}

                  {analyzing && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
                      <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-violet-400" />

                      <div>
                        <p className="text-sm font-medium text-violet-300">
                          Analyzing lead response
                        </p>

                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                          CoachDM AI is evaluating intent,
                          temperature, and the best next stage.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error */}

                  {error && (
                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* ================================================= */}
                  {/* ANALYSIS */}
                  {/* ================================================= */}

                  <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-5">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-violet-400" />

                      <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                        AI assessment
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {analysis.reason}
                    </p>
                  </div>

                  {/* Suggested changes */}

                  <div className="mt-5">
                    <p className="text-sm font-medium text-zinc-300">
                      Suggested lead updates
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      These changes will be applied only after you accept them.
                    </p>
                  </div>

                  {/* Cards */}

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {/* Intent */}

                    <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Intent
                      </p>

                      <div className="mt-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getIntentStyle(
                            analysis.intent
                          )}`}
                        >
                          {formatLabel(
                            analysis.intent
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Temperature */}

                    <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Temperature
                      </p>

                      <div className="mt-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getTemperatureStyle(
                            analysis.temperature
                          )}`}
                        >
                          {formatLabel(
                            analysis.temperature
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Stage */}

                    <div className="rounded-2xl border border-white/[0.07] bg-black/60 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Suggested stage
                      </p>

                      <div className="mt-3">
                        <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-medium capitalize text-violet-300">
                          {formatLabel(
                            analysis.stage
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Error */}

                  {error && (
                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/[0.06] bg-black/20 p-5 sm:p-6">
              {!analysis ? (
                <>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={
                      savingReply ||
                      analyzing
                    }
                    className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      saveAndAnalyzeReply
                    }
                    disabled={
                      savingReply ||
                      analyzing ||
                      !reply.trim()
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingReply && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {savingReply
                      ? "Saving..."
                      : analyzing
                      ? "Analyzing..."
                      : "Save & Analyze"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setAnalysis(null)
                    }
                    disabled={updating}
                    className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={acceptSuggestions}
                    disabled={updating}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}

                    {updating
                      ? "Updating..."
                      : "Accept Suggestions"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}