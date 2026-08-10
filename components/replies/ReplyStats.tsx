import {
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";

type ReplyStatsProps = {
  totalReplies: number;
  favoriteReplies: number;
  repliesThisMonth: number;
};

export default function ReplyStats({
  totalReplies,
  favoriteReplies,
  repliesThisMonth,
}: ReplyStatsProps) {
  const stats = [
    {
      title: "Total Replies",
      value: totalReplies,
      icon: MessageSquare,
    },
    {
      title: "Favorites",
      value: favoriteReplies,
      icon: Star,
    },
    {
      title: "This Month",
      value: repliesThisMonth,
      icon: TrendingUp,
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-violet-500/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {stat.value}
                </h2>
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