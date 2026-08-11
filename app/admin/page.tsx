import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import AdminUserActions from "@/components/admin/AdminUserActions";

type Subscription = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  plan: string;
  status: string;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  paddle_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  replies_used?: number | null;
  replies_limit?: number | null;
  created_at: string;
  updated_at: string;
};

type Reply = {
  id: string;
  clerk_user_id: string;
  lead_message: string;
  ai_reply: string;
  tone: string | null;
  length: string | null;
  created_at: string;
  favorite: boolean;
};

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (userId !== process.env.ADMIN_USER_ID) {
    redirect("/dashboard");
  }

  // -----------------------------------------
  // FETCH SUBSCRIPTIONS
  // -----------------------------------------

  const {
    data: subscriptionData,
    error: subscriptionsError,
  } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (subscriptionsError) {
    console.error(
      "Admin subscriptions error:",
      subscriptionsError
    );
  }

  const users =
    (subscriptionData as Subscription[]) ?? [];

  // -----------------------------------------
  // FETCH RECENT REPLIES
  // -----------------------------------------

  const {
    data: replyData,
    error: repliesError,
  } = await supabaseAdmin
    .from("replies")
    .select(
      "id, clerk_user_id, lead_message, ai_reply, tone, length, created_at, favorite"
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(30);

  if (repliesError) {
    console.error(
      "Admin replies error:",
      repliesError
    );
  }

  const replies = (replyData as Reply[]) ?? [];

  // -----------------------------------------
  // STATISTICS
  // -----------------------------------------

  const totalUsers = users.length;

  const proUsers = users.filter(
    (user) =>
      user.plan?.toLowerCase() === "pro" &&
      ["active", "trialing"].includes(
        user.status?.toLowerCase()
      )
  ).length;

  const freeUsers = users.filter(
    (user) =>
      user.plan?.toLowerCase() === "free"
  ).length;

  const canceledUsers = users.filter(
    (user) =>
      user.status?.toLowerCase() ===
      "canceled"
  ).length;

  const totalReplies = users.reduce(
    (total, user) =>
      total +
      Number(user.replies_used ?? 0),
    0
  );

  const usersAtLimit = users.filter(
    (user) => {
      const plan =
        user.plan?.toLowerCase();

      const used = Number(
        user.replies_used ?? 0
      );

      const limit = Number(
        user.replies_limit ?? 3
      );

      return (
        plan === "free" &&
        used >= limit
      );
    }
  ).length;

  const usersNearLimit = users.filter(
    (user) => {
      const plan =
        user.plan?.toLowerCase();

      const used = Number(
        user.replies_used ?? 0
      );

      const limit = Number(
        user.replies_limit ?? 3
      );

      return (
        plan === "free" &&
        used > 0 &&
        used < limit &&
        used / limit >= 0.66
      );
    }
  ).length;

  const conversionRate =
    totalUsers > 0
      ? Math.round(
          (proUsers / totalUsers) * 100
        )
      : 0;

  const favoriteReplies =
    replies.filter(
      (reply) => reply.favorite
    ).length;

  // -----------------------------------------
  // HELPERS
  // -----------------------------------------

  const getUserEmail = (
    clerkUserId: string
  ) => {
    const user = users.find(
      (item) =>
        item.clerk_user_id ===
        clerkUserId
    );

    return (
      user?.email ??
      "Unknown user"
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <header className="mb-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                  <span className="text-xs font-bold">
                    C
                  </span>
                </div>

                <span className="text-sm font-medium text-white/50">
                  CoachDM AI
                </span>

                <span className="text-white/20">
                  /
                </span>

                <span className="text-sm text-white/40">
                  Admin
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Manage users, monitor subscriptions,
                and track AI usage from one place.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-medium text-white/60">
                  System operational
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ================================= */}
        {/* OVERVIEW */}
        {/* ================================= */}

        <section>
          <SectionHeader
            title="Overview"
            description="A quick look at your platform."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              label="Total users"
              value={totalUsers}
              description="Registered accounts"
            />

            <MetricCard
              label="Pro users"
              value={proUsers}
              description={`${conversionRate}% conversion`}
              accent="pro"
            />

            <MetricCard
              label="Free users"
              value={freeUsers}
              description="Free plan accounts"
            />

            <MetricCard
              label="AI replies"
              value={totalReplies}
              description="Replies generated"
            />

          </div>
        </section>

        {/* ================================= */}
        {/* SUBSCRIPTIONS */}
        {/* ================================= */}

        <section className="mt-10">
          <SectionHeader
            title="Subscriptions"
            description="Understand how users are distributed across plans."
          />

          <div className="grid gap-4 lg:grid-cols-3">

            <InfoCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/40">
                    Pro conversion
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {conversionRate}%
                  </p>
                </div>

                <Badge variant="pro">
                  PRO
                </Badge>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{
                    width: `${conversionRate}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-white/30">
                {proUsers} of {totalUsers} users
                are currently Pro.
              </p>
            </InfoCard>

            <InfoCard>
              <p className="text-sm text-white/40">
                Active Pro
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {proUsers}
              </p>

              <p className="mt-3 text-xs text-white/30">
                Active and trialing Pro
                subscriptions.
              </p>
            </InfoCard>

            <InfoCard>
              <p className="text-sm text-white/40">
                Canceled
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {canceledUsers}
              </p>

              <p className="mt-3 text-xs text-white/30">
                Accounts with canceled
                subscriptions.
              </p>
            </InfoCard>

          </div>
        </section>

        {/* ================================= */}
        {/* USAGE */}
        {/* ================================= */}

        <section className="mt-10">
          <SectionHeader
            title="AI usage"
            description="Monitor Free-plan limits and engagement."
          />

          <div className="grid gap-4 sm:grid-cols-3">

            <SmallMetric
              label="Replies generated"
              value={totalReplies}
            />

            <SmallMetric
              label="At Free limit"
              value={usersAtLimit}
              warning={usersAtLimit > 0}
            />

            <SmallMetric
              label="Near Free limit"
              value={usersNearLimit}
            />

          </div>
        </section>

        {/* ================================= */}
        {/* USERS */}
        {/* ================================= */}

        <section className="mt-10">
          <SectionHeader
            title="Users"
            description="Manage plans and monitor individual usage."
          />

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">

                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <TableHeader>
                      User
                    </TableHeader>

                    <TableHeader>
                      Plan
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Usage
                    </TableHeader>

                    <TableHeader>
                      Billing
                    </TableHeader>

                    <TableHeader>
                      Joined
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {

                    const plan =
                      user.plan?.toLowerCase();

                    const isPro =
                      plan === "pro";

                    const used =
                      Number(
                        user.replies_used ?? 0
                      );

                    const limit =
                      Number(
                        user.replies_limit ?? 3
                      );

                    const percentage =
                      isPro ||
                      limit <= 0
                        ? 0
                        : Math.min(
                            Math.round(
                              (used /
                                limit) *
                                100
                            ),
                            100
                          );

                    const hasPaddleSubscription =
                      Boolean(
                        user.paddle_subscription_id
                      );

                    return (
                      <tr
                        key={user.id}
                        className="group border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]"
                      >

                        {/* USER */}

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-white/70">
                              {getInitials(
                                user.email
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {user.email ??
                                  "No email"}
                              </p>

                              <p className="mt-1 max-w-[260px] truncate text-[11px] text-white/25">
                                {user.clerk_user_id}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* PLAN */}

                        <td className="px-5 py-5">
                          <Badge
                            variant={
                              isPro
                                ? "pro"
                                : "free"
                            }
                          >
                            {isPro
                              ? "PRO"
                              : "FREE"}
                          </Badge>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status?.toLowerCase() ===
                                "active"
                                  ? "bg-emerald-400"
                                  : "bg-white/20"
                              }`}
                            />

                            <span className="text-sm text-white/55">
                              {user.status ??
                                "Unknown"}
                            </span>
                          </div>
                        </td>

                        {/* USAGE */}

                        <td className="px-5 py-5">

                          {isPro ? (
                            <span className="text-sm text-white/35">
                              Unlimited
                            </span>
                          ) : (
                            <div className="w-[150px]">

                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs text-white/55">
                                  {used} / {limit}
                                </span>

                                <span className="text-[11px] text-white/25">
                                  {percentage}%
                                </span>
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    percentage >=
                                    100
                                      ? "bg-red-400"
                                      : percentage >=
                                        66
                                      ? "bg-yellow-400"
                                      : "bg-white"
                                  }`}
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>

                            </div>
                          )}

                        </td>

                        {/* BILLING */}

                        <td className="px-5 py-5">

                          {hasPaddleSubscription ? (
                            <div>
                              <span className="text-sm text-white/60">
                                Paddle
                              </span>

                              <p className="mt-1 text-[10px] text-white/25">
                                Subscription connected
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-sm text-white/45">
                                Manual
                              </span>

                              <p className="mt-1 text-[10px] text-white/25">
                                No Paddle subscription
                              </p>
                            </div>
                          )}

                        </td>

                        {/* JOINED */}

                        <td className="px-5 py-5">
                          <span className="text-sm text-white/40">
                            {formatDate(
                              user.created_at
                            )}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-5 text-right">
                          <AdminUserActions
                            userId={
                              user.clerk_user_id
                            }
                            email={
                              user.email
                            }
                            plan={
                              isPro
                                ? "pro"
                                : "free"
                            }
                            hasPaddleSubscription={
                              hasPaddleSubscription
                            }
                          />
                        </td>

                      </tr>
                    );
                  })}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-16 text-center"
                      >
                        <p className="text-sm text-white/40">
                          No users found.
                        </p>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================================= */}
        {/* RECENT ACTIVITY */}
        {/* ================================= */}

        <section className="mt-10 pb-10">
          <SectionHeader
            title="Recent AI activity"
            description="The latest replies generated by your users."
          />

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

            {replies.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm text-white/40">
                  No AI activity yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">

                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="px-5 py-5 transition-colors hover:bg-white/[0.02] sm:px-6"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0 flex-1">

                        <div className="mb-3 flex flex-wrap items-center gap-2">

                          <span className="text-sm font-medium text-white">
                            {getUserEmail(
                              reply.clerk_user_id
                            )}
                          </span>

                          <Badge variant="subtle">
                            {reply.tone ??
                              "Professional"}
                          </Badge>

                          <Badge variant="subtle">
                            {reply.length ??
                              "Medium"}
                          </Badge>

                          {reply.favorite && (
                            <span className="text-xs text-white/40">
                              ★ Favorite
                            </span>
                          )}

                        </div>

                        <div className="grid gap-3 lg:grid-cols-2">

                          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                              Lead
                            </p>

                            <p className="line-clamp-3 text-sm leading-6 text-white/55">
                              {reply.lead_message}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                              AI reply
                            </p>

                            <p className="line-clamp-3 text-sm leading-6 text-white/70">
                              {reply.ai_reply}
                            </p>
                          </div>

                        </div>

                      </div>

                      <span className="shrink-0 text-xs text-white/25">
                        {formatDateTime(
                          reply.created_at
                        )}
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          <p className="mt-4 text-right text-xs text-white/20">
            Showing the latest {replies.length} replies
            {favoriteReplies > 0
              ? ` · ${favoriteReplies} favorites`
              : ""}
          </p>

        </section>

      </div>
    </main>
  );
}

/* ========================================= */
/* UI COMPONENTS */
/* ========================================= */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      <p className="mt-1 text-sm text-white/35">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  accent,
}: {
  label: string;
  value: number;
  description: string;
  accent?: "pro";
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.035]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          {label}
        </p>

        {accent === "pro" && (
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        )}
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>

      <p className="mt-2 text-xs text-white/25">
        {description}
      </p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
  warning,
}: {
  label: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">
          {label}
        </p>

        {warning && (
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function InfoCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      {children}
    </div>
  );
}

function Badge({
  children,
  variant = "subtle",
}: {
  children: React.ReactNode;
  variant?: "pro" | "free" | "subtle";
}) {
  const styles = {
    pro: "border-white/20 bg-white text-black",
    free: "border-white/10 bg-white/[0.06] text-white/55",
    subtle:
      "border-white/[0.08] bg-white/[0.04] text-white/40",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/25 ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function getInitials(
  email: string | null
) {
  if (!email) return "U";

  return email
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(
  date: string | null
) {
  if (!date) return "—";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(date));
}

function formatDateTime(
  date: string | null
) {
  if (!date) return "—";

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