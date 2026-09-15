import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-black py-28">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <Container className="relative z-10 text-center">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
          Get Started Today
        </span>

        <h2 className="mt-8 text-4xl font-bold text-white md:text-6xl">
          Ready To Have
          <br />
          Better Conversations?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Use CoachDM AI to save time, get thoughtful reply suggestions, and
          communicate more confidently with potential clients.
        </p>

        <div className="mt-12 flex justify-center gap-4">
          <Button href="/sign-up" size="lg">
            Start Free Today
          </Button>

          <Button
            href="/pricing"
            variant="outline"
            size="lg"
          >
            View Pricing
          </Button>
        </div>
      </Container>
    </section>
  );
}