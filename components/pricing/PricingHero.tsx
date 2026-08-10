"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingHero() {
  return (
    <section className="relative overflow-hidden py-28">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-24 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.06]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">

            <Sparkles className="h-4 w-4" />

            Trusted by coaches worldwide

          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-white md:text-7xl">

            Simple pricing.

            <br />

            <span className="bg-gradient-to-r from-white via-violet-300 to-violet-500 bg-clip-text text-transparent">

              Unlimited growth.

            </span>

          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">

            Start free.

            Upgrade only when you're ready.

            No contracts.

            Cancel anytime.

          </p>

          <div className="mt-10 flex justify-center">

            <Link
              href="#plans"
              className="group inline-flex items-center rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:shadow-[0_0_60px_rgba(139,92,246,.45)]"
            >

              View Plans

              <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />

            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}