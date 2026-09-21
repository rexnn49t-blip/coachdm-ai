"use client";

import {
  BrainCircuit,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export default function AISalesLeadGeneratorHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-violet-400/[0.12] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.025] to-transparent p-7 sm:p-9 lg:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.07] blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-3 py-2 text-xs font-medium text-violet-300">
              <BrainCircuit className="h-3.5 w-3.5" />
              AI Lead Generator
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Find your next{" "}
              <span className="text-violet-400">
                ideal client.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              Turn your coaching niche into a clear ideal
              client profile and discover the type of prospects
              you should be looking for.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Target className="h-3.5 w-3.5 text-violet-400" />
                Define Your Niche
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Users className="h-3.5 w-3.5 text-violet-400" />
                Identify Ideal Clients
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Search className="h-3.5 w-3.5 text-violet-400" />
                Discover Opportunities
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                AI-Powered Insights
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full shrink-0 lg:max-w-sm">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Build your ideal client
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Let AI turn your niche into a focused profile.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <BrainCircuit className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Choose your coaching niche
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Tell CoachDM who you help and what you
                      specialize in.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Define your ideal client
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      Describe the type of person you want to
                      work with.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Generate your profile
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      AI creates a focused profile to guide
                      your lead generation.
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