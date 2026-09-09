import Link from "next/link";
import { History, ArrowRight } from "lucide-react";

export default function ReplyHistoryCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/10 p-2.5">
          <History className="h-5 w-5 text-violet-400" />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Reply History
          </h2>

          <p className="text-xs text-zinc-400">
            View every AI reply you've generated.
          </p>
        </div>
      </div>

     <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
  <p className="text-xs text-zinc-400">
    Search, filter, favorite and manage all your replies from one dedicated page.
  </p>

  <Link
  href="/replies"
  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
>
  View Reply History
  <ArrowRight className="h-4 w-4" />
</Link>
</div>
    </div>
  );
}