"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const tones = [
  "Professional",
  "Friendly",
  "Confident",
  "Persuasive",
  "Empathetic",
];

export default function DefaultToneSelect() {
  const [selected, setSelected] =
    useState("Professional");

  const [open, setOpen] = useState(false);

  useEffect(() => {
  const savedTone = localStorage.getItem(
    "default-tone"
  );

  if (savedTone) {
    setSelected(savedTone);
  }
}, []);

  return (
    <div className="relative w-64">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm transition hover:border-violet-500/40"
      >
        <span>{selected}</span>

        <ChevronDown
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] p-2 shadow-xl">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => {
               setSelected(tone);

localStorage.setItem(
  "default-tone",
  tone
);

setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
            >
              {tone}

              {selected === tone && (
                <Check className="h-4 w-4 text-violet-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}