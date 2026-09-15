import Container from "@/components/ui/Container";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-zinc-900 bg-black py-24">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
              Legal
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Refund Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              Learn how refunds and subscription-related payment requests are
              handled for CoachDM AI.
            </p>

            <p className="mt-4 text-sm text-zinc-500">
              Last updated: September 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Refund Policy Content */}
      <section className="bg-zinc-950 py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-7 text-zinc-300">
            <section>
              <h2 className="text-2xl font-semibold text-white">
                1. Overview
              </h2>

              <p className="mt-4">
                This Refund Policy explains how refunds are handled for
                CoachDM AI subscriptions.
              </p>

              <p className="mt-4">
                CoachDM AI is operated by Ayush Lakra. Payments for paid
                subscriptions are processed through Paddle.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                2. Subscription Payments
              </h2>

              <p className="mt-4">
                CoachDM AI Pro is a subscription service billed according to
                the billing period selected at checkout.
              </p>

              <p className="mt-4">
                By purchasing a subscription, you authorize the applicable
                subscription charges according to the terms displayed during
                checkout.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                3. Cancellation
              </h2>

              <p className="mt-4">
                You may cancel your subscription at any time through the
                applicable Paddle subscription management or customer portal.
              </p>

              <p className="mt-4">
                Cancellation generally prevents the subscription from
                automatically renewing for the next billing period.
              </p>

              <p className="mt-4">
                Unless otherwise required by applicable law, cancelling a
                subscription does not automatically result in a refund for the
                current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                4. Refund Requests
              </h2>

              <p className="mt-4">
                If you believe you are eligible for a refund, you may submit a
                refund request through the applicable Paddle customer support
                or transaction management process.
              </p>

              <p className="mt-4">
                Refund requests may be reviewed based on the circumstances of
                the request, the applicable subscription terms, and applicable
                consumer protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                5. Duplicate or Incorrect Charges
              </h2>

              <p className="mt-4">
                If you believe you have been charged more than once for the
                same subscription or have received an incorrect charge, please
                contact us as soon as possible so the transaction can be
                reviewed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                6. Service Issues
              </h2>

              <p className="mt-4">
                If you experience a technical issue that prevents you from
                reasonably using a paid CoachDM AI feature, please contact us
                with details of the issue.
              </p>

              <p className="mt-4">
                We may investigate the issue and, where appropriate, provide
                assistance or consider a refund in accordance with applicable
                law and the circumstances of the case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                7. Paddle
              </h2>

              <p className="mt-4">
                Paddle processes payments for CoachDM AI subscriptions and may
                handle payment-related support, refunds, invoices, and
                applicable taxes as the merchant of record.
              </p>

              <p className="mt-4">
                Certain refund or payment requests may therefore be handled
                directly through Paddle's customer support process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                8. Consumer Rights
              </h2>

              <p className="mt-4">
                Nothing in this Refund Policy limits or removes any mandatory
                rights you may have under applicable consumer protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                9. Changes to This Policy
              </h2>

              <p className="mt-4">
                We may update this Refund Policy from time to time. Any changes
                will be published on this page with an updated effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                10. Contact
              </h2>

              <p className="mt-4">
                For questions about refunds or subscription payments, contact:
              </p>

              <div className="mt-4 rounded-2xl border border-zinc-800 bg-black p-6">
                <p>
                  <strong className="text-white">Ayush Lakra</strong>
                  <br />
                  CoachDM AI
                  <br />
                  Email: notifications@coachdm.pro
                </p>
              </div>
            </section>
          </div>
        </Container>
      </section>
    </main>
  );
}