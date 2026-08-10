export default function RepliesLoading() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10" />

            <div className="space-y-3">
              <div className="h-8 w-64 rounded-lg bg-white/10" />
              <div className="h-4 w-96 rounded-lg bg-white/5" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="h-12 flex-1 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-12 w-40 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-12 w-40 animate-pulse rounded-2xl bg-white/5" />
        </div>

        {/* Reply Cards */}
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="space-y-4">
                <div className="h-4 w-2/3 rounded bg-white/10" />

                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-white/5" />
                  <div className="h-4 w-11/12 rounded bg-white/5" />
                  <div className="h-4 w-10/12 rounded bg-white/5" />
                </div>

                <div className="flex justify-between pt-3">
                  <div className="flex gap-2">
                    <div className="h-8 w-20 rounded-full bg-white/10" />
                    <div className="h-8 w-20 rounded-full bg-white/10" />
                  </div>

                  <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-lg bg-white/10" />
                    <div className="h-9 w-9 rounded-lg bg-white/10" />
                    <div className="h-9 w-9 rounded-lg bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}