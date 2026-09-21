"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

type DeleteLeadButtonProps = {
  leadId: string;
  leadName: string;
};

export default function DeleteLeadButton({
  leadId,
  leadName,
}: DeleteLeadButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(
        `/api/leads/${leadId}`,
        {
          method: "DELETE",
        }
      );

  const data = await response.json();

if (!response.ok) {
  throw new Error(
    data?.error ||
      "Failed to delete lead."
  );
}
      setIsOpen(false);

      router.refresh();
    } catch (error) {
      console.error(
        "Delete lead error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the lead."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
        aria-label={`Delete ${leadName}`}
        title="Delete lead"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-zinc-500 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!isDeleting) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-lead-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => {
                if (!isDeleting) {
                  setIsOpen(false);
                }
              }}
              disabled={isDeleting}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            {/* Content */}
            <div className="mt-5 pr-6">
              <h2
                id="delete-lead-title"
                className="text-lg font-semibold text-white"
              >
                Delete this lead?
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                You are about to permanently
                delete{" "}
                <span className="font-medium text-zinc-200">
                  {leadName}
                </span>
                . This action cannot be
                undone.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Lead
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}