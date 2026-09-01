"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddNoteModalProps = {
  leadId: string;
};

export default function AddNoteModal({
  leadId,
}: AddNoteModalProps) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSave() {
    try {
      const trimmedNote = note.trim();

      if (!trimmedNote) {
        setError(
          "Please enter a note."
        );

        return;
      }

      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/leads/${leadId}/notes`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            note: trimmedNote,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save note."
        );
      }

      setNote("");
      setOpen(false);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save note."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) {
      return;
    }

    setOpen(false);
    setError("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-violet-500/40 hover:bg-zinc-900"
      >
        Add Note
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}

          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Add Coach Note
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Save an important observation,
                  detail, or reminder about this
                  lead or client.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-lg px-2 py-1 text-xl text-zinc-500 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="For example: Prefers evening coaching sessions and needs extra accountability with nutrition."
              rows={7}
              disabled={loading}
              className="mt-6 w-full resize-y rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm leading-7 text-zinc-300 outline-none transition placeholder:text-zinc-600 focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  loading ||
                  !note.trim()
                }
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}