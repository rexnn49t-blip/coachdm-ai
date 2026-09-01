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
    name: "AI Follow-up Messages",
    free: false,
    pro: true,
  },
  {
    name: "Premium AI Models",
    free: false,
    pro: true,
  },
  {
    name: "Reply History",
    free: "30 Days",
    pro: "Unlimited",
  },
  {
    name: "Copy & Export",
    free: true,
    pro: true,
  },
  {
    name: "Priority AI Queue",
    free: false,
    pro: true,
  },
  {
    name: "Priority Support",
    free: false,
    pro: true,
  },
  {
    name: "Future Features",
    free: false,
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
      <Check className="mx-auto h-5 w-5 text-green-400" />
    ) : (
      <X className="mx-auto h-5 w-5 text-zinc-600" />
    );
  }

  return (
    <span className="font-medium text-white">
      {value}
    </span>
  );
}

export default function FeatureComparison() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold">

            Compare Plans

          </h2>

          <p className="mt-4 text-zinc-400">

            Everything included in every plan.

            Upgrade whenever you're ready.

          </p>

        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10">

          <table className="w-full">

            <thead className="bg-white/5 backdrop-blur">

              <tr>

                <th className="px-8 py-6 text-left text-zinc-300">

                  Features

                </th>

                <th className="text-center">

                  Free

                </th>

                <th className="text-center text-violet-400">

                  Pro

                </th>

              </tr>

            </thead>

            <tbody>

              {features.map((feature) => (

                <tr
                  key={feature.name}
                  className="border-t border-white/10 transition hover:bg-white/[0.03]"
                >

                  <td className="px-8 py-6 font-medium">

                    {feature.name}

                  </td>

                  <td className="text-center">

                    <Cell value={feature.free} />

                  </td>

                  <td className="text-center">

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