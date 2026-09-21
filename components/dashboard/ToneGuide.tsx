"use client";

import { useState } from "react";
import { X, Sparkles, Briefcase, ShieldCheck, Heart, Target } from "lucide-react";

const tones = [
  {
    name: "Professional",
    icon: Briefcase,
    description:
      "Clear, polished, and balanced. Keeps the conversation natural while maintaining a professional coaching tone.",
    useWhen:
      "Use this for most everyday conversations, new leads, and situations where you want to sound trustworthy and professional.",
  },
  {
    name: "Confident",
    icon: ShieldCheck,
    description:
      "Direct, assured, and decisive. Shows confidence in your coaching without sounding aggressive.",
    useWhen:
      "Use this when a lead is already interested, asks about your offer, or needs a clear next step.",
  },
  {
    name: "Empathetic",
    icon: Heart,
    description:
      "Warm, understanding, and supportive. Acknowledges the lead's feelings before moving the conversation forward.",
    useWhen:
      "Use this when a lead shares a struggle, hesitation, personal challenge, or emotional concern.",
  },
  {
    name: "Persuasive",
    icon: Target,
    description:
      "Focused on showing value and helping the lead see why taking action makes sense, without sounding pushy.",
    useWhen:
      "Use this when the lead understands the problem but needs more motivation, value, or clarity before taking action.",
  },
];

export default function ToneGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-violet-400/20 hover:bg-white/[0.05]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Sparkles className="h-4 w-4 text-violet-300" />
          </div>

          <div>
            <p className="text-xs font-medium text-white/70">
              Tone Guide
            </p>

            <p className="mt-0.5 text-[10px] text-white/30">
              Learn which tone to use for each conversation
            </p>
          </div>
        </div>

        <span className="text-xs text-violet-300/70">
          View guide →
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl shadow-black/60">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                  </div>

                  <span className="text-sm font-medium text-violet-300">
                    AI Tone Guide
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-white">
                  Choose the right tone
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/40">
                  Different conversations need different approaches.
                  Choose a tone based on where your lead is in the
                  conversation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Close tone guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tone Cards */}
            <div className="grid gap-3 p-6 sm:grid-cols-2">
              {tones.map((tone) => {
                const Icon = tone.icon;

                return (
                  <div
                    key={tone.name}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-violet-400/20 hover:bg-white/[0.04]"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                        <Icon className="h-4 w-4 text-violet-300" />
                      </div>

                      <h3 className="text-sm font-semibold text-white">
                        {tone.name}
                      </h3>
                    </div>

                    <p className="text-xs leading-5 text-white/50">
                      {tone.description}
                    </p>

                    <div className="mt-3 border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-white/25">
                        Best used when
                      </p>

                      <p className="mt-1.5 text-xs leading-5 text-white/40">
                        {tone.useWhen}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-4">
              <p className="text-center text-[11px] text-white/25">
                Not sure which to choose?{" "}
                <span className="text-white/40">
                  Professional is a good default for most conversations.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}