"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  Lead,
  LeadIntent,
  LeadStage,
  LeadTemperature,
} from "@/lib/leads";

type UpdateLeadButtonProps = {
  lead: Lead;
};

export default function UpdateLeadButton({
  lead,
}: UpdateLeadButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email ?? "");
  const [phone, setPhone] = useState(lead.phone ?? "");
  const [source, setSource] = useState(lead.source ?? "");
  const [goal, setGoal] = useState(lead.goal ?? "");
  const [notes, setNotes] = useState(lead.notes ?? "");

  const [stage, setStage] =
    useState<LeadStage>(lead.stage);

  const [intent, setIntent] =
    useState<LeadIntent>(lead.intent);

  const [temperature, setTemperature] =
    useState<LeadTemperature>(lead.temperature);

  async function handleUpdate() {
    if (!name.trim()) {
      alert("Lead name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/leads/${lead.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            phone,
            source,
            goal,
            notes,
            stage,
            intent,
            temperature,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to update lead."
        );
      }

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(
        "Update lead error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500"
      >
        Update Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Update Lead
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Update this lead&apos;s information and
                  journey status.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg px-3 py-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-zinc-300">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-300">
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-300">
                  Source
                </label>

                <input
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value)
                  }
                  placeholder="Instagram, referral, website..."
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-300">
                  Temperature
                </label>

                <select
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(
                      e.target
                        .value as LeadTemperature
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                >
                  <option value="cold">
                    Cold
                  </option>

                  <option value="warm">
                    Warm
                  </option>

                  <option value="hot">
                    Hot
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm text-zinc-300">
                  Stage
                </label>

                <select
                  value={stage}
                  onChange={(e) =>
                    setStage(
                      e.target.value as LeadStage
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                >
                  <option value="new">
                    New
                  </option>

                  <option value="initial_conversation">
                    Initial Conversation
                  </option>

                  <option value="discovery">
                    Discovery
                  </option>

                  <option value="qualification">
                    Qualification
                  </option>

                  <option value="objection">
                    Objection
                  </option>

                  <option value="offer">
                    Offer
                  </option>

                  <option value="follow_up">
                    Follow Up
                  </option>

                  <option value="call_payment">
                    Call / Payment
                  </option>

                  <option value="client">
                    Client
                  </option>

                  <option value="lost">
                    Lost
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm text-zinc-300">
                  Intent
                </label>

                <select
                  value={intent}
                  onChange={(e) =>
                    setIntent(
                      e.target.value as LeadIntent
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                >
                  <option value="unknown">
                    Unknown
                  </option>

                  <option value="interested">
                    Interested
                  </option>

                  <option value="unsure">
                    Unsure
                  </option>

                  <option value="not_interested">
                    Not Interested
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-zinc-300">
                  Lead Goal
                </label>

                <textarea
                  value={goal}
                  onChange={(e) =>
                    setGoal(e.target.value)
                  }
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-zinc-300">
                  Coach Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-xl border border-zinc-800 px-5 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}