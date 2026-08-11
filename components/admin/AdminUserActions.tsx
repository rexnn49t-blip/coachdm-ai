"use client";

import { useState } from "react";

type Props = {
  userId: string;
  email: string | null;
  plan: "free" | "pro";
  hasPaddleSubscription: boolean;
};

export default function AdminUserActions({
  userId,
  email,
  plan,
  hasPaddleSubscription,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] =
    useState(false);

  const [confirmAction, setConfirmAction] =
    useState<"upgrade" | "downgrade" | null>(
      null
    );

  const [error, setError] = useState("");

  async function handleAction(
    action: "upgrade" | "downgrade"
  ) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/user-actions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId,
            action,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Something went wrong."
        );
      }

      window.location.reload();
    } catch (err) {
      console.error(
        "Admin user action error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="relative inline-block text-left">

        <button
          type="button"
          onClick={() =>
            setOpen((value) => !value)
          }
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          Manage
          <span className="ml-2 text-white/30">
            {open ? "↑" : "↓"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#111] p-1.5 shadow-2xl shadow-black/50">

            <div className="border-b border-white/[0.06] px-3 py-3">
              <p className="truncate text-xs font-medium text-white/70">
                {email ??
                  "Unknown user"}
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                Current plan:{" "}
                {plan.toUpperCase()}
              </p>
            </div>

            {plan === "free" && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConfirmAction(
                    "upgrade"
                  );
                }}
                className="mt-1 flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                Upgrade to Pro
              </button>
            )}

            {plan === "pro" && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConfirmAction(
                    "downgrade"
                  );
                }}
                className="mt-1 flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-red-300/70 transition hover:bg-red-400/[0.06] hover:text-red-200"
              >
                Downgrade to Free
              </button>
            )}

            {hasPaddleSubscription && (
              <div className="border-t border-white/[0.06] px-3 py-3">
                <p className="text-[10px] leading-4 text-white/25">
                  This user has a Paddle
                  subscription. Manual plan
                  changes do not cancel or modify
                  their Paddle billing.
                </p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ================================= */}
      {/* CONFIRMATION MODAL */}
      {/* ================================= */}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">

            <div className="mb-5">
              <h3 className="text-lg font-semibold text-white">
                {confirmAction ===
                "upgrade"
                  ? "Upgrade user?"
                  : "Downgrade user?"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                {confirmAction ===
                "upgrade"
                  ? "This will immediately give the user Pro access in CoachDM AI."
                  : "This will remove Pro access and apply the Free plan's 3-reply limit."}
              </p>
            </div>

            {confirmAction ===
              "downgrade" &&
              hasPaddleSubscription && (
                <div className="mb-5 rounded-xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
                  <p className="text-xs leading-5 text-yellow-200/60">
                    This user has an active Paddle
                    subscription. This action only
                    changes their CoachDM access.
                    It does not cancel their Paddle
                    subscription.
                  </p>
                </div>
              )}

            {error && (
              <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
                <p className="text-xs leading-5 text-red-300/70">
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setConfirmAction(
                    null
                  );
                  setError("");
                }}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleAction(
                    confirmAction
                  )
                }
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  confirmAction ===
                  "upgrade"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-red-400 text-black hover:bg-red-300"
                }`}
              >
                {loading
                  ? "Updating..."
                  : confirmAction ===
                    "upgrade"
                  ? "Upgrade to Pro"
                  : "Downgrade to Free"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}