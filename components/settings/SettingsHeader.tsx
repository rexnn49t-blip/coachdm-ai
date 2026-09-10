import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <header className="pb-6 sm:pb-8">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/[0.14] bg-violet-500/[0.08]">
          <Settings className="h-5 w-5 text-violet-400" />
        </div>

        {/* Heading */}
        <div className="pt-0.5">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Settings
          </h1>

          <p className="mt-2 text-sm leading-5 text-zinc-500 sm:text-[15px]">
            Manage your preferences, account, and data.
          </p>
        </div>
      </div>
    </header>
  );
}