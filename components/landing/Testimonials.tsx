import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";

const highlights = [
  {
    title: "Find Better Prospects",
    text:
      "Discover potential clients and identify opportunities worth starting a conversation with.",
  },
  {
    title: "Have Better Conversations",
    text:
      "Generate thoughtful replies, handle objections, and communicate with more confidence.",
  },
  {
    title: "Follow Up With Confidence",
    text:
      "Keep track of leads and follow-ups so promising conversations don't get forgotten.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-24">
      <Container>
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-500">
              Built for Coaches
            </p>

            <h2 className="mt-4 text-4xl font-bold text-white">
              Built for the Way Coaches Sell
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-400">
              CoachDM brings prospect discovery, AI conversations, follow-ups,
              and sales practice into one simple workspace.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-3">
          {highlights.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.15}>
              <Card>
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-gray-400">
                  {item.text}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}