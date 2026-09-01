"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddLeadForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  const [goal, setGoal] = useState("");
  const [initialMessage, setInitialMessage] =
    useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      setError(
        "Please enter the lead's name."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/leads",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            phone,
            source,
            goal,
            initial_message:
              initialMessage,
            notes,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create lead."
        );
      }

      router.push(
        `/leads/${data.lead.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Create lead error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 backdrop-blur sm:p-8"
    >
      {/* Lead Name */}

      <div>
        <label className="text-sm font-medium text-zinc-200">
          Lead name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="John Smith"
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
        />
      </div>

      {/* Source */}

      <div>
        <label className="text-sm font-medium text-zinc-200">
          Where did this lead come from?
        </label>

        <select
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
          className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
        >
          <option value="">
            Select source
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="Facebook">
            Facebook
          </option>

          <option value="WhatsApp">
            WhatsApp
          </option>

          <option value="Website">
            Website
          </option>

          <option value="Referral">
            Referral
          </option>

          <option value="LinkedIn">
            LinkedIn
          </option>

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      {/* Goal */}

      <div>
        <label className="text-sm font-medium text-zinc-200">
          What does the lead want?
        </label>

        <textarea
          value={goal}
          onChange={(e) =>
            setGoal(e.target.value)
          }
          placeholder="For example: Wants to lose weight and is looking for online coaching."
          rows={3}
          className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
        />
      </div>

      {/* Initial Message */}

      <div>
        <label className="text-sm font-medium text-zinc-200">
          Lead's first message
        </label>

        <textarea
          value={initialMessage}
          onChange={(e) =>
            setInitialMessage(e.target.value)
          }
          placeholder="Paste the first message from the lead here..."
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
        />

        <p className="mt-2 text-xs text-zinc-500">
          This will help CoachDM AI understand
          the lead and recommend the next step.
        </p>
      </div>

      {/* Contact Details */}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-200">
            Email
            <span className="ml-1 text-zinc-600">
              (optional)
            </span>
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="john@example.com"
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-200">
            Phone
            <span className="ml-1 text-zinc-600">
              (optional)
            </span>
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="+91..."
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Notes */}

      <div>
        <label className="text-sm font-medium text-zinc-200">
          Additional notes
          <span className="ml-1 text-zinc-600">
            (optional)
          </span>
        </label>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Anything else you know about this lead..."
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
        />
      </div>

      {/* Error */}

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {/* Submit */}

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/leads")
          }
          disabled={loading}
          className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Adding Lead..."
            : "Add Lead →"}
        </button>
      </div>
    </form>
  );
}