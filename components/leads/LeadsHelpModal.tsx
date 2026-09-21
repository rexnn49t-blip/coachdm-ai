"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  HelpCircle,
  Target,
  Trophy,
  Flame,
  MessageCircle,
  Clock3,
  AlertTriangle,
  UserPlus,
  Sparkles,
  MessagesSquare,
  WandSparkles,
  Route,
  Flag,
  FileText,
  StickyNote,
  Activity,
  UserCheck,
  Users,
} from "lucide-react";

export default function LeadsHelpModal() {
  const [open, setOpen] = useState(false);

  const dailyBriefItems = [
    {
      icon: Target,
      title: "Today's Priorities",
      description:
        "Shows the leads that need your attention today, so you can focus on the most relevant conversations instead of checking every lead manually.",
    },
    {
      icon: Trophy,
      title: "Best Opportunity Today",
      description:
        "Highlights the lead that currently has the strongest opportunity based on conversation activity, interest, temperature, and journey progress.",
    },
    {
      icon: Flame,
      title: "Hot Leads",
      description:
        "Shows leads with a hot temperature so you can quickly identify conversations that may need attention.",
    },
    {
      icon: MessageCircle,
      title: "Replies Waiting",
      description:
        "Shows leads who have replied and may be waiting for you to respond.",
    },
    {
      icon: Clock3,
      title: "Follow-Ups",
      description:
        "Highlights follow-ups that are due or need your attention so conversations don't quietly go cold.",
    },
    {
      icon: AlertTriangle,
      title: "Attention Needed",
      description:
        "Surfaces conversations where something may require your attention, such as an objection or an important change in the lead's situation.",
    },
  ];

  const workspaceItems = [
    {
      icon: UserPlus,
      title: "Add a Lead",
      description:
        "Create a lead with their name, contact information, goal, source, first message, and other useful context.",
    },
    {
      icon: Sparkles,
      title: "AI Guidance",
      description:
        "CoachDM analyzes the lead and conversation to help you understand their situation, intent, temperature, current stage, and recommended next step.",
    },
    {
      icon: MessagesSquare,
      title: "Conversation",
      description:
        "Record messages from the lead and your replies. This creates conversation context that CoachDM can use for future guidance and replies.",
    },
    {
      icon: WandSparkles,
      title: "AI Reply Generator",
      description:
        "Generate a personalized response for the lead using the information and conversation context already stored in CoachDM.",
    },
    {
      icon: Route,
      title: "Lead Journey",
      description:
        "Track where the lead currently is in the sales conversation and move them through the appropriate stages as the relationship develops.",
    },
    {
      icon: Flag,
      title: "Lead Goal",
      description:
        "Keep the lead's coaching goal visible so your conversations stay connected to what they actually want to achieve.",
    },
    {
      icon: FileText,
      title: "First Message",
      description:
        "Keep the original message from the lead available as important context for understanding how the conversation started.",
    },
    {
      icon: StickyNote,
      title: "Coach Notes",
      description:
        "Store useful information, observations, objections, preferences, or anything else you want to remember about the lead.",
    },
    {
      icon: Activity,
      title: "Activity Timeline",
      description:
        "See important actions and conversation events in chronological order so you can understand what has happened with the lead.",
    },
    {
      icon: Users,
      title: "Contact",
      description:
        "Keep the lead's available contact details and source information accessible from their workspace.",
    },
    {
      icon: Clock3,
      title: "Smart Follow-Up",
      description:
        "Start a follow-up sequence when a conversation needs another touch. CoachDM keeps track of when the next follow-up should happen.",
    },
    {
      icon: UserCheck,
      title: "Convert to Client",
      description:
        "When the lead becomes a client, convert them to Client so their journey is recorded as completed.",
    },
  ];

  const journeyStages = [
    "New",
    "Initial Conversation",
    "Discovery",
    "Qualification",
    "Objection",
    "Offer",
    "Follow-Up",
    "Call / Payment",
    "Client",
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-violet-500/40 hover:bg-zinc-900 hover:text-white"
      >
        <HelpCircle className="h-4 w-4 text-violet-400" />
        How Leads & Follow-Ups Work
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-6 lg:px-10 lg:py-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setOpen(false);
              }
            }}
          >
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
              {/* Header */}
              <div className="flex shrink-0 items-start justify-between border-b border-zinc-800 px-6 py-6 sm:px-8 lg:px-10 lg:py-7">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                    <HelpCircle className="h-6 w-6 text-violet-400" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        How Leads & Follow-Ups Work
                      </h2>

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                        Quick Guide
                      </span>
                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
                      Everything you need to know about the Leads area —
                      from today's priorities and opportunities to
                      conversations, follow-ups, and converting a lead into a
                      client.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="ml-4 shrink-0 rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main content */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
                  {/* Daily Coach Brief */}
                  <section>
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                        Start Here
                      </p>

                      <h3 className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
                        Daily Coach Brief
                      </h3>

                      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-zinc-500">
                        This gives you a quick overview of what deserves your
                        attention instead of making you inspect every lead.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {dailyBriefItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="rounded-2xl border border-zinc-800 bg-white/[0.025] p-5 transition hover:border-zinc-700 hover:bg-white/[0.04]"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                                <Icon className="h-4.5 w-4.5 text-violet-400" />
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  {item.title}
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Divider */}
                  <div className="my-10 h-px bg-zinc-800" />

                  {/* Lead Workspace */}
                  <section>
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                        Inside Each Lead
                      </p>

                      <h3 className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
                        Lead Workspace
                      </h3>

                      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-zinc-500">
                        Each lead has a dedicated workspace where you can
                        understand the conversation, take action, and keep
                        everything organized.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {workspaceItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="group rounded-2xl border border-zinc-800 bg-white/[0.025] p-5 transition hover:border-zinc-700 hover:bg-white/[0.04] lg:p-6"
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                                <Icon className="h-5 w-5 text-violet-400" />

                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-[10px] font-semibold text-zinc-500">
                                  {index + 1}
                                </span>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  {item.title}
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Divider */}
                  <div className="my-10 h-px bg-zinc-800" />

                  {/* Journey */}
                  <section>
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                        The Big Picture
                      </p>

                      <h3 className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
                        How a Lead Moves Through CoachDM
                      </h3>

                      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-zinc-500">
                        The journey helps you understand where a conversation
                        currently stands and what kind of action may be needed
                        next.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-5 sm:p-6 lg:p-7">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {journeyStages.map((stage, index) => (
                          <div
                            key={stage}
                            className="flex items-center gap-2.5"
                          >
                            <span className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300">
                              {stage}
                            </span>

                            {index < journeyStages.length - 1 && (
                              <span className="text-zinc-600">→</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 border-t border-violet-500/10 pt-5">
                        <p className="text-sm leading-6 text-zinc-400">
                          You don't have to move through every stage manually.
                          Update the journey as the conversation develops so
                          CoachDM can keep the lead's current situation clear.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Divider */}
                  <div className="my-10 h-px bg-zinc-800" />

                  {/* Follow-up explanation */}
                  <section>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-7 lg:p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                          <Clock3 className="h-5 w-5 text-violet-400" />
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-white sm:text-lg">
                            Smart Follow-Ups
                          </h3>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                            When a conversation needs another touch, start a
                            follow-up sequence from the lead workspace.
                            CoachDM keeps track of the follow-up timing so you
                            know which conversations need attention.
                          </p>

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                              <p className="text-sm font-medium text-white">
                                Start
                              </p>
                              <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Begin a follow-up sequence for the lead.
                              </p>
                            </div>

                            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                              <p className="text-sm font-medium text-white">
                                Track
                              </p>
                              <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Keep track of when the next contact is due.
                              </p>
                            </div>

                            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                              <p className="text-sm font-medium text-white">
                                Continue
                              </p>
                              <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Keep the conversation moving toward the next
                                stage.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Final message */}
                  <div className="mt-8 rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] px-6 py-6 text-center sm:px-8">
                    <p className="text-sm font-medium text-white sm:text-base">
                      You don't need to manage everything at once.
                    </p>

                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                      Start by adding a lead and recording the conversation.
                      CoachDM will help you understand the situation, identify
                      what needs attention, and keep the next steps organized.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-zinc-800 px-6 py-4 sm:px-8 lg:px-10">
                <p className="hidden text-xs text-zinc-600 sm:block">
                  You can open this guide anytime from the Leads page.
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ml-auto rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}