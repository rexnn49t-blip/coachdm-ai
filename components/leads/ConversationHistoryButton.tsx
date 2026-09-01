"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Bot,
  MessageCircle,
  User,
  X,
  Sparkles,
} from "lucide-react";

type ConversationMessage = {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
};

type ConversationHistoryButtonProps = {
  leadId: string;
  activities: ConversationMessage[];
};

function formatTime(date: string) {
  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ConversationHistoryButton({
  leadId,
  activities,
}: ConversationHistoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] =
    useState(false);
  const [summaryError, setSummaryError] =
    useState("");
  const [mounted, setMounted] = useState(false);

  /*
   * Client mount
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Conversation messages only
   */
  const messages = activities
    .filter(
      (activity) =>
        activity.activity_type === "lead_replied" ||
        activity.activity_type === "message_sent"
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

  /*
   * Generate AI summary
   */
  async function generateSummary() {
    if (messages.length === 0) {
      setSummary(
        "No conversation has been recorded yet."
      );
      return;
    }

    try {
      setLoadingSummary(true);
      setSummaryError("");

      const response = await fetch(
        `/api/leads/${leadId}/conversation-summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to generate conversation summary."
        );
      }

      setSummary(data.summary || "");
    } catch (error) {
      console.error(
        "Conversation summary error:",
        error
      );

      setSummaryError(
        error instanceof Error
          ? error.message
          : "Failed to generate summary."
      );
    } finally {
      setLoadingSummary(false);
    }
  }

  /*
   * Open modal
   */
  function openConversation() {
    setOpen(true);

    if (messages.length === 0) {
      setSummary(
        "No conversation has been recorded yet."
      );
      return;
    }

    if (!summary) {
      generateSummary();
    }
  }

  /*
   * Close modal
   */
  function closeConversation() {
    if (loadingSummary) return;

    setOpen(false);
  }

  /*
   * Lock background scrolling
   */
  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeConversation();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, loadingSummary]);

  return (
    <>
      {/* ===================================================== */}
      {/* QUICK ACTION BUTTON */}
      {/* ===================================================== */}

      <button
        type="button"
        onClick={openConversation}
        className="group flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-black/20 px-4 py-3 text-left transition hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 transition group-hover:bg-violet-500/15">
          <MessageCircle className="h-4 w-4 text-violet-400" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-200">
            Conversation History
          </p>

          <p className="mt-0.5 text-xs text-zinc-600">
            View conversation & AI summary
          </p>
        </div>
      </button>

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.76)",
              backdropFilter: "blur(8px)",
              padding: "32px",
            }}
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closeConversation();
              }
            }}
          >
            {/* ================================================= */}
            {/* MODAL WINDOW */}
            {/* ================================================= */}

            <div
              className="flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/70"
              style={{
                width: "min(920px, calc(100vw - 64px))",
                height: "min(620px, calc(100vh - 64px))",
              }}
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              {/* ================================================= */}
              {/* HEADER */}
              {/* ================================================= */}

              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <MessageCircle className="h-4 w-4 text-violet-400" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white sm:text-lg">
                      Conversation History
                    </h2>

                    <p className="mt-0.5 text-xs text-zinc-500">
                      Review the conversation with this lead.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeConversation}
                  disabled={loadingSummary}
                  aria-label="Close conversation history"
                  className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ================================================= */}
              {/* ACTUAL SCROLL AREA */}
              {/* ================================================= */}

              <div
                className="min-h-0 flex-1"
                style={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="px-6 py-5">
                  {/* ================================================= */}
                  {/* AI SUMMARY */}
                  {/* ================================================= */}

                  <section className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-violet-400" />

                      <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                        AI Conversation Summary
                      </p>
                    </div>

                    {/* Loading */}

                    {loadingSummary && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                          <Sparkles className="h-4 w-4 animate-pulse text-violet-400" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-violet-300">
                            Analyzing conversation...
                          </p>

                          <p className="mt-0.5 text-xs text-zinc-600">
                            Understanding the lead&apos;s current
                            position.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error */}

                    {!loadingSummary &&
                      summaryError && (
                        <div className="mt-3">
                          <p className="text-sm leading-6 text-red-300">
                            {summaryError}
                          </p>

                          <button
                            type="button"
                            onClick={generateSummary}
                            className="mt-2 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900"
                          >
                            Try Again
                          </button>
                        </div>
                      )}

                    {/* Summary */}

                    {!loadingSummary &&
                      !summaryError &&
                      summary && (
                        <p className="mt-2.5 text-sm leading-6 text-zinc-300">
                          {summary}
                        </p>
                      )}

                    {/* Empty */}

                    {!loadingSummary &&
                      !summaryError &&
                      !summary &&
                      messages.length === 0 && (
                        <p className="mt-2.5 text-sm leading-6 text-zinc-400">
                          No conversation has been recorded yet.
                        </p>
                      )}
                  </section>

                  {/* ================================================= */}
                  {/* CONVERSATION */}
                  {/* ================================================= */}

                  <section className="mt-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Conversation
                        </h3>

                        <p className="mt-0.5 text-xs text-zinc-600">
                          Actual lead and coach messages.
                        </p>
                      </div>

                      {messages.length > 0 && (
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-600">
                          {messages.length}{" "}
                          {messages.length === 1
                            ? "message"
                            : "messages"}
                        </span>
                      )}
                    </div>

                    {/* ================================================= */}
                    {/* MESSAGE LIST */}
                    {/* ================================================= */}

                    <div className="mt-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 px-5 py-8 text-center">
                          <MessageCircle className="mx-auto h-7 w-7 text-zinc-700" />

                          <p className="mt-2 text-sm font-medium text-zinc-400">
                            No conversation yet
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            Lead and coach messages will appear
                            here.
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isLead =
                            message.activity_type ===
                            "lead_replied";

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                isLead
                                  ? "justify-start"
                                  : "justify-end"
                              }`}
                            >
                              <div
                                className={`
                                  flex
                                  w-full
                                  max-w-[78%]
                                  items-end
                                  gap-3
                                  ${
                                    isLead
                                      ? "flex-row"
                                      : "flex-row-reverse"
                                  }
                                `}
                              >
                                {/* Avatar */}

                                <div
                                  className={`
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    ${
                                      isLead
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "bg-violet-500/10 text-violet-400"
                                    }
                                  `}
                                >
                                  {isLead ? (
                                    <User className="h-3.5 w-3.5" />
                                  ) : (
                                    <Bot className="h-3.5 w-3.5" />
                                  )}
                                </div>

                                {/* Message */}

                                <div className="min-w-0 flex-1">
                                  {/* Name + time */}

                                  <div
                                    className={`
                                      mb-1
                                      flex
                                      items-center
                                      gap-2
                                      ${
                                        isLead
                                          ? "justify-start"
                                          : "justify-end"
                                      }
                                    `}
                                  >
                                    <span className="text-[11px] font-medium text-zinc-500">
                                      {isLead
                                        ? "Lead"
                                        : "You"}
                                    </span>

                                    <span className="text-[10px] text-zinc-700">
                                      {formatTime(
                                        message.created_at
                                      )}
                                    </span>
                                  </div>

                                  {/* Bubble */}

                                  <div
                                    className={`
                                      rounded-2xl
                                      px-4
                                      py-2.5
                                      text-sm
                                      leading-6
                                      ${
                                        isLead
                                          ? "rounded-bl-md border border-white/10 bg-zinc-900 text-zinc-300"
                                          : "rounded-br-md border border-violet-500/20 bg-violet-500/10 text-violet-100"
                                      }
                                    `}
                                  >
                                    {message.description ||
                                      "No message content."}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Bottom breathing room */}

                    <div className="h-4" />
                  </section>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}