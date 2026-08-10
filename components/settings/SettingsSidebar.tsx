import {
  SlidersHorizontal,
  User,
  Database,
} from "lucide-react";

export default function SettingsSidebar() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <nav className="space-y-2">
        <button className="flex w-full items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3 text-left font-medium text-white">
          <SlidersHorizontal className="h-5 w-5" />
          General
        </button>

        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-zinc-400 transition hover:bg-white/5 hover:text-white">
          <User className="h-5 w-5" />
          Account
        </button>

        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-zinc-400 transition hover:bg-white/5 hover:text-white">
          <Database className="h-5 w-5" />
          Data
        </button>
      </nav>
    </aside>
  );
}