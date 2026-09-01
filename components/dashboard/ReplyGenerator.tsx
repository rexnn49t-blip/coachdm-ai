"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  Sparkles,
  Copy,
  RotateCcw,
  Star,
  Wand2,
  Crown,
  Briefcase,
  Smile,
  Flame,
  Brain,
  Scissors,
} from "lucide-react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/leads";

const tones = [
  "Professional",
  "Friendly",
  "Confident",
  "Empathetic",
  "Persuasive",
];

const lengths = [
  "Short",
  "Medium",
  "Detailed",
];

type InitialReply = {
  id: string;
  lead_message: string;
  ai_reply: string;
  tone: string;
  length: string;
} | null;

type ReplyGeneratorProps = {
  initialReply: InitialReply;
  selectedLead: Lead | null;
};

export default function ReplyGenerator({
  initialReply,
  selectedLead,
}: ReplyGeneratorProps) {
    const loadedReplyId = useRef<string | null>(null);

  console.log("Initial Reply:", initialReply);

const [leadMessage, setLeadMessage] = useState(
  initialReply?.lead_message ??
    selectedLead?.initial_message ??
    ""
);

const [tone, setTone] = useState(
  initialReply?.tone ?? "Professional"
);

const [length, setLength] = useState(
  initialReply?.length ?? "Medium"
);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSave, setAutoSave] =
  useState(false);

  const [showUpgradeModal, setShowUpgradeModal] =
  useState(false);

useEffect(() => {
  if (!initialReply) return;

  // Don't reload the same reply after router.refresh()
  if (loadedReplyId.current === initialReply.id) {
    return;
  }

  loadedReplyId.current = initialReply.id;

  setLeadMessage(initialReply.lead_message);
  setReply(initialReply.ai_reply);
  setTone(initialReply.tone);
  setLength(initialReply.length);
}, [initialReply]);

useEffect(() => {
  if (initialReply) return;

  const savedTone = localStorage.getItem(
    "default-tone"
  );

  if (savedTone) {
    setTone(savedTone);
  }
}, [initialReply]);

useEffect(() => {
  if (initialReply) return;

  const savedLength = localStorage.getItem(
    "default-length"
  );

  if (savedLength) {
    setLength(savedLength);
  }
}, [initialReply]);

useEffect(() => {
  if (initialReply) return;

  const saved =
    localStorage.getItem("auto-save");

  setAutoSave(saved === "true");
}, [initialReply]);

const [reply, setReply] = useState(
  initialReply?.ai_reply ?? ""
);

  const router = useRouter();
  const [limitReached, setLimitReached] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [showRewriteOptions, setShowRewriteOptions] =
  useState(false);

// Update the message when a different lead is selected
useEffect(() => {
  if (initialReply) return;

  if (!selectedLead) return;

  setLeadMessage(
    selectedLead.initial_message ?? ""
  );

  setReply("");
  setLimitReached(false);
}, [initialReply, selectedLead]);

