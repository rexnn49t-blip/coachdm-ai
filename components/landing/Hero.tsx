import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* Content */}
      <Container className="relative z-10 flex flex-col items-center py-20 text-center">
        {/* Badge */}
        <FadeIn>
          <Badge>
          🚀 Trusted by Coaches Worldwide
          </Badge>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.15}>
  <h1 className="mt-8 bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-7xl">
    Turn Coaching Conversations
    <br />
    Into Paying Clients
  </h1>
</FadeIn>

        {/* Description */}
        <FadeIn delay={0.3}>
  <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400 md:text-xl">
    Generate personalized replies, follow-ups, booking messages, and
    objection-handling responses that help you build trust and convert
    more leads into paying clients.
  </p>
</FadeIn>

        {/* Buttons */}
        <FadeIn delay={0.45}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/sign-up" size="lg">
              Start Free
            </Button>

           <Button
    href="/#how-it-works"
    variant="outline"
    size="lg"
  >
    How It Works
  </Button>
</div>
        </FadeIn>

        {/* Dashboard Preview */}
        <FadeIn delay={0.6}>
  <div className="mx-auto mt-20 w-full max-w-6xl">
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-blue-500/10">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          CoachDM AI Workspace
        </h3>

        <div className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
          Live Preview
        </div>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-2">

        {/* Left Panel */}
        <div className="space-y-5">

          <div>
            <p className="mb-2 text-sm text-gray-400">
              Prospect Message
            </p>

            <div className="rounded-xl border border-zinc-800 bg-black p-4 text-gray-300">
              Hi! I saw your fitness coaching program on Instagram.
              I'd love to know how it works and whether it's right for me.
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Tone
              </p>

              <div className="rounded-xl border border-zinc-800 bg-black p-3">
                Friendly ▼
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">
                Goal
              </p>

              <div className="rounded-xl border border-zinc-800 bg-black p-3">
                Book Discovery Call ▼
              </div>
            </div>

          </div>

          <div className="w-full">
  <Button href="#" size="lg">
    Generate AI Reply
  </Button>
</div>

        </div>

        {/* Right Panel */}
        <div>

          <p className="mb-2 text-sm text-gray-400">
            AI Reply
          </p>

          <div className="rounded-2xl border border-zinc-800 bg-black p-6">

            <p className="leading-8 text-gray-300">
              Hi! 👋
              <br /><br />

              Thanks so much for reaching out and for your interest in my coaching program.

              I'd love to learn a little more about your goals so I can recommend the best path for you.

              Would you be open to a quick 15-minute discovery call this week?

              Looking forward to hearing from you!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Button size="sm">
                Copy Reply
              </Button>

              <Button
                variant="outline"
                size="sm"
              >
                Regenerate
              </Button>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</FadeIn>
      </Container>
    </section>
  );
}