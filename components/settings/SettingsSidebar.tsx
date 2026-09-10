"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  User,
  Database,
} from "lucide-react";

const settingsItems = [
  {
    id: "general",
    label: "General",
    description: "Preferences",
    icon: SlidersHorizontal,
  },
  {
    id: "account",
    label: "Account",
    description: "Profile & security",
    icon: User,
  },
  {
    id: "data",
    label: "Data",
    description: "Replies & data",
    icon: Database,
  },
];

export default function SettingsSidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="mb-4 px-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
          Settings
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your workspace
        </p>
      </div>

      <nav className="space-y-1">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={`/settings?tab=${item.id}`}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                isActive
                  ? "bg-violet-500/[0.10] text-white"
                  : "text-zinc-400 hover:bg-white/[0.035] hover:text-zinc-200"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-violet-500/15 text-violet-300"
                    : "bg-white/[0.035] text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                <Icon className="h-[17px] w-[17px]" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {item.label}
                </p>

                <p
                  className={`mt-0.5 text-xs ${
                    isActive ? "text-violet-300/70" : "text-zinc-600"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="px-3">
          <p className="text-xs font-medium text-zinc-500">
            Your settings are secure
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-700">
            Account and authentication are securely managed through Clerk.
          </p>
        </div>
      </div>
    </aside>
  );
}