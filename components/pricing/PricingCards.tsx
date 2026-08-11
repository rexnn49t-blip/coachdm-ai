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
  "Basic AI model",
  "Reply history",
  "Email support",
];

const proFeatures = [
  "Unlimited AI replies",
  "Premium AI model",
  "Unlimited history",
  "Priority generation",
  "Copy & Export",
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

    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!token) {
      throw new Error(
        "Paddle client token is not configured."
      );
    }

    const instance = await initializePaddle({
      environment: "sandbox",
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

        {/* Cards */}

        <div className="grid gap-10 lg:grid-cols-2">

          {/* FREE */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/40">

            <div className="flex items-center gap-3">

              <Sparkles className="h-6 w-6 text-violet-400" />

              <h2 className="text-3xl font-bold">
                Free
              </h2>

            </div>

            <p className="mt-6 text-5xl font-bold">
              $0
            </p>

            <p className="mt-2 text-zinc-400">
              Perfect for getting started.
            </p>

            <div className="mt-10 space-y-5">

              {freeFeatures.map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-green-400" />

                    <span className="text-zinc-300">
                      {feature}
                    </span>
                  </div>
                )
              )}

            </div>

            <button
              disabled
              className="mt-12 w-full rounded-xl border border-white/10 bg-white/5 py-4 font-semibold transition hover:bg-white/10"
            >
              Current Plan
            </button>

          </div>

          {/* PRO */}

          <div className="relative overflow-hidden rounded-3xl border border-violet-500/40 bg-gradient-to-b from-violet-600/15 to-white/5 p-10 backdrop-blur-xl shadow-[0_0_80px_rgba(139,92,246,.25)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_120px_rgba(139,92,246,.4)]">

            {/* Badge */}

            <div className="absolute right-6 top-6 rounded-full bg-violet-500 px-4 py-1 text-sm font-semibold">
              Most Popular
            </div>

            <div className="flex items-center gap-3">

              <Crown className="h-6 w-6 text-yellow-400" />

              <h2 className="text-3xl font-bold">
                Pro
              </h2>

            </div>

            <div className="mt-8 flex items-end gap-2">

              <span className="text-6xl font-bold">
                ${monthlyPrice}
              </span>

              <span className="pb-2 text-zinc-400">
                /month
              </span>

            </div>

            <div className="mt-2 text-zinc-400">
              Everything you need to convert more leads.
            </div>

            <div className="mt-10 space-y-5">

              {proFeatures.map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <Zap className="h-5 w-5 text-violet-400" />

                    <span>
                      {feature}
                    </span>

                  </div>
                )
              )}

              <div className="flex items-center gap-3">

                <Shield className="h-5 w-5 text-violet-400" />

                <span>
                  Secure payments
                </span>

              </div>

            </div>

            {/* Upgrade */}

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-12 w-full rounded-xl bg-violet-600 py-4 text-lg font-semibold transition-all hover:-translate-y-1 hover:bg-violet-500 hover:shadow-[0_0_50px_rgba(139,92,246,.5)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Preparing checkout..."
                : "Start Free Trial"}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}