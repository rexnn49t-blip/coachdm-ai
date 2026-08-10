"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  ChevronDown,
} from "lucide-react";

import jsPDF from "jspdf";

export default function ExportReplies() {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  async function exportCSV() {
  window.location.href = "/api/export/csv";
}

async function exportTXT() {
  window.location.href = "/api/export/txt";
}

async function exportPDF() {
  const res = await fetch("/api/export/pdf");

  const data = await res.json();

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);
  doc.text("CoachDM AI Reply Export", 20, y);

  y += 15;

  doc.setFontSize(10);
  doc.text(
    `Exported: ${new Date().toLocaleString()}`,
    20,
    y
  );

  y += 20;

  data.replies.forEach(
    (reply: any, index: number) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);

      doc.text(
        `Reply #${index + 1}`,
        20,
        y
      );

      y += 10;

      doc.setFontSize(10);

      const lead =
        doc.splitTextToSize(
          `Lead: ${reply.lead_message}`,
          170
        );

      doc.text(lead, 20, y);

      y += lead.length * 6 + 5;

      const ai =
        doc.splitTextToSize(
          `Reply: ${reply.ai_reply}`,
          170
        );

      doc.text(ai, 20, y);

      y += ai.length * 6 + 5;

      doc.text(
        `Tone: ${reply.tone}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Length: ${reply.length}`,
        20,
        y
      );

      y += 6;

      doc.text(
        `Favorite: ${
          reply.favorite ? "Yes" : "No"
        }`,
        20,
        y
      );

      y += 15;
    }
  );

  doc.save("coachdm-replies.pdf");
}

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:border-violet-500/40 hover:bg-white/10"
      >
        <Download className="h-4 w-4" />

        <span className="hidden sm:inline">
          Export Replies
        </span>

        <span className="sm:hidden">
          Export
        </span>

        <ChevronDown
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-white/10 bg-[#0d0d0d] p-2 shadow-2xl backdrop-blur-xl">
         <button
  onClick={exportPDF}
  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5"
>
  <FileText className="h-4 w-4 text-red-400" />

  <span className="text-sm">
    PDF
  </span>
</button>

      <button
  onClick={exportTXT}
  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5"
>
  <File className="h-4 w-4 text-zinc-300" />

  <span className="text-sm">
    TXT
  </span>
</button>

          <button
  onClick={exportCSV}
  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5"
>
  <FileSpreadsheet className="h-4 w-4 text-green-400" />

  <span className="text-sm">
    CSV
  </span>
</button>
        </div>
      )}
    </div>
  );
}