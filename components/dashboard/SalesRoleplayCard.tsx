"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit } from "lucide-react";

export default function SalesRoleplayCard() {
  return (
    <Link
      href="/dashboard?view=sales-roleplay"
      className="group relative flex h-[248px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.025] to-transparent p-6 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.035] sm:p-7"
    >
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-3xl transition-all duration-500 group-hover:bg-violet-500/[0.12]" />

      <div className="relative flex h-full flex-col">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-500 transition-all duration-300 group-hover:border-violet-400/20 group-hover:text-violet-300">
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            AI Sales Roleplay
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
            Practice difficult sales conversations and build confidence with AI.
          </p>
        </div>

        {/* Action */}
        <div className="mt-auto inline-flex min-w-[164px] items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-all duration-300 group-hover:border-violet-400/20 group-hover:bg-violet-500/[0.06] group-hover:text-white">
          Start Roleplay
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}