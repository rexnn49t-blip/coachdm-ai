"use client";

import { Search } from "lucide-react";

type SearchRepliesProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchReplies({
  search,
  setSearch,
}: SearchRepliesProps) {
  return (
    <div className="relative">
      <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

      <input
        type="text"
        placeholder="Search lead messages, AI replies or tones..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
      />
    </div>
  );
}