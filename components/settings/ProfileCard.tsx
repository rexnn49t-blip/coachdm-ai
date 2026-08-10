"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Pencil, Check, X } from "lucide-react";

export default function ProfileCard() {
  const { user, isLoaded } = useUser();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isLoaded) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex animate-pulse items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-white/10" />

          <div className="space-y-3">
            <div className="h-6 w-40 rounded bg-white/10" />
            <div className="h-4 w-56 rounded bg-white/10" />
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

        {/* Avatar */}
        <Image
          src={
            user.imageUrl ||
            "https://placehold.co/120x120"
          }
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full border border-white/10 object-cover"
        />

        {/* User Info */}
        <div className="flex-1">

          {!editing ? (
            <>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  {displayName}
                </h2>

                <button
                  onClick={startEditing}
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                  title="Edit name"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-1 text-zinc-400">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </>
          ) : (
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Your Name
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  placeholder="Enter your name"
                  className="w-full max-w-sm rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                />

                <div className="flex gap-2">
                  <button
                    onClick={saveName}
                    disabled={
                      saving ||
                      !name.trim()
                    }
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check className="h-4 w-4" />

                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />

                    Cancel
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                This name will be used throughout your CoachDM AI account.
              </p>
            </div>
          )}

          {!editing && (
            <p className="mt-4 text-sm text-zinc-500">
              Your account is securely managed through Clerk Authentication.
            </p>
          )}

        </div>
      </div>
    </section>
  );
}