// Keyboard shortcuts
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    const active = document.activeElement;

    const typing =
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement;

    // Ctrl + Enter → Generate Reply
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "Enter"
    ) {
      e.preventDefault();

      if (!loading && leadMessage.trim()) {
        generateReply();
      }

      return;
    }

    // Don't override normal shortcuts while typing
    if (typing) return;

    // Ctrl + C → Copy Reply
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "c"
    ) {
      if (reply) {
        e.preventDefault();
        copyReply();
      }

      return;
    }

    // Ctrl + S → Save Reply
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "s"
    ) {
      if (reply) {
        e.preventDefault();
        saveReply();
      }

      return;
    }

    // Esc → Close Rewrite Panel
    if (e.key === "Escape") {
      setShowRewriteOptions(false);
    }
  }

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, [
  leadMessage,
  loading,
  reply,
]);
async function generateReply() {
  if (!leadMessage.trim()) return;

  setLoading(true);
  setLimitReached(false);
  setReply("");

  try {
    const res = await fetch("/api/generate-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
  leadMessage,
  tone,
  length,
  leadId: selectedLead?.id ?? null,
}),
    });

    if (!res.ok) {
      let data: any = {};

      try {
        data = await res.json();
      } catch {
        // Ignore JSON parsing error
      }

     if (data.limitReached) {
  setReply("");
  setLimitReached(true);
  setShowUpgradeModal(true);

  toast.error(
    "You've reached your monthly limit."
  );

  return;
}

      toast.error(
        data.error ||
          "Failed to generate reply."
      );

      return;
    }

    if (!res.body) {
      throw new Error(
        "Streaming response is not available."
      );
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let accumulatedReply = "";

    while (true) {
      const { value, done } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value, {
          stream: true,
        });

      if (!chunk) continue;

      accumulatedReply += chunk;

      // Update the UI immediately
      setReply(accumulatedReply);
    }

    // Flush anything remaining in the decoder
    const remaining =
      decoder.decode();

    if (remaining) {
      accumulatedReply += remaining;
      setReply(accumulatedReply);
    }

    if (!accumulatedReply.trim()) {
      toast.error(
        "Failed to generate a reply."
      );

      return;
    }

    // Auto-save AFTER the complete reply has streamed
   if (autoSave) {
  try {
    const res = await fetch("/api/save-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadMessage,
        reply: accumulatedReply,
        tone,
        length,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.error || "Failed to auto-save reply."
      );
    }

    toast.success(
      "✨ Reply generated & saved!"
    );
  } catch (error) {
    console.error(
      "Auto-save error:",
      error
    );

    toast.error(
      "Reply generated, but couldn't be saved."
    );
  }
}
  } catch (err) {
    console.error(
      "Streaming generate error:",
      err
    );

    toast.error(
      "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

async function rewriteReply(style: string) {
  if (!reply || rewriting) return;

  setRewriting(true);

  try {
    const res = await fetch("/api/rewrite-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply,
        style,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    setReply(data.reply);

    const formattedStyle =
      style.charAt(0).toUpperCase() + style.slice(1);

    toast.success(
      `✨ Reply rewritten in ${formattedStyle}!`
    );
  } catch (error) {
    console.error(error);

    toast.error("Couldn't improve reply.");
  } finally {
    setRewriting(false);
  }
}

 async function copyReply() {
  if (!reply) return;

  await navigator.clipboard.writeText(reply);

  toast.success("Reply copied!");
}


async function saveReply() {
  if (!reply) return;

  setSaving(true);

  try {
    const res = await fetch("/api/save-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadMessage,
        reply,
        tone,
        length,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Reply saved!");

      router.refresh();

      setReply("");

      // Optional:
      // setLeadMessage("");
    } else {
      toast.error(data.error || "Failed to save reply.");
    }
  } catch (error) {
    console.error(error);

    toast.error("Unable to save reply.");
  } finally {
    setSaving(false);
  }
}

  return (
   <section className="space-y-8">

      {/* LEFT */}

     <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-6 lg:p-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

            <Sparkles className="h-6 w-6 text-violet-400" />

          </div>

          <div>

            <h2 className="text-2xl font-bold sm:text-3xl">

              AI Reply Generator

            </h2>

            <p className="mt-1 text-sm text-zinc-400 sm:text-base">

              Generate natural coaching replies.

            </p>

          </div>

        </div>

        {/* Selected Lead */}

{selectedLead && (
  <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-bold text-violet-300">
        {selectedLead.name
          .charAt(0)
          .toUpperCase()}
      </div>

      <div>
        <p className="text-sm font-semibold text-white">
          Generating reply for {selectedLead.name}
        </p>

        <p className="mt-1 text-xs capitalize text-zinc-400">
          {selectedLead.stage.replace(
            /_/g,
            " "
          )}{" "}
          • {selectedLead.temperature}
        </p>
      </div>
    </div>
  </div>
)}

{/* textarea */}

<textarea
          value={leadMessage}
          onChange={(e) => setLeadMessage(e.target.value)}
          placeholder="Paste your lead's message here...

Examples:
• Instagram DM
• Facebook message
• WhatsApp
• Email
• LinkedIn"
         className="mt-6 h-48 sm:h-56 lg:h-64 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none transition focus:border-violet-500 sm:mt-8 sm:h-64 sm:p-5 sm:text-base"
        />

        {/* selectors */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
           className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm sm:text-base"
          >
            {tones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
           className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm sm:text-base"
          >
            {lengths.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

        </div>

        {/* button */}

        <button
          onClick={generateReply}
          disabled={loading}
         className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 h-12 sm:h-14 text-base font-semibold transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(139,92,246,.45)] disabled:opacity-60 sm:mt-8 sm:text-lg"
        >

          <Wand2 className="h-5 w-5" />

          {loading
            ? "CoachDM AI is thinking..."
            : "Generate Reply"}

        </button>

      </div>

     {/* RIGHT */}

{(loading || reply || limitReached) && (
  <div className="space-y-6">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">
            Generated Reply
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Review, copy, retry or save your AI response.
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
          <Sparkles className="h-5 w-5 text-violet-400" />
        </div>
      </div>

      {/* Reply Box */}
      <div className="mt-6 flex min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] items-start rounded-2xl border border-white/10 bg-black/30 p-4 sm:min-h-[320px] sm:p-5">
       {loading && !reply ? (
  <div className="flex items-center gap-2 text-zinc-400">
    <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:.15s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:.3s]" />

    <span className="ml-3 text-sm sm:text-base">
      CoachDM AI is crafting your reply...
    </span>
  </div>
) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            {reply}
          </p>
        )}
      </div>

     {/* Action Buttons */}
{!limitReached && (
  <>
    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      
      {/* Copy */}
     <button
  onClick={copyReply}
  disabled={
    !reply ||
    loading ||
    rewriting ||
    saving
  }
  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
>
  <Copy className="h-4 w-4" />
  Copy
</button>

      {/* Retry */}
     <button
  onClick={generateReply}
  disabled={loading || rewriting || saving}
  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
>
  <RotateCcw
    className={`h-4 w-4 ${
      loading ? "animate-spin" : ""
    }`}
  />

  {loading ? "Generating..." : "Retry"}
</button>

      {/* Save */}
     <button
  onClick={saveReply}
  disabled={
    !reply ||
    loading ||
    rewriting ||
    saving
  }
  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
>
  <Star className="h-4 w-4" />

  {saving ? "Saving..." : "Save"}
</button>
    </div>

    {/* Improve with AI */}
{reply && (
  <div className="mt-6 border-t border-white/10 pt-6">
    <button
      onClick={() =>
        setShowRewriteOptions((prev) => !prev)
      }
      disabled={rewriting || loading || saving}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/10 p-2">
          <Wand2 className="h-5 w-5 text-violet-400" />
        </div>

        <div className="text-left">
          <p className="font-semibold">
            Improve with AI
          </p>

          <p className="text-sm text-zinc-500">
            {rewriting
              ? "Improving your reply..."
              : "Rewrite this reply instantly"}
          </p>
        </div>
      </div>

      {showRewriteOptions ? (
        <ChevronUp className="h-5 w-5 text-zinc-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-zinc-400" />
      )}
    </button>

    {showRewriteOptions && (
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        
        {/* Shorter */}
        <button
          onClick={() => rewriteReply("shorter")}
          disabled={rewriting || loading || saving}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-500/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✂️
          <div className="mt-2 text-sm">
            Shorter
          </div>
        </button>

        {/* Stronger CTA */}
        <button
          onClick={() => rewriteReply("cta")}
          disabled={rewriting || loading || saving}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-500/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          🎯
          <div className="mt-2 text-sm">
            Stronger CTA
          </div>
        </button>

        {/* Professional */}
        <button
          onClick={() => rewriteReply("professional")}
          disabled={rewriting || loading || saving}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-sky-500/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          💼
          <div className="mt-2 text-sm">
            Professional
          </div>
        </button>

        {/* Persuasive */}
        <button
          onClick={() => rewriteReply("persuasive")}
          disabled={rewriting || loading || saving}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-orange-500/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          🔥
          <div className="mt-2 text-sm">
            Persuasive
          </div>
        </button>

        {/* Confident */}
        <button
          onClick={() => rewriteReply("confident")}
          disabled={rewriting || loading || saving}
          className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-green-500/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          🧠
          <div className="mt-2 text-sm">
            Confident
          </div>
        </button>
      </div>
    )}

    {rewriting && (
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-violet-300">
        <Sparkles className="h-4 w-4 animate-pulse" />
        Improving your reply...
      </div>
    )}
  </div>
)}
           
        </>
            )}
    </div>
  </div>
)}

{/* Upgrade Popup */}
{showUpgradeModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
    {/* Background */}
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-md"
      onClick={() => setShowUpgradeModal(false)}
    />

    {/* Glow */}
    <div className="absolute h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />

    {/* Popup */}
    <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-violet-500/25 bg-[#0c0c10] shadow-2xl shadow-violet-500/20">

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-violet-600/20 via-purple-600/10 to-transparent" />

      {/* Close button */}
      <button
        onClick={() => setShowUpgradeModal(false)}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-400 transition hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>

      <div className="relative px-6 py-10 sm:px-12 sm:py-12">

        {/* Crown */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/20 to-violet-500/20 shadow-[0_0_60px_rgba(139,92,246,.25)]">
          <Crown className="h-12 w-12 text-yellow-400" />
        </div>

        {/* Heading */}
        <div className="mx-auto mt-8 max-w-xl text-center">
          <div className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            FREE PLAN LIMIT REACHED
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Keep the conversation
            <span className="block bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              moving forward.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
            You've used all{" "}
            <span className="font-semibold text-white">
              3 free AI replies
            </span>{" "}
            available this month.
          </p>

          <p className="mt-2 text-sm leading-7 text-zinc-500 sm:text-base">
            Upgrade to Pro and continue creating personalized,
            high-converting replies for your coaching leads.
          </p>
        </div>

        {/* Features */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="text-xl">✨</div>

            <p className="mt-2 text-sm font-semibold text-white">
              Unlimited Replies
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Generate whenever you need
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="text-xl">⚡</div>

            <p className="mt-2 text-sm font-semibold text-white">
              Faster Workflow
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Save time responding to leads
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="text-xl">🎯</div>

            <p className="mt-2 text-sm font-semibold text-white">
              Convert More Leads
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Better replies for every lead
            </p>
          </div>
        </div>

        {/* Upgrade button */}
        <button
          onClick={() => router.push("/pricing")}
          className="mt-8 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-base font-semibold text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(139,92,246,.45)] sm:text-lg"
        >
          <Crown className="h-5 w-5 text-yellow-300" />
          Upgrade to Pro
          <span className="text-violet-200">→</span>
        </button>

        {/* Maybe later */}
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="mx-auto mt-5 block text-sm text-zinc-500 transition hover:text-white"
        >
          Maybe later, I'll wait until next month
        </button>
      </div>
    </div>
  </div>
)}

</section>
);
}