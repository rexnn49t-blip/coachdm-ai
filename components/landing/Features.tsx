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
    title: "AI Replies",
    description: "Generate personalized replies for every lead.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Messages",
    description: "Guide prospects toward booking a call.",
  },
  {
    icon: ShieldCheck,
    title: "Handle Objections",
    description: "Respond confidently to pricing and hesitation.",
  },
  {
    icon: Sparkles,
    title: "Multiple Tones",
    description: "Friendly, Professional, Luxury, High Ticket and more.",
  },
  {
    icon: History,
    title: "Reply History",
    description: "Access every reply you've ever generated.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create high-converting replies in seconds.",
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
            Everything You Need to Convert More Leads
          </h2>

          <p className="mt-4 text-gray-400">
            Built specifically for coaches who want to save time and close more
            clients.
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