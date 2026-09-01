"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RecordClientReplyProps = {
  leadId: string;
};

export default function RecordClientReply({
  leadId,
}: RecordClientReplyProps) {
  const router = useRouter();

  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function saveClientReply() {
    try {
      const trimmedReply = reply.trim();

      if (!trimmedReply) {
        setError(
          "Please enter the client's reply."
        );

        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/leads/${leadId}/reply`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            reply: trimmedReply,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save client reply."
        );
      }

      setReply("");

      setSuccess(
        "Client reply recorded successfully."
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save client reply."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-500/20 bg-violet-500/[0.05]">
      <div className="border-b border-violet-500/15 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
            💬
          </div>

          <div>
            <h2 className="font-semibold">
              Record Client Reply
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Add the client's latest response so
              CoachDM AI can use it in the coaching
              journey.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <textarea
          value={reply}
          onChange={(e) =>
            setReply(e.target.value)
          }
          rows={6}
          placeholder="Paste or type the client's latest reply..."
          className="w-full resize-y rounded-2xl border border-zinc-800 bg-black/40 px-4 py-4 text-sm leading-7 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={saveClientReply}
            disabled={saving}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving Reply..."
              : "Save Client Reply"}
          </button>

          {success && (
            <p className="text-sm text-emerald-400">
              {success}
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}