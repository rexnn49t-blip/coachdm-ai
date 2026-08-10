"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock3,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PricingCTA() {
  return (
    <section className="relative overflow-hidden py-28">

      {/* Glow */}

      <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 to-violet-600/10 p-14 backdrop-blur-2xl"
        >

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">

              Ready to grow?

            </div>

            <h2 className="mt-8 text-5xl font-bold leading-tight text-white md:text-6xl">

              Start booking

              <br />

              more coaching clients.

            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">

              Join coaches using AI to reply faster,

              follow up consistently,

              and convert more leads into paying clients.

            </p>

            <div className="mt-12">

              <Link
                href="/sign-up"
                className="group inline-flex items-center rounded-xl bg-violet-600 px-10 py-5 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:shadow-[0_0_70px_rgba(139,92,246,.45)]"
              >

                Start Free Trial

                <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />

              </Link>

            </div>

            {/* Trust */}

            <div className="mt-16 grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <ShieldCheck className="mx-auto h-7 w-7 text-green-400" />

                <p className="mt-4 font-semibold text-white">

                  Secure Payments

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  Protected checkout powered by Paddle.

                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <Clock3 className="mx-auto h-7 w-7 text-violet-400" />

                <p className="mt-4 font-semibold text-white">

                  Cancel Anytime

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  No contracts. Stay only if you love it.

                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <CreditCard className="mx-auto h-7 w-7 text-sky-400" />

                <p className="mt-4 font-semibold text-white">

                  Instant Upgrade

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  Unlock every premium feature in seconds.

                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}