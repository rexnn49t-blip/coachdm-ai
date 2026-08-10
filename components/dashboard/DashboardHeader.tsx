import { Sparkles } from "lucide-react";

type DashboardHeaderProps = {
  firstName?: string | null;
  email?: string | null;
};

export default function DashboardHeader({
  firstName,
  email,
}: DashboardHeaderProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-violet-400" />

          <span className="text-sm font-medium text-violet-300">
            CoachDM AI Dashboard
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Welcome back,
          <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            {firstName || "Coach"} 👋
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
          Generate high-converting replies, manage your history,
          and convert more leads into coaching clients.
        </p>

        {email && (
          <p className="mt-2 text-xs text-zinc-500 sm:text-sm">
            {email}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex flex-wrap gap-3 lg:justify-end">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Status
          </p>

          <p className="mt-1 font-semibold text-violet-300">
            Ready to generate
          </p>
        </div>
      </div>
    </section>
  );
}