export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-blue-400">
            Contact CoachDM AI
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            We&apos;re Here to Help
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Have a question about CoachDM AI, your account, billing, or
            anything else? Get in touch with us and we&apos;ll be happy to
            help.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-xl sm:p-10">
          <h2 className="text-2xl font-semibold">Email Support</h2>

          <p className="mt-3 leading-7 text-gray-400">
            For questions, support requests, billing concerns, or other
            inquiries, contact us at:
          </p>

          <a
            href="mailto:coachdmsupport@gmail.com"
            className="mt-6 inline-block text-lg font-medium text-blue-400 transition hover:text-blue-300"
          >
            coachdmsupport@gmail.com
          </a>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm leading-6 text-gray-500">
              When contacting us about your account, please include enough
              information for us to understand your request. For security,
              never send your password or other sensitive account credentials
              by email.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
         
        </div>
      </section>
    </main>
  );
}