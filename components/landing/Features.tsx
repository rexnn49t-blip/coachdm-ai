import {
  MessageSquare,
  Search,
  ShieldCheck,
  UsersRound,
  BrainCircuit,
  History,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Reply Generator",
    description:
      "Generate personalized replies based on your real conversations with potential clients.",
  },
  {
    icon: Search,
    title: "AI Lead Generator",
    description:
      "Research publicly discoverable prospects and find better opportunities to start conversations.",
  },
  {
    icon: ShieldCheck,
    title: "Handle Objections",
    description:
      "Get thoughtful response suggestions for pricing questions, hesitation, and common client concerns.",
  },
  {
    icon: UsersRound,
    title: "Leads & Follow-Ups",
    description:
      "Organize your leads, track conversations, manage follow-ups, and move prospects toward becoming clients.",
  },
  {
    icon: BrainCircuit,
    title: "AI Sales Roleplay",
    description:
      "Practice sales conversations, handle difficult objections, and build confidence before talking to real prospects.",
  },
  {
    icon: History,
    title: "Reply History",
    description:
      "Keep access to your generated replies and review your previous conversation assistance.",
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
            Everything You Need to Turn Conversations Into Clients
          </h2>

          <p className="mt-4 text-gray-400">
            Built specifically for coaches to find prospects, start better
            conversations, and follow up with confidence.
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