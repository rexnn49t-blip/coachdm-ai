"use client";

import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

type DashboardHeaderProps = {
  firstName?: string | null;
  email?: string | null;
};

export default function DashboardHeader({
  firstName,
}: DashboardHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] via-white/[0.025] to-transparent">
      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/[0.08] blur-[100px]" />

      {/* ================= SUBTLE GRID ================= */}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.035]" />

      {/* ================= CONTENT ================= */}

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">

        {/* ================= LEFT ================= */}

        <div className="flex flex-col justify-center">

          {/* Workspace Label */}

          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-violet-400/30 bg-violet-400/[0.07] px-4 py-2 text-xs font-medium text-violet-300">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/[0.08]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-300" />
            </span>

            <span>CoachDM AI Workspace</span>
          </div>

          {/* Heading */}

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-[44px] lg:text-[48px]">
            Turn conversations into{" "}
            <span className="text-violet-400">
              coaching clients.
            </span>
          </h1>

          {/* Description */}

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-[17px]">
            Your AI sales workspace is ready. Generate better replies,
            stay on top of your leads, and keep every conversation moving
            forward.
          </p>

          {/* Status */}

          <div className="mt-7 flex flex-wrap items-center gap-4">

            <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />

              <span className="text-sm font-medium text-zinc-300">
                AI workspace ready
              </span>
            </div>

            {firstName && (
              <span className="text-sm text-zinc-600">
                Built for {firstName}
              </span>
            )}
          </div>
        </div>

        {/* ================= RIGHT — SALES FLOW ================= */}

        <div className="relative flex items-center">

          <div className="w-full rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:p-5">

            {/* Sales Flow Header */}

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-white">
                  Your sales workflow
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Keep every lead moving forward.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <Zap className="h-4 w-4" />
              </div>
            </div>

            {/* ================= STEP 1 ================= */}

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-blue-300">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-white">
                  Engage
                </p>

                <p className="mt-0.5 text-[11px] text-zinc-600">
                  Generate personalized replies
                </p>

              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-700" />
            </div>

            {/* Connector */}

            <div className="ml-8 h-3 w-px bg-gradient-to-b from-violet-400/40 to-transparent" />

            {/* ================= STEP 2 ================= */}

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                <Sparkles className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-white">
                  Follow Up
                </p>

                <p className="mt-0.5 text-[11px] text-zinc-600">
                  Stay consistent with every lead
                </p>

              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-zinc-700" />
            </div>

            {/* Connector */}

            <div className="ml-8 h-3 w-px bg-gradient-to-b from-violet-400/40 to-transparent" />

            {/* ================= STEP 3 ================= */}

            <div className="flex items-center gap-3 rounded-xl border border-emerald-400/[0.10] bg-emerald-400/[0.035] p-3.5">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-white">
                  Convert
                </p>

                <p className="mt-0.5 text-[11px] text-zinc-600">
                  Turn conversations into clients
                </p>

              </div>

              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                Goal
              </span>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}