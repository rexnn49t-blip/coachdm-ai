export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.04]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/10" />

            <div>
              <div className="h-9 w-32 animate-pulse rounded-lg bg-white/10" />

              <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-white/5" />
            </div>
          </div>

          <div className="h-12 w-36 animate-pulse rounded-xl bg-violet-500/10" />
        </div>

        {/* Desktop table skeleton */}
        <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:block">
          {/* Table header */}
          <div className="flex gap-6 border-b border-white/10 bg-white/[0.02] px-6 py-5">
            <div className="h-3 flex-[2] animate-pulse rounded bg-white/5" />
            <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
            <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
            <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
            <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
          </div>

          {/* Lead rows */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center gap-6 border-b border-white/[0.06] px-6 py-5 last:border-b-0"
            >
              <div className="flex flex-[2] items-center gap-3">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-white/10" />

                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-white/10" />

                  <div className="h-3 w-44 animate-pulse rounded bg-white/5" />
                </div>
              </div>

              <div className="h-7 flex-1 animate-pulse rounded-full bg-violet-500/10" />

              <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />

              <div className="h-7 flex-1 animate-pulse rounded-full bg-white/5" />

              <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />

              <div className="h-10 w-24 animate-pulse rounded-xl bg-white/5" />
            </div>
          ))}
        </div>

        {/* Mobile cards skeleton */}
        <div className="space-y-4 md:hidden">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-white/10" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-white/10" />

                  <div className="h-3 w-44 max-w-full animate-pulse rounded bg-white/5" />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <div className="h-7 w-24 animate-pulse rounded-full bg-violet-500/10" />

                <div className="h-7 w-20 animate-pulse rounded-full bg-white/5" />
              </div>

              <div className="mt-5 h-px bg-white/[0.06]" />

              <div className="mt-4 flex justify-between">
                <div className="h-3 w-20 animate-pulse rounded bg-white/5" />

                <div className="h-3 w-28 animate-pulse rounded bg-violet-500/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}