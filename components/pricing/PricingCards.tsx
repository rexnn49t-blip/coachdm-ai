"use client";

import { useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

import {
  Check,
  Sparkles,
  Crown,
  Zap,
  Shield,
} from "lucide-react";

import { toast } from "sonner";

const freeFeatures = [
  "3 AI replies / month",
  "3 AI lead searches / month",
  "Basic reply generation",
  "Reply history",
  "1 saved lead",
  "Email support",
];

const proFeatures = [
  "Unlimited AI replies",
  "Unlimited AI lead generation",
  "AI follow-up assistance",
  "AI sales roleplay",
  "Unlimited lead management",
  "Objection handling",
  "Priority support",
];

export default function PricingCards() {
  const [loading, setLoading] = useState(false);
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  const monthlyPrice = 29;

  async function getPaddle() {
    if (paddle) {
      return paddle;
    }

    const token =
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!token) {
      throw new Error(
        "Paddle client token is not configured."
      );
    }

    const instance = await initializePaddle({
      environment: "production",
      token,
    });

    if (!instance) {
      throw new Error(
        "Unable to initialize Paddle."
      );
    }

    setPaddle(instance);

    return instance;
  }

  async function handleUpgrade() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        "/api/paddle/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to start checkout."
        );
      }

      if (!data.transactionId) {
        throw new Error(
          "No Paddle transaction was created."
        );
      }

      const paddleInstance =
        await getPaddle();

      paddleInstance.Checkout.open({
        transactionId: data.transactionId,
      });
    } catch (error) {
      console.error(
        "Upgrade error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start checkout."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* FREE */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Free
                </h2>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Get started with the essentials
                </p>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-5xl font-bold tracking-tight text-white">
                $0
              </span>

              <span className="ml-2 text-sm text-zinc-500">
                forever
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Explore CoachDM and start turning conversations
              into opportunities.
            </p>

            <div className="mt-8 space-y-4">
              {freeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                  <span className="text-sm text-zinc-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled
              className="mt-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 text-sm font-semibold text-zinc-400"
            >
              Current Plan
            </button>
          </div>

          {/* PRO */}
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-500/[0.10] via-white/[0.025] to-transparent p-7 shadow-[0_0_70px_rgba(139,92,246,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_0_90px_rgba(139,92,246,0.18)] sm:p-9">
            {/* Subtle glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/[0.10] blur-3xl" />

            {/* Badge */}
            <div className="absolute right-6 top-6 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
              Pro
            </div>

            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <Crown className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Pro
                </h2>

                <p className="mt-0.5 text-xs text-violet-300/60">
                  Full access to CoachDM
                </p>
              </div>
            </div>

            <div className="relative mt-8 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">
                ${monthlyPrice}
              </span>

              <span className="pb-1.5 text-sm text-zinc-500">
                /month
              </span>
            </div>

            <p className="relative mt-3 text-sm leading-6 text-zinc-400">
              Everything you need to manage conversations,
              leads, follow-ups, and sales.
            </p>

            <div className="relative mt-8 space-y-4">
              {proFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3"
                >
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

                  <span className="text-sm text-zinc-200">
                    {feature}
                  </span>
                </div>
              ))}

              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

                <span className="text-sm text-zinc-200">
                  Secure payments
                </span>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="relative mt-10 w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Preparing checkout..."
                : "Upgrade to Pro"}
            </button>

            <p className="relative mt-3 text-center text-[11px] text-zinc-600">
              Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}