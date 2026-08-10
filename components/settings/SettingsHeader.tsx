import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
          <Settings className="h-8 w-8 text-violet-400" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
            <span className="text-xs font-medium uppercase tracking-wide text-violet-300">
              CoachDM AI
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Customize your CoachDM AI experience. Manage your preferences,
            account settings, and data from one place.
          </p>
        </div>
      </div>
    </section>
  );
}