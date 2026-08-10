import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  {
    value: 25000,
    suffix: "+",
    label: "AI Replies Generated",
  },
  {
    value: 1200,
    suffix: "+",
    label: "Discovery Calls Booked",
  },
  {
    value: 97,
    suffix: "%",
    label: "Customer Satisfaction",
  },
  {
    value: 40,
    suffix: "+",
    label: "Countries Reached",
  },
];

export default function TrustedBy() {
  return (
    <section className="relative border-y border-zinc-900 bg-black py-24">
      <Container>
        <FadeIn>
          <div className="text-center">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
              Trusted Worldwide
            </span>

            <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
              Helping Coaches Convert More Leads
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-400">
              Every day, coaches use CoachDM AI to respond faster, build trust,
              and book more discovery calls with personalized AI-powered
              conversations.
            </p>
          </div>
        </FadeIn>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <FadeIn key={item.label} delay={0.15 * index}>
              <div className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="text-5xl font-extrabold text-white">
                  <AnimatedCounter value={item.value} />
                  {item.suffix}
                </div>

                <p className="mt-4 text-gray-400">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}