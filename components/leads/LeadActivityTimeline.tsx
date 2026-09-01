import type {
  LeadActivity,
  LeadActivityType,
} from "@/lib/lead-activities";

type LeadActivityTimelineProps = {
  activities: LeadActivity[];
};

const activityConfig: Record<
  LeadActivityType,
  {
    icon: string;
    iconClass: string;
  }
> = {
  lead_created: {
    icon: "+",
    iconClass:
      "bg-sky-500/15 text-sky-300",
  },

  ai_guidance_generated: {
    icon: "✨",
    iconClass:
      "bg-violet-500/15 text-violet-300",
  },

  message_sent: {
    icon: "↗",
    iconClass:
      "bg-blue-500/15 text-blue-300",
  },

  lead_replied: {
    icon: "💬",
    iconClass:
      "bg-cyan-500/15 text-cyan-300",
  },

  stage_updated: {
    icon: "→",
    iconClass:
      "bg-orange-500/15 text-orange-300",
  },

  intent_updated: {
    icon: "◎",
    iconClass:
      "bg-pink-500/15 text-pink-300",
  },

  temperature_updated: {
    icon: "🔥",
    iconClass:
      "bg-red-500/15 text-red-300",
  },

  note_added: {
    icon: "✎",
    iconClass:
      "bg-yellow-500/15 text-yellow-300",
  },

  action_completed: {
    icon: "✓",
    iconClass:
      "bg-emerald-500/15 text-emerald-300",
  },

  lead_converted: {
    icon: "🎉",
    iconClass:
      "bg-emerald-500/15 text-emerald-300",
  },
};

function formatActivityDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

export default function LeadActivityTimeline({
  activities,
}: LeadActivityTimelineProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70">
      {/* Header */}

      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Journey Activity
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Everything that has happened with this lead.
          </p>
        </div>

        <div className="flex h-8 min-w-8 items-center justify-center rounded-full border border-zinc-800 bg-black px-2 text-xs font-medium text-zinc-400">
          {activities.length}
        </div>
      </div>

      {/* Empty State */}

      {activities.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-xl">
            ✦
          </div>

          <h3 className="mt-4 text-sm font-medium text-white">
            No activity yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Activity from messages, replies, stage
            updates, AI guidance, and completed
            actions will appear here.
          </p>
        </div>
      ) : (
        <div className="px-6 py-6">
          <div className="space-y-0">
            {activities.map(
              (activity, index) => {
                const config =
                  activityConfig[
                    activity.activity_type
                  ] ??
                  activityConfig.note_added;

                const isLast =
                  index ===
                  activities.length - 1;

                return (
                  <div
                    key={activity.id}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    {/* Timeline line */}

                    {!isLast && (
                      <div className="absolute left-5 top-11 bottom-0 w-px bg-zinc-800" />
                    )}

                    {/* Activity icon */}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm shadow-lg ${config.iconClass}`}
                    >
                      {config.icon}
                    </div>

                    {/* Activity content */}

                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3 className="text-sm font-semibold text-zinc-200">
                          {activity.title}
                        </h3>

                        <span className="shrink-0 text-xs text-zinc-600">
                          {formatActivityDate(
                            activity.created_at
                          )}
                        </span>
                      </div>

                      {activity.description && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-500">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </section>
  );
}