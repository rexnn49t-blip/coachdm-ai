"use client";

type ReplyFiltersProps = {
  filter: "all" | "favorites";
  setFilter: (filter: "all" | "favorites") => void;
};

export default function ReplyFilters({
  filter,
  setFilter,
}: ReplyFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setFilter("all")}
        className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
          filter === "all"
            ? "bg-violet-600 text-white"
            : "bg-white/5 text-zinc-400 hover:bg-white/10"
        }`}
      >
        All
      </button>

      <button
        onClick={() => setFilter("favorites")}
        className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
          filter === "favorites"
            ? "bg-yellow-500 text-black"
            : "bg-white/5 text-zinc-400 hover:bg-white/10"
        }`}
      >
        ⭐ Favorites
      </button>
    </div>
  );
}