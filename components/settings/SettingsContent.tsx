"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import DefaultToneSelect from "./DefaultToneSelect";
import DefaultLengthSelect from "./DefaultLengthSelect";
import AutoSaveToggle from "./AutoSaveToggle";

type SettingsContentProps = {
  userEmail: string;
};

export default function SettingsContent({
  userEmail,
}: SettingsContentProps) {
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

    const [confirmDelete, setConfirmDelete] =
  useState("");

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
            <Sparkles className="h-6 w-6 text-violet-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              General Preferences
            </h2>

            <p className="text-sm text-zinc-400">
              Personalize how CoachDM AI works for you.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          
          

          {/* Default Tone */}

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Default Tone
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Choose the tone used for all newly generated replies.
              </p>
            </div>

            <DefaultToneSelect />
          </div>

          {/* Default Length */}

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Default Reply Length
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Set the default length for newly generated replies.
              </p>
            </div>

            <DefaultLengthSelect />
          </div>

          {/* Auto Save */}

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-white">
                Auto Save Replies
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Automatically save every newly generated reply.
              </p>
            </div>

            <AutoSaveToggle />
          </div>

          {/* Export */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold">
              Export Data
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Download all your saved replies as a JSON file.
            </p>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/export-replies");

                  if (!res.ok) throw new Error();

                  const data = await res.json();

                  const blob = new Blob(
                    [JSON.stringify(data, null, 2)],
                    {
                      type: "application/json",
                    }
                  );

                  const url =
                    URL.createObjectURL(blob);

                  const link =
                    document.createElement("a");

                  link.href = url;
                  link.download =
                    "coachdm-replies.json";

                  document.body.appendChild(link);

                  link.click();

                  link.remove();

                  URL.revokeObjectURL(url);
                } catch {
                  alert(
                    "Failed to export replies."
                  );
                }
              }}
              className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-medium transition-all duration-200 hover:bg-violet-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Export Replies
            </button>
          </div>

           {/* Danger Zone */}

<div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
  <h2 className="text-xl font-semibold text-red-400">
    Danger Zone
  </h2>

  <p className="mt-2 text-sm text-zinc-400">
    Permanently delete your CoachDM AI account and all
    saved replies.

    <br />
    <br />

    This action cannot be undone.
  </p>

  <button
    onClick={() => {
      setConfirmDelete("");
      setShowDeleteModal(true);
    }}
    className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 font-medium text-red-300 transition-all duration-200 hover:bg-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
  >
    Delete Account
  </button>
</div>
</div>

  </section>
  
      {/* Delete Confirmation Modal */}

{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">

      <h2 className="text-2xl font-bold text-red-400">
        Delete Account
      </h2>

      <p className="mt-4 leading-7 text-zinc-400">
        You're about to permanently delete your
        <span className="font-semibold text-white">
          {" "}CoachDM AI{" "}
        </span>
        account.

        <br />
        <br />

        This will permanently remove:

        <br />
        • All saved replies
        <br />
        • Your settings
        <br />
        • Your account

        <br />
        <br />

        This action cannot be undone.
      </p>

      <div className="mt-8">
        <label className="mb-2 block text-sm text-zinc-400">
          Type your email address to confirm
        </label>

        <input
          type="text"
          value={confirmDelete}
          onChange={(e) =>
            setConfirmDelete(e.target.value)
          }
          placeholder="Enter your email"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
        />
        <p className="mt-2 text-xs text-zinc-500">
  Expected:{" "}
  <span className="text-zinc-300">
    {userEmail}
  </span>
</p>
      </div>

      <div className="mt-8 flex justify-end gap-3">

        <button
          type="button"
          onClick={() => {
            setConfirmDelete("");
            setShowDeleteModal(false);
          }}
          className="rounded-xl border border-white/10 px-5 py-2 transition hover:bg-white/10"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={
            deleting ||
            confirmDelete.trim().toLowerCase() !==
userEmail.trim().toLowerCase()
          }
          className="rounded-xl bg-red-600 px-5 py-2 font-medium transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting
            ? "Deleting..."
            : "Delete Account"}
        </button>

      </div>

    </div>
  </div>
)}
</>
  );
}