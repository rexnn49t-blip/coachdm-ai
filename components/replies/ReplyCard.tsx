"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Trash2,
  Clock3,
  Star,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type ReplyCardProps = {
  reply: {
    id: string;
    lead_message: string;
    ai_reply: string;
    tone: string;
    length: string;
    favorite: boolean;
    created_at: string;
  };
};

export default function ReplyCard({
  reply,
}: ReplyCardProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [favorite, setFavorite] = useState(
    reply.favorite
  );

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  async function copyReply() {
    try {
      await navigator.clipboard.writeText(
        reply.ai_reply
      );

      toast.success("Reply copied!");
    } catch {
      toast.error("Failed to copy reply.");
    }
  }

  async function toggleFavorite() {
    if (favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      const res = await fetch(
        `/api/replies/${reply.id}/favorite`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            favorite: !favorite,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setFavorite(!favorite);

      toast.success(
        !favorite
          ? "Added to favorites."
          : "Removed from favorites."
      );

      router.refresh();
    } catch {
      toast.error(
        "Couldn't update favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function deleteReply() {
    if (deleting) return;

    setDeleting(true);

    try {
      const res = await fetch(
        `/api/replies/${reply.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setShowDeleteConfirm(false);

      toast.success("Reply deleted.");

      router.refresh();
    } catch {
      toast.error(
        "Failed to delete reply."
      );
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!showDeleteConfirm) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && !deleting) {
        setShowDeleteConfirm(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showDeleteConfirm, deleting]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() =>
          router.push(
            `/dashboard?view=generator&reply=${reply.id}`
          )
        }
        className="cursor-pointer rounded-2xl border border-white/10 bg-black/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,92,246,.15)] hover:border-violet-500/40 hover:bg-white/5"
      >
        {/* Lead */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
            Lead Message
          </p>

          <p className="line-clamp-3 rounded-xl bg-white/5 p-4 text-sm leading-6 text-zinc-300">
            {reply.lead_message}
          </p>
        </div>

        {/* Reply */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
            AI Reply
          </p>

          <p className="line-clamp-6 rounded-xl border border-white/10 bg-black/30 p-4 leading-7 text-zinc-200">
            {reply.ai_reply}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                {reply.tone}
              </span>

              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
                {reply.length}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock3 className="h-3.5 w-3.5" />

              {formatDistanceToNow(
                new Date(reply.created_at),
                {
                  addSuffix: true,
                }
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
              disabled={favoriteLoading}
              className="rounded-lg p-2 transition hover:bg-yellow-500/20"
            >
              <Star
                className={`h-4 w-4 transition ${
                  favorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-zinc-400"
                }`}
              />
            </button>

            {/* Copy */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyReply();
              }}
              className="rounded-lg p-2 transition hover:bg-white/10"
            >
              <Copy className="h-4 w-4 text-zinc-400" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                if (!deleting) {
                  setShowDeleteConfirm(true);
                }
              }}
              disabled={deleting}
              className="rounded-lg p-2 transition hover:bg-red-500/20 disabled:opacity-50"
              aria-label="Delete reply"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();

            if (e.target === e.currentTarget && !deleting) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-reply-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101014] p-6 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>

            {/* Content */}
            <h3
              id="delete-reply-title"
              className="text-lg font-semibold text-white"
            >
              Delete this reply?
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              This reply will be permanently removed
              from your reply history. This action
              can&apos;t be undone.
            </p>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={deleteReply}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />

                {deleting
                  ? "Deleting..."
                  : "Delete reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}