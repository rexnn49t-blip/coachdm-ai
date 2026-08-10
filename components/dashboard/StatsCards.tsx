import {
  Bot,
  TrendingUp,
  History,
  Crown,
} from "lucide-react";

type StatsCardsProps = {
  stats: {
    totalReplies: number;
    repliesToday: number;
    repliesThisMonth: number;
    favoriteTone: string;
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
          (stats.repliesThisMonth / stats.monthlyLimit) * 100,
          100
        );

  const cards = [
    {
      title: "Replies Today",
      value: stats.repliesToday,
      icon: Bot,
    },
    {
      title: "This Month",
      value: stats.repliesThisMonth,
      icon: TrendingUp,
    },
    {
      title: "Total Replies",
      value: stats.totalReplies,
      icon: History,
    },
    {
      title: "Current Plan",
      value: stats.plan,
      icon: Crown,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-zinc-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-white">
                  {card.value}
                </h2>

                {/* Usage Progress */}
                {index === 1 && (
                  <>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
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

                {/* Plan Badge */}
                {index === 3 && (
                  <div className="mt-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        stats.plan === "PRO"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-violet-500/20 text-violet-300"
                      }`}
                    >
                      {stats.plan === "PRO"
                        ? "Unlimited Access"
                        : "Free Plan"}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-violet-500/10 p-3">
                <Icon className="h-6 w-6 text-violet-400" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}