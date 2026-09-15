import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Coach",
    text:
      "CoachDM AI has completely changed how I respond to leads. I save hours every week and my conversations feel far more professional.",
  },
  {
    name: "Michael Lee",
    role: "Fitness Coach",
    text:
      "The AI replies sound natural and give me a much better starting point when I'm not sure how to respond.",
  },
  {
    name: "Emma Brown",
    role: "Life Coach",
    text:
      "Instead of staring at messages wondering what to say, I can generate a thoughtful reply in seconds and make it my own.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-24">
      <Container>
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-500">
              Testimonials
            </p>

            <h2 className="mt-4 text-4xl font-bold text-white">
              Loved by Coaches Worldwide
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-400">
              See how coaches use AI assistance to save time and communicate
              more confidently in their client conversations.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.15}>
              <Card>
                <div className="mb-5 flex text-xl text-yellow-400">
                  ★★★★★
                </div>

                <p className="leading-8 text-gray-300">
                  &quot;{item.text}&quot;
                </p>

                <div className="mt-8">
                  <h4 className="font-semibold text-white">
                    {item.name}
                  </h4>

                  <p className="text-gray-500">
                    {item.role}
                  </p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}