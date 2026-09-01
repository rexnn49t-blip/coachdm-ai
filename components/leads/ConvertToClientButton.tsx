"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ConvertToClientButtonProps = {
  leadId: string;
  leadName: string;
};

export default function ConvertToClientButton({
  leadId,
  leadName,
}: ConvertToClientButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function convertToClient() {
    const confirmed = window.confirm(
      `Convert ${leadName} into a client?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/leads/${leadId}/convert`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to convert lead."
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to convert lead."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={convertToClient}
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-left text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Converting..."
          : "Convert to Client 🎉"}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}