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
      "The AI replies sound natural and have helped me book more discovery calls than ever before.",
  },
  {
    name: "Emma Brown",
    role: "Life Coach",
    text:
      "Instead of staring at Instagram messages wondering what to say, I generate replies in seconds.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-24">
      <Container>
        <FadeIn>
          <div className="mb-16 text-center">
            <p className="text-blue-500 font-semibold uppercase tracking-widest">
              Testimonials
            </p>

            <h2 className="mt-4 text-4xl font-bold text-white">
              Loved by Coaches Worldwide
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-gray-400">
              Thousands of AI-generated conversations helping coaches convert
              more leads into paying clients.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.15}>
              <Card>
                <div className="flex mb-5 text-yellow-400 text-xl">
                  ★★★★★
                </div>

                <p className="leading-8 text-gray-300">
                  "{item.text}"
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