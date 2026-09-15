import Container from "@/components/ui/Container";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-zinc-900 bg-black py-24">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
              About CoachDM AI
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Helping Coaches Have
              <br />
              Better Conversations
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              CoachDM AI is built to help coaches communicate more confidently
              and efficiently when working with potential clients.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-zinc-950 py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Why CoachDM AI?
              </h2>

              <p className="mt-4 leading-8 text-gray-400">
                Coaches spend a significant amount of time responding to
                questions, handling objections, following up on conversations,
                and figuring out how to communicate their value clearly.
              </p>

              <p className="mt-4 leading-8 text-gray-400">
                CoachDM AI provides AI-powered assistance for these everyday
                conversations, helping coaches create thoughtful reply
                suggestions without having to start from scratch every time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                What We Believe
              </h2>

              <p className="mt-4 leading-8 text-gray-400">
                AI should support people, not replace the human connection
                behind meaningful conversations. CoachDM AI is designed to give
                coaches a useful starting point while keeping the coach in
                control of what they communicate.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Built for Coaches
              </h2>

              <p className="mt-4 leading-8 text-gray-400">
                Whether you are a business coach, fitness coach, life coach,
                consultant, mentor, or another coaching professional, CoachDM
                AI is designed to help you spend less time thinking about what
                to write and more time focusing on the people you serve.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-6">
              <p className="text-sm leading-7 text-gray-400">
                CoachDM AI is operated by Ayush Lakra as an independent
                software product under the CoachDM AI brand.
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Contact: notifications@coachdm.pro
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}