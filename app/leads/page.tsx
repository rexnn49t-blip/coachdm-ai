import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  Plus,
  Users,
  ArrowRight,
  Sparkles,
  Flame,
  Snowflake,
  Sun,
  MessageSquare,
} from "lucide-react";

import { getLeads } from "@/lib/leads";

export default async function LeadsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const leads = await getLeads(userId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.04]" />

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                <Users className="h-6 w-6 text-violet-400" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Leads
                </h1>

                <p className="mt-1 text-sm text-zinc-400">
                  Manage conversations and guide every lead toward becoming a
                  client.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              <span className="font-medium text-violet-300">
                {leads.length}
              </span>{" "}
              {leads.length === 1 ? "lead" : "leads"} in your pipeline
            </p>
          </div>

          <Link
            href="/leads/new"
            className="inline-flex h-14 min-w-[210px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20 sm:text-base"
          >
            <Plus className="h-5 w-5" />
            Add New Lead
          </Link>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {leads.length === 0 ? (
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl sm:p-14">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

            <div className="relative mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/10">
                <Users className="h-9 w-9 text-violet-400" />
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Start building your pipeline
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
                Add your first lead and keep track of every conversation,
                follow-up, objection, and step toward becoming a client.
              </p>

              <Link
                href="/leads/new"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Plus className="h-4 w-4" />
                Add Your First Lead

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* ================= READY FOR CONVERSATION ================= */}
            <section className="mb-10 flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-xl bg-violet-500/10 p-2.5">
                  <MessageSquare className="h-5 w-5 text-violet-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Ready for your next conversation?
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Open a lead to review their journey and generate your next
                    AI-powered reply.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
              >
                <Sparkles className="h-4 w-4" />
                AI Reply Generator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* ================= LEAD LIST ================= */}
            <section className="mt-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Lead List
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Select a lead to continue their journey.
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                  {leads.length}{" "}
                  {leads.length === 1 ? "lead" : "leads"}
                </span>
              </div>

              {/* ================= RECTANGULAR TABLE ================= */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.025]">
                <table className="w-full min-w-[900px] border-collapse">
                  {/* TABLE HEADER */}
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.025]">
                      <th className="w-[36%] px-7 py-5 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Lead
                      </th>

                      <th className="w-[18%] px-5 py-5 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Stage
                      </th>

                      <th className="w-[16%] px-5 py-5 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Intent
                      </th>

                      <th className="w-[18%] px-5 py-5 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Temperature
                      </th>

                      <th className="w-[12%] px-7 py-5 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="group border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-violet-500/[0.05]"
                      >
                        {/* ================= LEAD ================= */}
                        <td className="px-7 py-5">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="flex items-center gap-4"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 font-semibold text-violet-300">
                              {lead.name?.charAt(0).toUpperCase() || "L"}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-violet-300">
                                {lead.name || "Unnamed Lead"}
                              </h3>

                              <p className="mt-1 truncate text-xs text-zinc-500">
                                {lead.email ||
                                  lead.source ||
                                  "No contact details"}
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* ================= STAGE ================= */}
                        <td className="px-5 py-5">
                          <Link href={`/leads/${lead.id}`}>
                            <span className="inline-flex whitespace-nowrap rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium capitalize text-violet-300">
                              {lead.stage?.replace(/_/g, " ") || "New"}
                            </span>
                          </Link>
                        </td>

                        {/* ================= INTENT ================= */}
                        <td className="px-5 py-5">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="whitespace-nowrap text-sm capitalize text-zinc-300"
                          >
                            {lead.intent?.replace(/_/g, " ") || "Unknown"}
                          </Link>
                        </td>

                        {/* ================= TEMPERATURE ================= */}
                        <td className="px-5 py-5">
                          <Link href={`/leads/${lead.id}`}>
                            {lead.temperature === "hot" && (
                              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400">
                                <Flame className="h-3.5 w-3.5" />
                                Hot
                              </span>
                            )}

                            {lead.temperature === "warm" && (
                              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">
                                <Sun className="h-3.5 w-3.5" />
                                Warm
                              </span>
                            )}

                            {lead.temperature === "cold" && (
                              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400">
                                <Snowflake className="h-3.5 w-3.5" />
                                Cold
                              </span>
                            )}
                          </Link>
                        </td>

                        {/* ================= ACTION ================= */}
                        <td className="px-7 py-5 text-right">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-violet-400 transition-transform duration-200 hover:translate-x-1"
                          >
                            Open Lead
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}