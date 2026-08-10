import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import RepliesHeader from "../../components/replies/RepliesHeader";
import ReplyList from "../../components/replies/ReplyList";
import ReplyStats from "../../components/replies/ReplyStats";

import {
  getReplyStats,
  getAllReplies,
} from "@/lib/replies";

export default async function RepliesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stats = await getReplyStats(userId);
  const replies = await getAllReplies(userId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />

      {/* Purple Glow */}
      <div className="absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

      {/* Blue Glow */}
      <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 sm:py-28 lg:space-y-10 lg:px-8 lg:py-32">
        <RepliesHeader />

        <ReplyStats
          totalReplies={stats.totalReplies}
          favoriteReplies={stats.favoriteReplies}
          repliesThisMonth={stats.repliesThisMonth}
        />

        <ReplyList replies={replies} />
      </div>
    </main>
  );
}