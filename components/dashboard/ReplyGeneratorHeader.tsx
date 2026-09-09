import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";

type ReplyGeneratorHeaderProps = {
  firstName?: string | null;
  email?: string | null;
};

export default function ReplyGeneratorHeader({
  firstName,
  email,
}: ReplyGeneratorHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] via-white/[0.025] to-transparent">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/[0.07] blur-[100px]" />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.035]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Top row */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
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
              <span className="inline-block">👋</span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Generate personalized, high-converting replies
              that keep your leads engaged and move every
              conversation forward.
            </p>

            {/* User info */}
            {email && (
              <p className="mt-3 text-xs text-zinc-600">
                {email}
              </p>
            )}
          </div>

          {/* Status card */}
          <div className="shrink-0 rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] px-4 py-3 sm:min-w-[170px]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />

              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Status
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-violet-300">
              Ready to generate
            </p>
          </div>
        </div>

        {/* Bottom action row */}
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
  );
}