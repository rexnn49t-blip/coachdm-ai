export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-72 rounded-xl bg-white/10" />
          <div className="h-5 w-96 rounded-xl bg-white/5" />
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>

        {/* Generator */}
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">

          <div className="h-[650px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />

          <div className="h-[650px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />

        </div>

      </div>
    </main>
  );
}