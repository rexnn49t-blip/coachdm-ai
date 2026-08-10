"use client";

type ReplySortProps = {
  sort: "newest" | "oldest";
  setSort: (sort: "newest" | "oldest") => void;
};

export default function ReplySort({
  sort,
  setSort,
}: ReplySortProps) {
  return (
    <select
      value={sort}
      onChange={(e) =>
        setSort(
          e.target.value as
            | "newest"
            | "oldest"
        )
      }
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
    >
      <option value="newest">
        Newest First
      </option>

      <option value="oldest">
        Oldest First
      </option>
    </select>
  );
}