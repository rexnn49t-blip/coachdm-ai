"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  User,
  ShieldCheck,
  Mail,
  Database,
  Download,
  Trash2,
  FileJson,
  Lightbulb,
} from "lucide-react";

import DefaultToneSelect from "./DefaultToneSelect";
import DefaultLengthSelect from "./DefaultLengthSelect";
import AutoSaveToggle from "./AutoSaveToggle";

type SettingsContentProps = {
  userEmail: string;
};

export default function SettingsContent({
  userEmail,
}: SettingsContentProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      const res = await fetch("/api/export-replies");

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "coachdm-replies.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export replies error:", error);
      alert("Failed to export replies.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* =========================================================
          GENERAL
      ========================================================= */}
      {activeTab === "general" && (
        <section>
          {/* Section heading */}
          <div className="border-b border-white/[0.07] pb-7">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/[0.10] text-violet-300">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  General Preferences
                </h2>

                <p className="mt-1.5 text-sm text-zinc-500">
                  Personalize how CoachDM AI works for you.
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="divide-y divide-white/[0.07]">
            {/* Default Tone */}
            <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white">
                  Default Tone
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-zinc-500">
                  Choose the tone used for newly generated replies.
                </p>
              </div>

              <div className="shrink-0">
                <DefaultToneSelect />
              </div>
            </div>

            {/* Default Length */}
            <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white">
                  Default Reply Length
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-zinc-500">
                  Set the default length for newly generated replies.
                </p>
              </div>

              <div className="shrink-0">
                <DefaultLengthSelect />
              </div>
            </div>

            {/* Auto Save */}
            <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white">
                  Auto Save Replies
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-zinc-500">
                  Automatically save every newly generated reply.
                </p>
              </div>

              <div className="shrink-0">
                <AutoSaveToggle />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-3 flex items-start gap-3 border-t border-white/[0.07] pt-6">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />

            <p className="text-xs leading-5 text-zinc-600">
              These preferences are used whenever you generate a new
              AI reply.
            </p>
          </div>
        </section>
      )}

      {/* =========================================================
          ACCOUNT
      ========================================================= */}
      {activeTab === "account" && (
        <section>
          {/* Section heading */}
          <div className="border-b border-white/[0.07] pb-7">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
                <User className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Account
                </h2>

                <p className="mt-1.5 text-sm text-zinc-500">
                  Manage your account and authentication.
                </p>
              </div>
            </div>
          </div>

          {/* Account information */}
          <div className="divide-y divide-white/[0.07]">
            {/* Email */}
            <div className="py-8">
              <div className="flex items-start gap-5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                    Email address
                  </p>

                  <p className="mt-2.5 truncate text-sm font-medium text-white">
                    {userEmail || "No email address"}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    Your primary email address is managed securely
                    through Clerk.
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="py-8">
              <div className="flex items-start gap-5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80" />

                <div>
                  <p className="text-sm font-medium text-white">
                    Account security
                  </p>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                    Your authentication and account credentials are
                    securely managed by Clerk Authentication.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Account secured
                  </div>
                </div>
              </div>
            </div>

           {/* Profile */}
<div className="py-8">
  <div className="flex items-start gap-5">
    <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />

    <div>
      <p className="text-sm font-medium text-white">
        Profile information
      </p>

      <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
        Update your name and profile information from the
        profile section above.
      </p>
    </div>
  </div>

  {/* Bottom divider */}
  <div className="mt-8 border-t border-white/[0.07] pt-1" />
</div>
          </div>
        </section>
      )}

      {/* =========================================================
          DATA
      ========================================================= */}
      {activeTab === "data" && (
        <section>
          {/* Section heading */}
          <div className="border-b border-white/[0.07] pb-7">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
                <Database className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Your Data
                </h2>

                <p className="mt-1.5 text-sm text-zinc-500">
                  Export your replies or permanently remove your
                  account.
                </p>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="flex flex-col gap-6 border-b border-white/[0.07] py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-5">
              <FileJson className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />

              <div>
                <h3 className="text-sm font-medium text-white">
                  Export Replies
                </h3>

                <p className="mt-2 max-w-lg text-sm leading-5 text-zinc-500">
                  Download all your saved CoachDM AI replies as a
                  JSON file.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />

              {exporting ? "Exporting..." : "Export Replies"}
            </button>
          </div>

{/* Danger Zone */}
<div className="mt-8 pt-2">
  <div className="rounded-xl border border-red-500/[0.14] bg-red-500/[0.025] p-6 sm:p-7">
    {/* Danger Zone Header */}
    <div className="flex items-start gap-4">
      <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

      <div>
        <h3 className="text-sm font-medium text-red-400">
          Danger Zone
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          Permanently delete your CoachDM AI account and all
          associated saved replies and settings.
        </p>
      </div>
    </div>

    {/* Warning + Delete */}
    <div className="mt-7">
      <p className="text-xs leading-5 text-zinc-600">
        This action cannot be undone. Make sure you have
        exported anything you want to keep before continuing.
      </p>

      <button
        type="button"
        onClick={() => {
          setConfirmDelete("");
          setShowDeleteModal(true);
        }}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-500/25 px-4 py-2.5 text-xs font-semibold text-red-300 transition-colors hover:border-red-500/40 hover:bg-red-500/[0.08] hover:text-red-200"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete Account
      </button>
    </div>
  </div>
</div>
        </section>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 shadow-2xl sm:p-7">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/[0.08] text-red-400">
                <Trash2 className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Delete Account
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                  This action is permanent.
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-7 border-y border-red-500/[0.12] py-5">
              <p className="text-sm leading-6 text-zinc-400">
                You're about to permanently delete your{" "}
                <span className="font-medium text-white">
                  CoachDM AI
                </span>{" "}
                account.
              </p>

              <p className="mt-4 text-xs text-zinc-600">
                This will permanently remove:
              </p>

              <ul className="mt-2.5 space-y-1.5 text-xs text-zinc-500">
                <li>• All saved replies</li>
                <li>• Your settings</li>
                <li>• Your CoachDM AI account</li>
              </ul>
            </div>

            {/* Confirmation */}
            <div className="mt-7">
              <label className="mb-2.5 block text-xs font-medium text-zinc-400">
                Type your email address to confirm
              </label>

              <input
                type="text"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-red-500/40"
              />

              <p className="mt-2.5 text-[11px] text-zinc-600">
                Expected:{" "}
                <span className="text-zinc-400">{userEmail}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete("");
                  setShowDeleteModal(false);
                }}
                className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />

                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}