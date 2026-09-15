import Container from "@/components/ui/Container";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              Learn how CoachDM AI collects, uses, stores, and protects
              information when you use our service.
            </p>

            <p className="mt-4 text-sm text-zinc-500">
              Last updated: September 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Policy Content */}
      <section className="bg-zinc-950 py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-7 text-zinc-300">
            <section>
              <h2 className="text-2xl font-semibold text-white">
                1. Introduction
              </h2>

              <p className="mt-4">
                This Privacy Policy explains how Ayush Lakra, operating
                CoachDM AI, collects, uses, stores, and protects information
                when you use CoachDM AI.
              </p>

              <p className="mt-4">
                By using CoachDM AI, you acknowledge the practices described in
                this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                2. Information We Collect
              </h2>

              <p className="mt-4">
                Depending on how you use CoachDM AI, we may collect information
                such as:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Name and email address</li>
                <li>Account and authentication information</li>
                <li>Lead names and contact information you enter</li>
                <li>
                  Messages, notes, and conversation information you submit
                </li>
                <li>AI-generated replies and related usage information</li>
                <li>Subscription and account-plan information</li>
                <li>
                  Technical information necessary to operate and secure the
                  service
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                3. How We Use Information
              </h2>

              <p className="mt-4">
                We use collected information to provide, maintain, and improve
                CoachDM AI.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Provide and operate your CoachDM AI account</li>
                <li>Generate AI-assisted replies and recommendations</li>
                <li>Manage leads and conversation history</li>
                <li>Process subscriptions and payments</li>
                <li>Send important account and service notifications</li>
                <li>Monitor usage and enforce plan limits</li>
                <li>Maintain security and prevent abuse</li>
                <li>
                  Improve the reliability and functionality of the service
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                4. AI Processing
              </h2>

              <p className="mt-4">
                Information you provide to CoachDM AI may be processed by
                third-party artificial intelligence providers in order to
                provide AI-powered features.
              </p>

              <p className="mt-4">
                AI-generated content is produced automatically and may not
                always be accurate or appropriate. You are responsible for
                reviewing generated content before using or sending it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                5. Payment Information
              </h2>

              <p className="mt-4">
                Payments for CoachDM AI subscriptions are processed by Paddle.
                CoachDM AI does not directly store your complete payment card
                details.
              </p>

              <p className="mt-4">
                Payment transactions may be subject to Paddle's privacy policy
                and terms in addition to this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                6. Service Providers
              </h2>

              <p className="mt-4">
                CoachDM AI uses third-party providers to operate different
                parts of the service. These may include providers for
                authentication, hosting, databases, artificial intelligence,
                payments, and email delivery.
              </p>

              <p className="mt-4">
                These providers may process information on our behalf as
                necessary to provide their services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                7. Data Retention
              </h2>

              <p className="mt-4">
                We retain information for as long as reasonably necessary to
                provide the service, maintain your account, comply with legal
                obligations, resolve disputes, enforce agreements, and
                maintain legitimate business records.
              </p>

              <p className="mt-4">
                When information is no longer reasonably required, we may
                delete or anonymize it in accordance with our operational and
                legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                8. Data Security
              </h2>

              <p className="mt-4">
                We take reasonable technical and organizational measures to
                protect information against unauthorized access, loss, misuse,
                alteration, or disclosure.
              </p>

              <p className="mt-4">
                However, no online service can guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                9. Your Responsibilities
              </h2>

              <p className="mt-4">
                You are responsible for ensuring that you have the appropriate
                rights and permissions to provide personal information about
                leads, clients, or other individuals to CoachDM AI.
              </p>

              <p className="mt-4">
                You should not submit sensitive information to CoachDM AI
                unless it is necessary, lawful, and appropriate for your use of
                the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                10. Your Privacy Rights
              </h2>

              <p className="mt-4">
                Depending on your location and applicable law, you may have
                rights concerning your personal information, including rights
                to access, correct, delete, restrict, or otherwise manage your
                information.
              </p>

              <p className="mt-4">
                To make a privacy-related request, contact us using the email
                address provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                11. Cookies and Similar Technologies
              </h2>

              <p className="mt-4">
                CoachDM AI may use cookies or similar technologies that are
                necessary for authentication, security, session management,
                and service functionality.
              </p>

              <p className="mt-4">
                Additional technologies may be used in the future to understand
                service usage and improve the product.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                12. Children's Privacy
              </h2>

              <p className="mt-4">
                CoachDM AI is intended for business users and is not directed
                toward children. We do not knowingly collect personal
                information from children in violation of applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                13. Changes to This Privacy Policy
              </h2>

              <p className="mt-4">
                We may update this Privacy Policy from time to time. Any
                changes will be published on this page with an updated
                effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                14. Contact Us
              </h2>

              <p className="mt-4">
                If you have questions about this Privacy Policy or want to make
                a privacy-related request, contact:
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