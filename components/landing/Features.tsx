import {
  MessageSquare,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  History,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Reply Assistance",
    description:
      "Generate personalized replies based on the conversations you're already having with potential clients.",
  },
  {
    icon: CalendarCheck,
    title: "Call Booking Messages",
    description:
      "Create clear, natural messages that help move an ongoing conversation toward a call when appropriate.",
  },
  {
    icon: ShieldCheck,
    title: "Handle Objections",
    description:
      "Get thoughtful response suggestions for pricing questions, hesitation, and common client concerns.",
  },
  {
    icon: Sparkles,
    title: "Multiple Tones",
    description:
      "Choose from Professional, Confident, Empathetic, Persuasive, and other response styles.",
  },
  {
    icon: History,
    title: "Reply History",
    description:
      "Keep access to the AI replies you've generated and review your previous conversation assistance.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get useful reply suggestions in seconds so you can respond to conversations more efficiently.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-black py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Everything You Need for Better Conversations
          </h2>

          <p className="mt-4 text-gray-400">
            Built specifically for coaches who want to save time and communicate
            more confidently with potential clients.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8 transition hover:border-blue-500"
            >
              <feature.icon className="mb-6 h-10 w-10 text-blue-500" />

              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}