"use client";

import { useRouter } from "next/navigation";

type GenerateReplyButtonProps = {
  leadId: string;
};

export default function GenerateReplyButton({
  leadId,
}: GenerateReplyButtonProps) {
  const router = useRouter();

  function handleGenerateReply() {
    router.push(
      `/dashboard?leadId=${leadId}`
    );
  }

  return (
    <button
      onClick={handleGenerateReply}
      className="w-full rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-violet-500/40 hover:bg-zinc-900"
    >
      Generate Reply
    </button>
  );
}