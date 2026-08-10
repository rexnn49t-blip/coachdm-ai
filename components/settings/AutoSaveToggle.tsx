"use client";

import { useEffect, useState } from "react";

export default function AutoSaveToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem("auto-save");

    if (saved === "true") {
      setEnabled(true);
    }
  }, []);

  function toggle() {
    const value = !enabled;

    setEnabled(value);

    localStorage.setItem(
      "auto-save",
      String(value)
    );
  }

  return (
    <button
      onClick={toggle}
      className={`relative h-8 w-14 rounded-full transition-all duration-300 ${
        enabled
          ? "bg-violet-600"
          : "bg-zinc-700"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${
          enabled
            ? "left-7"
            : "left-1"
        }`}
      />
    </button>
  );
}