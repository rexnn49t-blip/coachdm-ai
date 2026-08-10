"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Trash2,
  Clock3,
  Star,
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

    const confirmed = window.confirm(
      "Delete this reply?"
    );

    if (!confirmed) return;

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

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() =>
        router.push(`/dashboard?reply=${reply.id}`)
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              copyReply();
            }}
            className="rounded-lg p-2 transition hover:bg-white/10"
          >
            <Copy className="h-4 w-4 text-zinc-400" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteReply();
            }}
            disabled={deleting}
            className="rounded-lg p-2 transition hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}