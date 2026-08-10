import { auth } from "@clerk/nextjs/server";
import { MessageSquare } from "lucide-react";
import { getPaginatedReplies } from "@/lib/replies";
import ReplyCard from "./ReplyCard";

type RecentRepliesProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function RecentReplies({
  searchParams,
}: RecentRepliesProps) {
  const { userId } = await auth();

  if (!userId) return null;

  const params = await searchParams;

  const pageParam = Number(params?.page ?? "1");

  const page =
    Number.isFinite(pageParam) && pageParam > 0
      ? Math.floor(pageParam)
      : 1;

const {
  replies,
  total,
  totalPages,
} = await getPaginatedReplies(userId, page, 10);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-violet-400" />

          <h2 className="text-xl font-bold">
            Recent Replies
          </h2>
        </div>

        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
          {total}
        </span>
      </div>

      {/* Empty State */}
      {replies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-14 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-zinc-500" />

          <p className="mt-4 text-zinc-400">
            No replies yet.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Generate your first AI reply.
          </p>
        </div>
      ) : (
        <>
          {/* Replies */}
          <div className="space-y-4">
            {replies.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={reply}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              {/* Previous */}
              {page > 1 ? (
                <a
                  href={`?page=${page - 1}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  ← Previous
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-sm font-medium text-zinc-600">
                  ← Previous
                </span>
              )}

              {/* Page Indicator */}
              <span className="text-sm text-zinc-400">
                Page{" "}
                <span className="font-medium text-white">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
                  {totalPages}
                </span>
              </span>

              {/* Next */}
              {page < totalPages ? (
                <a
                  href={`?page=${page + 1}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  Next →
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-sm font-medium text-zinc-600">
                  Next →
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}