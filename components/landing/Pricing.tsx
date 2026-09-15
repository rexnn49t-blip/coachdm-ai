import { Check } from "lucide-react";

const freeFeatures = [
  "3 AI replies per month",
  "Reply Generator",
  "Follow-up Assistance",
  "Call Booking Assistance",
  "Basic Reply Tones",
];

const proFeatures = [
  "Unlimited AI replies",
  "All Reply Tones",
  "Objection Handling",
  "Reply History",
  "Priority AI Speed",
  "Future Premium Features",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-black py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Pricing
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Simple Pricing for Every Coach
          </h2>

          <p className="mt-4 text-gray-400">
            Start free. Upgrade only when you&apos;re ready.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-10">
            <h3 className="text-2xl font-bold">Free</h3>

            <p className="mt-4 text-5xl font-extrabold">
              $0
              <span className="text-lg text-gray-400">/month</span>
            </p>

            <button className="mt-8 w-full rounded-xl border border-gray-700 py-3 font-semibold transition hover:bg-zinc-800">
              Get Started
            </button>

            <div className="mt-10 space-y-4">
              {freeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-600/10 to-zinc-900 p-10">
            <div className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
              MOST POPULAR
            </div>

            <h3 className="text-2xl font-bold">Pro</h3>

            <p className="mt-4 text-5xl font-extrabold">
              $19
              <span className="text-lg text-gray-400">/month</span>
            </p>

            <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-700">
              Upgrade to Pro
            </button>

            <div className="mt-10 space-y-4">
              {proFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}