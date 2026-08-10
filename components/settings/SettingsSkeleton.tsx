export default function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">

      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-48 rounded-lg bg-white/10" />
        <div className="h-4 w-72 rounded-lg bg-white/5" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

        {/* Sidebar Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-11 rounded-xl bg-white/5"
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">

          {/* Profile Card Skeleton */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-full bg-white/10" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-40 rounded bg-white/10" />
                <div className="h-4 w-56 rounded bg-white/5" />
              </div>
            </div>
          </div>

          {/* General Preferences */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8">

            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/10" />

              <div className="space-y-2">
                <div className="h-6 w-52 rounded bg-white/10" />
                <div className="h-4 w-72 rounded bg-white/5" />
              </div>
            </div>

            {/* Settings */}
            <div className="mt-8 space-y-4">

              {/* Default Tone */}
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="h-3 w-64 rounded bg-white/5" />
                </div>

                <div className="h-10 w-32 rounded-xl bg-white/10" />
              </div>

              {/* Default Length */}
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-white/10" />
                  <div className="h-3 w-64 rounded bg-white/5" />
                </div>

                <div className="h-10 w-32 rounded-xl bg-white/10" />
              </div>

              {/* Auto Save */}
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-white/10" />
                  <div className="h-3 w-64 rounded bg-white/5" />
                </div>

                <div className="h-7 w-12 rounded-full bg-white/10" />
              </div>

              {/* Export */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="space-y-3">
                  <div className="h-6 w-32 rounded bg-white/10" />
                  <div className="h-4 w-72 rounded bg-white/5" />
                </div>

                <div className="mt-6 h-11 w-36 rounded-xl bg-white/10" />
              </div>

              {/* Danger Zone */}
              <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-8">
                <div className="space-y-3">
                  <div className="h-6 w-32 rounded bg-white/10" />
                  <div className="h-4 w-80 rounded bg-white/5" />
                  <div className="h-4 w-64 rounded bg-white/5" />
                </div>

                <div className="mt-6 h-11 w-36 rounded-xl bg-white/10" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}