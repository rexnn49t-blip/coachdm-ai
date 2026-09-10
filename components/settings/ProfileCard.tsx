"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Pencil, Check, X, ShieldCheck } from "lucide-react";

export default function ProfileCard() {
  const { user, isLoaded } = useUser();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isLoaded) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8">
        <div className="flex animate-pulse items-center gap-8">
          <div className="h-20 w-20 shrink-0 rounded-full bg-white/[0.08]" />

          <div className="space-y-3">
            <div className="h-6 w-40 rounded-md bg-white/[0.08]" />
            <div className="h-4 w-56 rounded-md bg-white/[0.06]" />
          </div>
        </div>
      </section>
    );
  }

  if (!user) return null;

  const displayName = user.fullName || "Coach";

  const startEditing = () => {
    setName(user.fullName || "");
    setEditing(true);
  };

  const cancelEditing = () => {
    setName(user.fullName || "");
    setEditing(false);
  };

  const saveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setSaving(true);

      await user.update({
        firstName: trimmedName,
        lastName: "",
      });

      await user.reload();

      setEditing(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      alert("Failed to update your name. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 sm:p-9">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        {/* Avatar */}
        <Image
          src={user.imageUrl || "https://placehold.co/120x120"}
          alt="Profile"
          width={88}
          height={88}
          className="h-[88px] w-[88px] shrink-0 rounded-full border border-white/[0.10] object-cover"
        />

        {/* User Information */}
        <div className="min-w-0 flex-1">
          {!editing ? (
            <>
              {/* Name */}
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
                  {displayName}
                </h2>

                <button
                  type="button"
                  onClick={startEditing}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
                  title="Edit name"
                  aria-label="Edit name"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Email */}
              <p className="mt-2.5 text-sm text-zinc-400">
                {user.primaryEmailAddress?.emailAddress ||
                  "No email address"}
              </p>

              {/* Security */}
              <div className="mt-6 flex items-start gap-3.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />

                <p className="text-xs leading-5 text-zinc-600">
                  Your account is securely managed through Clerk
                  Authentication.
                </p>
              </div>
            </>
          ) : (
            /* Editing */
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">
                  Edit your name
                </p>

                <span className="text-xs text-zinc-600">
                  Profile
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  placeholder="Enter your name"
                  className="w-full max-w-sm rounded-xl border border-white/[0.10] bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-500/50"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveName}
                    disabled={saving || !name.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check className="h-3.5 w-3.5" />

                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-3.5 w-3.5" />

                    Cancel
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-zinc-600">
                This name will be used throughout your CoachDM AI
                account.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}