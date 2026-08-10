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
};

export default function ReplyGenerator({
  initialReply,
}: ReplyGeneratorProps) {
    const loadedReplyId = useRef<string | null>(null);

  console.log("Initial Reply:", initialReply);

 const [leadMessage, setLeadMessage] = useState(
  initialReply?.lead_message ?? ""
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

useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    const active = document.activeElement;

    const typing =
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement;

    // Ctrl + Enter → Generate Reply
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();

      if (!loading && leadMessage.trim()) {
        generateReply();
      }

      return;
    }

    // Don't override normal shortcuts while typing
    if (typing) return;

    // Ctrl + C → Copy Reply
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
      if (reply) {
        e.preventDefault();
        copyReply();
      }

      return;
    }

    // Ctrl + S → Favorite
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
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

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [
  leadMessage,
  loading,
  reply,
  tone,
  length,
  generateReply,
  copyReply,
  saveReply,
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
        await fetch("/api/save-reply", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            leadMessage,
            reply: accumulatedReply,
            tone,
            length,
          }),
        });

        router.refresh();

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
    } else {
      router.refresh();
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

async function autoSaveReply() {
  if (!reply) return;

  try {
    await fetch("/api/save-reply", {
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

    router.refresh();
  } catch (error) {
    console.error(error);
  }
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
        {limitReached ? (
          <div className="flex w-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-violet-500/20 p-4">
              <Crown className="h-10 w-10 text-yellow-400" />
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              Monthly Limit Reached
            </h3>

            <p className="mt-3 max-w-sm text-sm text-zinc-400 sm:text-base">
              You've used all <strong>3 free replies</strong> this month.
              <br />
              <br />
              Upgrade to Pro to continue generating unlimited AI replies.
            </p>

            <button
              onClick={() => router.push("/pricing")}
              className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 font-semibold transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(139,92,246,.45)]"
            >
              Upgrade to Pro
            </button>
          </div>
       ) : loading && !reply ? (
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
            <button
              onClick={copyReply}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition hover:bg-white/10 sm:text-base"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>

            <button
              onClick={generateReply}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium transition hover:bg-white/10 sm:text-base"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>

            <button
              onClick={saveReply}
              disabled={saving}
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
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10"
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
                      Rewrite this reply instantly
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
                 <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

                  <button
                    onClick={() => rewriteReply("shorter")}
                    disabled={rewriting}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-500/40 hover:bg-white/10"
                  >
                    ✂️
                    <div className="mt-2 text-sm">
                      Shorter
                    </div>
                  </button>

                 <button
                  onClick={() => rewriteReply("cta")}
                  disabled={rewriting}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-500/40 hover:bg-white/10"
                   >
                   🎯
                  <div className="mt-2 text-sm">
                   Stronger CTA
                   </div>
                   </button>

                  <button
                    onClick={() => rewriteReply("professional")}
                    disabled={rewriting}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-sky-500/40 hover:bg-white/10"
                  >
                    💼
                    <div className="mt-2 text-sm">
                      Professional
                    </div>
                  </button>

                  <button
                    onClick={() => rewriteReply("persuasive")}
                    disabled={rewriting}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-orange-500/40 hover:bg-white/10"
                  >
                    🔥
                    <div className="mt-2 text-sm">
                      Persuasive
                    </div>
                  </button>

                  <button
                    onClick={() => rewriteReply("confident")}
                    disabled={rewriting}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-green-500/40 hover:bg-white/10"
                  >
                    🧠
                    <div className="mt-2 text-sm">
                      Confident
                    </div>
                  </button>
                </div>
              )}

              {rewriting && (
                <div className="mt-5 text-center text-sm text-violet-300">
                  ✨ Improving your reply...
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
)}
</section>
);
}
