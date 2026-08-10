import Link from "next/link";
import { History, ArrowRight } from "lucide-react";

export default function ReplyHistoryCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/10 p-3">
          <History className="h-6 w-6 text-violet-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Reply History
          </h2>

          <p className="text-sm text-zinc-400">
            View every AI reply you've generated.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
        <p className="text-zinc-400">
          Search, filter, favorite and manage all your replies from one dedicated page.
        </p>

        <Link
          href="/replies"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium transition hover:bg-violet-500"
        >
          View Reply History

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}