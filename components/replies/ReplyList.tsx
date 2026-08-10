"use client";

import { useEffect, useMemo, useState } from "react";

import SearchReplies from "./SearchReplies";
import ReplyFilters from "./ReplyFilters";
import ReplyCard from "./ReplyCard";
import ReplySort from "./ReplySort";
import { useRouter } from "next/navigation";

type Reply = {
  id: string;
  lead_message: string;
  ai_reply: string;
  tone: string;
  length: string;
  favorite: boolean;
  created_at: string;
};

type ReplyListProps = {
  replies: Reply[];
};

export default function ReplyList({
  replies,
}: ReplyListProps) {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "favorites"
  >("all");

  const [sort, setSort] = useState<
    "newest" | "oldest"
  >("newest");

  const [currentPage, setCurrentPage] =
    useState(1);
    const router = useRouter();

  const repliesPerPage = 10;

  const filteredReplies = useMemo(() => {
    const value = search.toLowerCase();

    const filtered = replies.filter((reply) => {
      const matchesSearch =
        reply.lead_message
          .toLowerCase()
          .includes(value) ||
        reply.ai_reply
          .toLowerCase()
          .includes(value) ||
        reply.tone
          .toLowerCase()
          .includes(value);

      const matchesFilter =
        filter === "all"
          ? true
          : reply.favorite;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

    filtered.sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(
            b.created_at
          ).getTime() -
          new Date(
            a.created_at
          ).getTime()
        );
      }

      return (
        new Date(
          a.created_at
        ).getTime() -
        new Date(
          b.created_at
        ).getTime()
      );
    });

    return filtered;
  }, [
    replies,
    search,
    filter,
    sort,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sort]);

  const totalPages = Math.ceil(
    filteredReplies.length /
      repliesPerPage
  );

  const paginatedReplies =
    filteredReplies.slice(
      (currentPage - 1) *
        repliesPerPage,
      currentPage * repliesPerPage
    );

  return (
  <div className="space-y-8">
    {/* Toolbar */}
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        <SearchReplies
          search={search}
          setSearch={setSearch}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ReplyFilters
          filter={filter}
          setFilter={setFilter}
        />

        <ReplySort
          sort={sort}
          setSort={setSort}
        />
      </div>
    </div>

    {/* Results Counter */}
    <div className="flex items-center justify-between">
      <p className="text-sm text-zinc-400">
        Showing{" "}
        <span className="font-semibold text-white">
          {paginatedReplies.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-white">
          {filteredReplies.length}
        </span>{" "}
        replies
      </p>
    </div>

   {replies.length === 0 ? (
  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 py-24 text-center">
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 text-4xl">
      💬
    </div>

   <h2 className="mt-6 text-2xl font-bold">
  No replies yet
</h2>

<p className="mx-auto mt-3 max-w-md text-zinc-400 leading-7">
  Your AI-generated replies will appear here after you save them.
  Start by generating your first reply from the dashboard.
</p>

    <button
  onClick={() => router.push("/dashboard")}
  className="mt-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 font-semibold transition hover:scale-105"
>
  Generate First Reply
</button>
  </div>
) : filteredReplies.length === 0 ? (
  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 py-20 text-center">
    <div className="text-5xl">🔍</div>

    <h3 className="mt-6 text-xl font-semibold">
  No matching replies
</h3>

<p className="mt-2 text-zinc-500">
  We couldn't find any replies matching your search or filters.
</p>

    <button
      onClick={() => {
        setSearch("");
        setFilter("all");
      }}
      className="mt-6 rounded-xl bg-violet-600 px-6 py-3 transition hover:bg-violet-500"
    >
      Clear Filters
    </button>
  </div>
) : (
      <>
        {/* Reply Cards */}
        <div className="space-y-5">
          {paginatedReplies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                  className={`h-10 w-10 rounded-xl transition ${
                    currentPage === index + 1
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                      : "border border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </div>
  );
}