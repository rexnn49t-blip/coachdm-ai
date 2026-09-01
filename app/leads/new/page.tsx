import Link from "next/link";

import AddLeadForm from "@/components/leads/AddLeadForm";

export default function NewLeadPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />

      {/* Purple Glow */}
      <div className="absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

      {/* Blue Glow */}
      <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <Link
          href="/leads"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to Leads
        </Link>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            New Lead
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Add a new lead
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Add what you know about this lead. CoachDM AI will
            later use this information to help guide you from
            the first conversation toward becoming a client.
          </p>
        </div>

        <AddLeadForm />
      </div>
    </main>
  );
}