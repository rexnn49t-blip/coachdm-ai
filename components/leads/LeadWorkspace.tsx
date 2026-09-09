import Link from "next/link";

import {
  ArrowLeft,
  Mail,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";

import type { Lead } from "@/lib/leads";
import { getLeadActivities } from "@/lib/lead-activities";

import UpdateLeadButton from "@/components/leads/UpdateLeadButton";
import LeadGuidance from "@/components/leads/LeadGuidance";
import LeadActivityTimeline from "@/components/leads/LeadActivityTimeline";
import RecordLeadReply from "@/components/leads/RecordLeadReply";
import ConvertToClientButton from "@/components/leads/ConvertToClientButton";
import RecordClientReply from "@/components/leads/RecordClientReply";
import AddNoteModal from "@/components/leads/AddNoteModal";
import GenerateReplyButton from "@/components/leads/GenerateReplyButton";
import ConversationHistoryButton from "@/components/leads/ConversationHistoryButton";
import SmartFollowUp from "@/components/leads/SmartFollowUp";


type LeadWorkspaceProps = {
  lead: Lead;
  activities: Awaited<ReturnType<typeof getLeadActivities>>;
};

const stages = [
  {
    value: "new",
    label: "New Lead",
  },
  {
    value: "initial_conversation",
    label: "Initial Conversation",
  },
  {
    value: "discovery",
    label: "Discovery",
  },
  {
    value: "qualification",
    label: "Qualification",
  },
  {
    value: "objection",
    label: "Objection",
  },
  {
    value: "offer",
    label: "Offer",
  },
  {
    value: "follow_up",
    label: "Follow Up",
  },
  {
    value: "call_payment",
    label: "Call / Payment",
  },
  {
    value: "client",
    label: "Client",
  },
];

export default function LeadWorkspace({
  lead,
  activities,
}: LeadWorkspaceProps) {
  const stageLabel = lead.stage.replace(/_/g, " ");

  const currentIndex = stages.findIndex(
    (stage) => stage.value === lead.stage
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />

      {/* Purple glow */}
      <div className="pointer-events-none absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

      {/* Blue glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">

        {/* Back */}
        <Link
          href="/leads"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        {/* ===================================================== */}
        {/* LEAD HEADER */}
        {/* ===================================================== */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl font-bold text-violet-300">
                {lead.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">

                <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">
                  {lead.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium capitalize text-violet-300">
                    {stageLabel}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      lead.temperature === "hot"
                        ? "bg-orange-500/10 text-orange-400"
                        : lead.temperature === "warm"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-sky-500/10 text-sky-400"
                    }`}
                  >
                    {lead.temperature}
                  </span>

                  {lead.intent !== "unknown" && (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs capitalize text-zinc-400">
                      {lead.intent.replace(/_/g, " ")}
                    </span>
                  )}

                </div>

              </div>
            </div>

            <UpdateLeadButton lead={lead} />

          </div>

          {/* Contact strip */}
          <div className="mt-6 flex flex-wrap gap-5 border-t border-white/[0.06] pt-5">

            {lead.email && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4 text-zinc-600" />
                <span>{lead.email}</span>
              </div>
            )}

            {lead.phone && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="h-4 w-4 text-zinc-600" />
                <span>{lead.phone}</span>
              </div>
            )}

            {lead.source && (
              <div className="text-sm text-zinc-500">
                Source:{" "}
                <span className="capitalize text-zinc-300">
                  {lead.source}
                </span>
              </div>
            )}

          </div>
        </section>

        {/* ===================================================== */}
        {/* MAIN WORKSPACE */}
        {/* ===================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">

          {/* ================================================= */}
          {/* LEFT COLUMN */}
          {/* ================================================= */}

          <div className="space-y-8">

            {/* AI Guidance */}
            <LeadGuidance
              leadId={lead.id}
              currentIntent={lead.intent}
              currentTemperature={lead.temperature}
              currentStage={lead.stage}
            />
            <SmartFollowUp leadId={lead.id} />

            {/* Conversation */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold">
                    Conversation
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Keep the conversation moving toward the next stage.
                  </p>
                </div>

                <Sparkles className="h-5 w-5 text-violet-400" />

              </div>

              <div className="mt-6">

                {lead.stage !== "client" ? (
                  <RecordLeadReply
                    leadId={lead.id}
                  />
                ) : (
                  <RecordClientReply
                    leadId={lead.id}
                  />
                )}

              </div>

            </section>

            {/* Activity */}
            <LeadActivityTimeline
              activities={activities}
            />

            {/* Lead Goal */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

              <h2 className="text-lg font-semibold">
                Lead Goal
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                {lead.goal ||
                  "No goal has been added yet."}
              </p>

            </section>

            {/* First Message */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

              <h2 className="text-lg font-semibold">
                First Message
              </h2>

              <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/60 p-5">

                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {lead.initial_message ||
                    "No initial message has been added yet."}
                </p>

              </div>

            </section>

            {/* Coach Notes */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

              <h2 className="text-lg font-semibold">
                Coach Notes
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                {lead.notes ||
                  "No notes have been added yet."}
              </p>

            </section>

          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-6">

            {/* Journey */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <Users className="h-5 w-5 text-violet-400" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    {lead.stage === "client"
                      ? "Client Journey"
                      : "Lead Journey"}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Track progress through the sales journey.
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-1">

                {stages.map((stage, index) => {

                  const isCompleted =
                    currentIndex > index;

                  const isCurrent =
                    lead.stage === stage.value;

                  const isUpcoming =
                    currentIndex < index;

                  return (
                    <div
                      key={stage.value}
                      className="relative flex items-center gap-3 py-2.5"
                    >

                      {/* Connecting line */}
                      {index < stages.length - 1 && (
                        <div
                          className={`absolute left-[7px] top-8 h-7 w-px ${
                            isCompleted
                              ? "bg-violet-500/70"
                              : "bg-zinc-800"
                          }`}
                        />
                      )}

                      {/* Indicator */}
                      <div
                        className={`relative z-10 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full ${
                          isCurrent
                            ? "bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.9)]"
                            : isCompleted
                            ? "bg-violet-500"
                            : "bg-zinc-800"
                        }`}
                      >
                        {isCompleted && (
                          <span className="text-[9px] font-bold text-white">
                            ✓
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-sm ${
                          isCurrent
                            ? "font-semibold text-white"
                            : isCompleted
                            ? "text-violet-300"
                            : isUpcoming
                            ? "text-zinc-600"
                            : "text-zinc-500"
                        }`}
                      >
                        {stage.label}
                      </span>

                      {isCurrent && (
                        <span className="ml-auto rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-violet-300">
                          Current
                        </span>
                      )}

                    </div>
                  );
                })}

              </div>

              {lead.stage === "lost" && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

                  <p className="text-sm font-medium text-red-300">
                    Lead marked as lost
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    This lead is no longer actively progressing.
                  </p>

                </div>
              )}

            </section>

            {/* Contact */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

              <h2 className="text-lg font-semibold">
                Contact
              </h2>

              <div className="mt-5 space-y-5">

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-zinc-300">
                    {lead.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {lead.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Source
                  </p>

                  <p className="mt-1 text-sm capitalize text-zinc-300">
                    {lead.source || "Not provided"}
                  </p>
                </div>

              </div>

            </section>

           
   {/* Quick Actions */}

<section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">

  <h2 className="text-lg font-semibold">
    Quick Actions
  </h2>

  <div className="mt-5 space-y-3">

    {/* Generate Reply */}

    <GenerateReplyButton
      leadId={lead.id}
    />

    {/* Conversation History */}

    <ConversationHistoryButton
      leadId={lead.id}
      activities={activities}
    />

    {/* Convert to Client */}

    {lead.stage === "call_payment" && (
      <ConvertToClientButton
        leadId={lead.id}
        leadName={lead.name}
      />
    )}

    {/* Add Note */}

    <AddNoteModal
      leadId={lead.id}
    />

  </div>

</section>

          </aside>

        </div>
      </div>
    </main>
  );
}