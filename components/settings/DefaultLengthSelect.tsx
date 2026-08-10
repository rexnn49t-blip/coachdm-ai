"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
} from "lucide-react";

const lengths = [
  "Short",
  "Medium",
  "Detailed",
];

export default function DefaultLengthSelect() {
  const [selected, setSelected] =
    useState("Detailed");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(
      "default-length"
    );

    if (saved) {
      setSelected(saved);
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
          {lengths.map((length) => (
            <button
              key={length}
              onClick={() => {
                setSelected(length);

                localStorage.setItem(
                  "default-length",
                  length
                );

                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
            >
              {length}

              {selected === length && (
                <Check className="h-4 w-4 text-violet-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}