export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.04]" />

      {/* Ambient glow */}
      <div className="fixed left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Navbar skeleton */}
        <div className="flex h-20 items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />

          <div className="hidden items-center gap-8 md:flex">
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
          </div>

          <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10 md:hidden" />
        </div>

        {/* Hero skeleton */}
        <section className="flex min-h-[700px] flex-col items-center justify-center py-24 text-center">
          <div className="h-8 w-40 animate-pulse rounded-full bg-violet-500/10" />

          <div className="mt-8 h-16 w-full max-w-3xl animate-pulse rounded-2xl bg-white/10 sm:h-20" />

          <div className="mt-4 h-16 w-4/5 max-w-2xl animate-pulse rounded-2xl bg-white/10 sm:h-20" />

          <div className="mt-8 h-5 w-full max-w-xl animate-pulse rounded bg-white/10" />

          <div className="mt-3 h-5 w-4/5 max-w-lg animate-pulse rounded bg-white/10" />

          <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row">
            <div className="h-14 flex-1 animate-pulse rounded-2xl bg-violet-500/20" />
            <div className="h-14 flex-1 animate-pulse rounded-2xl bg-white/10" />
          </div>

          {/* Hero visual */}
          <div className="mt-20 h-64 w-full max-w-5xl animate-pulse rounded-3xl border border-white/10 bg-white/5 sm:h-80" />
        </section>

        {/* Trusted By skeleton */}
        <section className="py-20">
          <div className="mx-auto h-4 w-32 animate-pulse rounded bg-white/10" />

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        </section>

        {/* Features skeleton */}
        <section className="py-24">
          <div className="mx-auto h-10 w-64 animate-pulse rounded-xl bg-white/10" />

          <div className="mx-auto mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-white/10" />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </section>

        {/* How it works skeleton */}
        <section className="py-24">
          <div className="mx-auto h-10 w-56 animate-pulse rounded-xl bg-white/10" />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-3xl bg-white/5"
              />
            ))}
          </div>
        </section>

        {/* Testimonials skeleton */}
        <section className="py-24">
          <div className="mx-auto h-10 w-64 animate-pulse rounded-xl bg-white/10" />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </section>

        {/* FAQ skeleton */}
        <section className="py-24">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-xl bg-white/10" />

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </section>

        {/* CTA skeleton */}
        <section className="py-24">
          <div className="mx-auto h-72 max-w-5xl animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        </section>

        {/* Footer skeleton */}
        <footer className="border-t border-white/10 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
              </div>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}