const faqs = [
  {
    question: "Who is CoachDM AI for?",
    answer:
      "CoachDM AI is built for business coaches, life coaches, fitness coaches, consultants, mentors, and anyone who sells coaching services through direct messages.",
  },
  {
    question: "Do I need AI experience?",
    answer:
      "No. Just paste your prospect's message, choose a tone, and CoachDM AI generates personalized replies instantly.",
  },
  {
    question: "Can I try it for free?",
    answer:
      "Yes. Our Free plan lets you generate AI replies every day before deciding to upgrade.",
  },
  {
    question: "What happens if I upgrade?",
    answer:
      "You'll unlock unlimited generations, premium reply tones, objection handling, reply history, and future Pro features.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            FAQ
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-400">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-zinc-800 bg-black p-6"
            >
              <h3 className="text-xl font-semibold">
                {faq.question}
              </h3>

              <p className="mt-3 text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}