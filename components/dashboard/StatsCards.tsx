import {
  Bot,
  Users,
  Clock3,
  Crown,
} from "lucide-react";

type StatsCardsProps = {
  stats: {
    totalReplies: number;
    repliesToday: number;
    repliesThisMonth: number;
    favoriteTone: string;

    activeLeads: number;
    followUpsDue: number;

    plan: "FREE" | "PRO";
    monthlyLimit: number | null;
  };
};

export default function StatsCards({
  stats,
}: StatsCardsProps) {
  const usagePercentage =
    stats.monthlyLimit === null
      ? 100
      : Math.min(
          (stats.repliesThisMonth /
            stats.monthlyLimit) *
            100,
          100
        );

  const cards = [
    {
      title: "Replies Generated",
      value: stats.totalReplies,
      icon: Bot,
      type: "replies",
    },
    {
      title: "Active Leads",
      value: stats.activeLeads,
      icon: Users,
      type: "leads",
    },
    {
      title: "Follow-Ups Due",
      value: stats.followUpsDue,
      icon: Clock3,
      type: "followups",
    },
    {
      title: "Current Plan",
      value: stats.plan,
      icon: Crown,
      type: "plan",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-white/[0.04]"
          >
            {/* Subtle glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-500/[0.06] blur-2xl transition-all duration-300 group-hover:bg-violet-500/[0.10]" />

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                {/* Title */}
                <p className="text-sm font-medium text-zinc-400">
                  {card.title}
                </p>

                {/* Main Value */}
                <h2
                  className={`mt-3 font-bold tracking-tight text-white ${
                    card.type === "plan"
                      ? "text-3xl"
                      : "text-4xl"
                  }`}
                >
                  {card.value}
                </h2>

                {/* Replies Usage */}
                {card.type === "replies" && (
                  <>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                        style={{
                          width: `${usagePercentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      {stats.monthlyLimit === null
                        ? "Unlimited replies"
                        : `${stats.repliesThisMonth}/${stats.monthlyLimit} replies used`}
                    </p>
                  </>
                )}

                {/* Active Leads */}
                {card.type === "leads" && (
                  <p className="mt-4 text-xs text-zinc-500">
                    Currently in your pipeline
                  </p>
                )}

                {/* Follow-Ups */}
                {card.type === "followups" && (
                  <p className="mt-4 text-xs text-zinc-500">
                    Leads awaiting follow-up
                  </p>
                )}

                {/* Plan Badge */}
                {card.type === "plan" && (
                  <div className="mt-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        stats.plan === "PRO"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-violet-500/15 text-violet-300"
                      }`}
                    >
                      {stats.plan === "PRO"
                        ? "Unlimited Access"
                        : "Free Plan"}
                    </span>
                  </div>
                )}
              </div>

              {/* Icon */}
              <div className="relative ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/[0.08] bg-violet-500/[0.10]">
                <Icon className="h-6 w-6 text-violet-400" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}