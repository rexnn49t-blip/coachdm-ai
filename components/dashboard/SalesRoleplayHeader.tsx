"use client";

import {
  BrainCircuit,
  ChartNoAxesColumnIncreasing,
  MessageSquare,
  Sparkles,
  Target,
} from "lucide-react";

export default function SalesRoleplayHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-400/[0.12] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.025] to-transparent p-7 sm:p-9 lg:p-10">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.07] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-3 py-2 text-xs font-medium text-violet-300">
              <BrainCircuit className="h-3.5 w-3.5" />
              AI Sales Roleplay
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Practice. Improve.{" "}
              <span className="text-violet-400">
                Close.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              Step into realistic sales conversations with AI
              prospects. Practice difficult situations, sharpen
              your responses, and build confidence before the
              real conversation.
            </p>

            {/* Feature indicators */}
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
                Realistic Scenarios
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                Instant Feedback
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <ChartNoAxesColumnIncreasing className="h-3.5 w-3.5 text-violet-400" />
                Track Progress
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Target className="h-3.5 w-3.5 text-violet-400" />
                Build Confidence
              </div>
            </div>
          </div>

          {/* Right — How it works */}
          <div className="w-full shrink-0 lg:max-w-sm">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    How it works
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Practice with a real sales scenario.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Choose a scenario
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Pick the type of prospect you want to
                      practice with.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Have the conversation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Respond naturally while AI plays the
                      prospect.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Review your performance
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Get a detailed score and practical
                      coaching feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}