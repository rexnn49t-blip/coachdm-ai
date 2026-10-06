import {
  Search,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Potential Clients",
    description:
      "Discover publicly available prospects who may be a good fit for your coaching and identify relevant opportunities.",
  },
  {
    icon: MessageSquareText,
    title: "Start Better Conversations",
    description:
      "Generate personalized replies, handle objections, and communicate with potential clients more confidently.",
  },
  {
    icon: ArrowRight,
    title: "Follow Up & Convert",
    description:
      "Track your leads, manage follow-ups, and move promising conversations toward calls and paying clients.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-zinc-950 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
            How It Works
          </span>

         <h2 className="mt-6 bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
  Find Prospects.
  <br />
  Start Conversations. 
    <br />
  Close Clients.
</h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Find potential clients, start better conversations, and follow up
            with confidence using AI built specifically for coaches.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-3xl border border-zinc-800 bg-black p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Step Number */}
              <div className="absolute -top-5 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/30">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 transition-colors duration-300 group-hover:bg-blue-600/20">
                <step.icon className="h-8 w-8 text-blue-500" />
              </div>

              {/* Title */}
              <h3 className="mt-8 text-2xl font-semibold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-4 leading-7 text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}