"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Heart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  X,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

type ReplyGeneratorHeaderProps = {
  firstName?: string | null;
  email?: string | null;
};

const tones = [
  {
    name: "Professional",
    icon: BriefcaseBusiness,
    description:
      "Clear, polished, and balanced. Keeps your message natural while maintaining a trustworthy coaching tone.",
    useWhen:
      "Use for everyday conversations, new leads, or whenever you want to sound professional and approachable.",
  },
  {
    name: "Confident",
    icon: ShieldCheck,
    description:
      "Direct, assured, and decisive. Communicates confidence in your coaching without sounding aggressive.",
    useWhen:
      "Use when a lead is interested, asks about your offer, or is ready for a clear next step.",
  },
  {
    name: "Empathetic",
    icon: Heart,
    description:
      "Warm, understanding, and supportive. Acknowledges the lead's feelings before moving the conversation forward.",
    useWhen:
      "Use when a lead shares a struggle, hesitation, concern, or something personal.",
  },
  {
    name: "Persuasive",
    icon: Target,
    description:
      "Focused on communicating value and helping the lead see why taking action makes sense without being pushy.",
    useWhen:
      "Use when a lead understands the problem but needs more motivation, value, or clarity to move forward.",
  },
  {
  name: "Friendly",
  icon: MessageCircle,
  description:
    "Warm, approachable, and conversational without sounding overly formal or salesy.",
  useWhen:
    "Use when you want to build rapport and keep the conversation natural.",
},
];

export default function ReplyGeneratorHeader({
  firstName,
  email,
}: ReplyGeneratorHeaderProps) {
  const [toneGuideOpen, setToneGuideOpen] =
    useState(false);

  return (
    <>
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] via-white/[0.025] to-transparent">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/[0.07] blur-[100px]" />

        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.035]" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* ================================================== */}
          {/* TOP ROW */}
          {/* ================================================== */}

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Left Content */}
            <div>
              {/* Page label */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-medium text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI Reply Generator
              </div>

              {/* Heading */}
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.1]">
                Welcome back,
                <br />

                <span className="text-violet-400">
                  {firstName || "Coach"}
                </span>{" "}
                <span className="inline-block">
                  👋
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Generate personalized, high-converting
                replies that keep your leads engaged and
                move every conversation forward.
              </p>

              {/* User info */}
              {email && (
                <p className="mt-3 text-xs text-zinc-600">
                  {email}
                </p>
              )}
            </div>

            {/* ================================================== */}
            {/* STATUS + TONE GUIDE */}
            {/* ================================================== */}

            <div className="shrink-0 sm:w-[190px]">
              {/* Status Card */}
              <div className="flex flex-col items-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />

                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Status
                  </span>
                </div>

                <p className="mt-1.5 text-sm font-semibold text-violet-300">
                  Ready to generate
                </p>
              </div>

              {/* Tone Guide Button */}
              <button
                type="button"
                onClick={() =>
                  setToneGuideOpen(true)
                }
                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4 text-left transition-all duration-200 hover:border-violet-400/25 hover:bg-violet-400/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-300">
                      Tone Guide
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-600">
                      Choose the right tone
                    </p>
                  </div>
                </div>

                <span className="ml-2 text-sm text-violet-300/60">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* BOTTOM ACTION ROW */}
          {/* ================================================== */}

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:border-violet-400/20 hover:bg-violet-400/[0.06] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Link>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-2.5 text-xs text-zinc-500">
              <WandSparkles className="h-3.5 w-3.5 text-violet-300" />
              AI-powered replies
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-2.5 text-xs text-zinc-500">
              <MessageSquare className="h-3.5 w-3.5 text-blue-300" />
              Personalized for every lead
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* TONE GUIDE MODAL */}
      {/* ================================================== */}

      {toneGuideOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setToneGuideOpen(false);
            }
          }}
        >
          {/* Modal */}
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/[0.10] bg-[#101014] shadow-2xl shadow-black/60">
            {/* Modal glow */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-600/[0.10] blur-[110px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-[100px]" />

            {/* ================================================== */}
            {/* MODAL HEADER */}
            {/* ================================================== */}

            <div className="relative flex items-start justify-between border-b border-white/[0.06] px-7 py-7 sm:px-9 sm:py-8">
              <div className="max-w-2xl">
                {/* Label */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3.5 py-1.5 text-xs font-medium text-violet-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Tone Guide
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Choose the right tone
                </h2>

                {/* Description */}
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-[15px]">
                  Every lead responds differently. Choose
                  the tone that best matches the situation
                  and let AI shape your reply accordingly.
                </p>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() =>
                  setToneGuideOpen(false)
                }
                className="ml-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-500 transition hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
                aria-label="Close tone guide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ================================================== */}
            {/* TONE CARDS */}
            {/* ================================================== */}

            <div className="relative grid gap-4 p-7 sm:grid-cols-2 sm:gap-5 sm:p-9">
              {tones.map((tone) => {
                const Icon = tone.icon;

                return (
                  <div
                    key={tone.name}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-200 hover:border-violet-400/20 hover:bg-white/[0.04] sm:p-6"
                  >
                    {/* Tone title */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 transition group-hover:bg-violet-400/[0.14]">
                        <Icon className="h-5 w-5 text-violet-300" />
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {tone.name}
                        </h3>

                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-violet-300/50">
                          AI Reply Tone
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-5 text-sm leading-6 text-zinc-500">
                      {tone.description}
                    </p>

                    {/* Best used when */}
                    <div className="mt-5 rounded-xl border border-white/[0.05] bg-black/20 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                        Best used when
                      </p>

                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        {tone.useWhen}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================================================== */}
            {/* MODAL FOOTER */}
            {/* ================================================== */}

            <div className="relative border-t border-white/[0.06] bg-white/[0.015] px-7 py-5 sm:px-9">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-400/10">
                  <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                </div>

                <div>
                  <p className="text-xs font-medium text-zinc-300">
                    Not sure which tone to choose?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Start with{" "}
                    <span className="text-zinc-400">
                      Professional
                    </span>{" "}
                    for most conversations. Switch to
                    Empathetic when a lead shares a
                    concern, Confident when they're ready
                    for a decision, or Persuasive when they
                    need more value and motivation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}