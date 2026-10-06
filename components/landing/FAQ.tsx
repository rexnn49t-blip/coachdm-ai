const faqs = [
  {
    question: "Who is CoachDM AI for?",
    answer:
      "CoachDM AI is built for coaches and other client-focused professionals who use conversations, follow-ups, and sales to grow their business. It is especially useful for business, career, executive, life, leadership, and fitness coaches.",
  },
  {
    question: "What can I do with CoachDM AI?",
    answer:
      "You can discover potential clients, generate personalized replies, handle objections, practice sales conversations with AI, manage leads, and keep track of follow-ups.",
  },
  {
    question: "Do I need AI experience?",
    answer:
      "No. CoachDM AI is designed to be simple to use. Choose the tool you need, provide the relevant information, and let AI assist you with the next step.",
  },
  {
    question: "Can I try CoachDM AI for free?",
    answer:
      "Yes. The Free plan includes 3 AI replies per month and 3 AI lead searches per month. Free users can also save 1 lead.",
  },
  {
    question: "What's included in the Pro plan?",
    answer:
      "Pro includes unlimited AI replies, unlimited AI lead generation, unlimited lead management, AI follow-up assistance, AI sales roleplay, objection handling, reply history, and priority support.",
  },
  {
    question: "How much does Pro cost?",
    answer:
      "The Pro plan is $29 per month. You can cancel anytime, and your subscription continues until the end of the current billing period.",
  },
  {
    question: "Will CoachDM AI automatically contact my prospects?",
    answer:
      "No. CoachDM AI assists you with prospect discovery, replies, sales practice, and follow-ups, but you remain in control of your conversations and decide what to send.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="bg-zinc-950 py-24 text-white"
    >
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