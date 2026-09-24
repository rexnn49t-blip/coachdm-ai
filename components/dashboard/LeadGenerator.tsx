"use client";

import { useState } from "react";
import {
  Sparkles,
  Users,
  MapPin,
  Target,
  Loader2,
  Save,
  Check,
} from "lucide-react";

type GeneratedLead = {
  name: string;
  profile: string;
  goal: string;
  whyFit: string;
  conversationAngle: string;
  sourceUrl: string;
};

export default function LeadGenerator() {
  const [niche, setNiche] = useState("");
  const [idealClient, setIdealClient] = useState("");
  const [goal, setGoal] = useState("");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState("2");

  const [leads, setLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedLeads, setSavedLeads] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function generateLeads() {
    setError("");

    if (!niche.trim() || !idealClient.trim()) {
      setError(
        "Please enter your coaching niche and ideal client."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/generate-leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            niche,
            idealClient,
            goal,
            location,
            count: Number(count),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to find potential clients."
        );
      }

      setLeads(data.leads || []);

      // New search = new set of prospects
      setSavedLeads([]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setLeads([]);
    await generateLeads();
  }

  async function handleSaveLead(
    lead: GeneratedLead
  ) {
    try {
      const response = await fetch(
        "/api/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: lead.name,
            source: "AI Web Prospect Finder",
            goal: lead.goal,
            notes: `${lead.profile}

Why they may be a fit:
${lead.whyFit}

Suggested conversation angle:
${lead.conversationAngle}

Public source:
${lead.sourceUrl}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to save lead."
        );
      }

      setSavedLeads((current) => [
        ...current,
        lead.name,
      ]);
    } catch {
      setError(
        "Unable to save this lead."
      );
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.08] via-white/[0.025] to-transparent p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/[0.08] blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  AI Lead Generator
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Find publicly discoverable prospects
                  that match your coaching niche.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-blue-400/10 bg-blue-400/[0.05] px-3 py-2 text-xs font-medium text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Web Research + AI
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* Coaching Niche */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Coaching Niche
            </label>

            <input
              value={niche}
              onChange={(event) =>
                setNiche(event.target.value)
              }
              placeholder="e.g. Fitness coaching"
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
            />
          </div>

          {/* Ideal Client */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Ideal Client
            </label>

            <input
              value={idealClient}
              onChange={(event) =>
                setIdealClient(event.target.value)
              }
              placeholder="e.g. Busy professionals"
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
            />
          </div>

          {/* Goal */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Target className="h-4 w-4 text-blue-400" />
              Client Goal / Problem
            </label>

            <input
              value={goal}
              onChange={(event) =>
                setGoal(event.target.value)
              }
              placeholder="e.g. Lose weight and build consistency"
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <MapPin className="h-4 w-4 text-blue-400" />
              Location
              <span className="text-xs text-zinc-600">
                Optional
              </span>
            </label>

            <input
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="e.g. India"
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Prospect Count */}
          <div className="sm:w-40">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Prospects
            </label>

            <select
              value={count}
              onChange={(event) =>
                setCount(event.target.value)
              }
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40"
            >
              <option value="1">
                1 prospect
              </option>

              <option value="2">
                2 prospects
              </option>

              <option value="3">
                3 prospects
              </option>

              <option value="4">
                4 prospects
              </option>
            </select>
          </div>

          {/* Generate */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Researching Potential Clients...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Find Potential Clients
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Results */}
        {leads.length > 0 && (
          <div className="mt-10 border-t border-white/[0.07] pt-8">
            {/* Results Header */}
            <div>
              <h3 className="text-base font-semibold text-white">
                Potential Clients Found
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
                Review publicly discoverable prospects,
                verify the source, and decide who is worth
                starting a conversation with.
              </p>
            </div>

            {/* Lead Cards */}
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {leads.map((lead) => {
                const saved =
                  savedLeads.includes(
                    lead.name
                  );

                return (
                  <div
                    key={`${lead.name}-${lead.goal}`}
                    className="rounded-2xl border border-white/[0.07] bg-black/50 p-5"
                  >
                    {/* Lead Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white">
                          {lead.name}
                        </h4>

                        <p className="mt-1 text-sm text-zinc-500">
                          {lead.profile}
                        </p>

                        {lead.sourceUrl && (
                          <a
                            href={lead.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex max-w-full truncate text-xs font-medium text-blue-400 transition hover:text-blue-300"
                          >
                            View public source
                            <span
                              className="ml-1.5"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </a>
                        )}
                      </div>

                      <div className="shrink-0 rounded-lg bg-blue-400/10 px-2.5 py-1 text-xs text-blue-300">
                        Possible Match
                      </div>
                    </div>

                    {/* Lead Details */}
                    <div className="mt-5 space-y-4 text-sm">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                          Relevant Goal / Situation
                        </p>

                        <p className="mt-1 leading-6 text-zinc-300">
                          {lead.goal}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                          Why They May Be a Fit
                        </p>

                        <p className="mt-1 leading-6 text-zinc-300">
                          {lead.whyFit}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                          Suggested Conversation Angle
                        </p>

                        <p className="mt-1 leading-6 text-zinc-300">
                          {lead.conversationAngle}
                        </p>
                      </div>
                    </div>

                    {/* Save Lead */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveLead(lead)
                      }
                      disabled={saved}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-blue-400/20 hover:bg-blue-400/[0.06] hover:text-white disabled:cursor-default disabled:text-green-400"
                    >
                      {saved ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Lead Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save Lead
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}