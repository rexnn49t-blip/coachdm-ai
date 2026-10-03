import { Check, X } from "lucide-react";

const features = [
  {
    name: "AI Reply Generation",
    free: true,
    pro: true,
  },
  {
    name: "Replies per Month",
    free: "3",
    pro: "Unlimited",
  },
  {
    name: "AI Follow-up Assistance",
    free: false,
    pro: true,
  },
  {
    name: "AI Sales Roleplay",
    free: true,
    pro: true,
  },
  {
    name: "AI Lead Generator",
    free: "3 Searches / Month",
    pro: "Unlimited",
  },
  {
    name: "Lead Management & Guidance",
    free: "1 Lead",
    pro: "Unlimited",
  },
  {
    name: "Reply History",
    free: true,
    pro: true,
  },
  {
    name: "Copy & Export",
    free: true,
    pro: true,
  },
];

function Cell({
  value,
}: {
  value: boolean | string;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className="mx-auto h-5 w-5 text-emerald-400"
        strokeWidth={2.5}
      />
    ) : (
      <X
        className="mx-auto h-5 w-5 text-zinc-600"
        strokeWidth={2}
      />
    );
  }

  return (
    <span className="text-sm font-semibold text-white">
      {value}
    </span>
  );
}

export default function FeatureComparison() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}

        <div className="mx-auto max-w-2xl text-center">

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Compare Plans
          </h2>

          <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">
            See exactly what’s included with Free and Pro.
            Upgrade whenever you’re ready.
          </p>

        </div>

        {/* Comparison table */}

        <div className="mt-12 overflow-x-auto rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-2xl shadow-black/20 sm:mt-14">

          <table className="w-full min-w-[640px] border-collapse">

            <thead className="bg-white/[0.04]">

              <tr>

                <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 sm:px-8">
                  Features
                </th>

                <th className="w-32 px-4 py-5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Free
                </th>

                <th className="w-36 px-4 py-5 text-center text-xs font-semibold uppercase tracking-wider text-violet-300">
                  Pro
                </th>

              </tr>

            </thead>

            <tbody>

              {features.map((feature) => (

                <tr
                  key={feature.name}
                  className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.025]"
                >

                  <td className="px-6 py-5 text-sm font-medium text-zinc-200 sm:px-8">
                    {feature.name}
                  </td>

                  <td className="px-4 py-5 text-center">
                    <Cell value={feature.free} />
                  </td>

                  <td className="bg-violet-500/[0.025] px-4 py-5 text-center">
                    <Cell value={feature.pro} />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </section>
  );
}