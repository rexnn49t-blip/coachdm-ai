"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can cancel your subscription at any time through the applicable Paddle subscription management portal. Cancellation generally prevents the next renewal, while your access continues according to the applicable billing terms.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Every account starts on the Free plan with 3 AI replies per month, along with core features such as lead management and reply history. Upgrade to Pro whenever you need additional AI-powered features and higher usage.",
  },
  {
    question: "What AI features are included in Pro?",
    answer:
      "Pro includes unlimited AI reply generation, AI follow-up assistance, AI sales roleplay, AI lead generation, objection handling, lead management, reply history, and Copy & Export.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Absolutely. You can upgrade from the Free plan to Pro at any time through the CoachDM AI upgrade flow.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We take reasonable technical and organizational measures to protect your information. CoachDM AI does not sell your personal information. Please review our Privacy Policy for more information about how your data is collected, used, and protected.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Refund requests are handled according to the applicable refund policy and consumer protection laws. Payments are processed through Paddle, which may handle certain payment and refund requests. Please review our Refund Policy for more information.",
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-lg text-zinc-400">
            Everything you need to know before upgrading.
          </p>

        </div>

        <div className="mt-14 space-y-5">

          {faqs.map((faq, index) => {

            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                layout
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >

                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between px-7 py-6 text-left"
                >

                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                  >
                    <ChevronDown className="h-5 w-5 text-violet-400" />
                  </motion.div>

                </button>

                <AnimatePresence>

                  {isOpen && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                    >

                      <div className="border-t border-white/10 px-7 py-6 text-zinc-400 leading-7">

                        {faq.answer}

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </motion.div>
            );

          })}

        </div>

      </div>
    </section>
  );
}