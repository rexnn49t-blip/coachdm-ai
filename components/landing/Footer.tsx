import Link from "next/link";
import { MessageSquareText, Mail } from "lucide-react";
import {
  FaLinkedin,
  FaXTwitter,
  FaGithub,
} from "react-icons/fa6";

export default function Footer() {
  const socialLinks = [
    {
      icon: FaXTwitter,
      href: "#",
      label: "X",
    },
    {
      icon: FaLinkedin,
      href: "#",
      label: "LinkedIn",
    },
    {
      icon: FaGithub,
      href: "#",
      label: "GitHub",
    },
    {
      icon: Mail,
      href: "#",
      label: "Email",
    },
  ];

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <MessageSquareText className="h-6 w-6 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Coach<span className="text-blue-500">DM AI</span>
                </h2>

                <p className="text-sm text-gray-400">
                  AI Sales Assistant for Coaches
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md leading-8 text-gray-400">
              CoachDM AI helps coaches generate personalized replies,
              follow-ups, booking messages, and objection-handling responses
              that convert more conversations into paying clients.
            </p>

            {/* Social Links */}
            <div className="mt-8 flex gap-4">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-gray-400 transition-all duration-300 hover:scale-110 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Product
            </h3>

            <ul className="mt-6 space-y-4 text-gray-400">
              <li>
                <Link href="/#features" className="transition hover:text-white">
                  Features
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="transition hover:text-white">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/dashboard" className="transition hover:text-white">
                  Dashboard
                </Link>
              </li>

              <li>
                <Link href="/#faq" className="transition hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Resources
            </h3>

            <ul className="mt-6 space-y-4 text-gray-400">
              <li>
                <Link href="#" className="transition hover:text-white">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="#" className="transition hover:text-white">
                  Help Center
                </Link>
              </li>

              <li>
                <Link href="#" className="transition hover:text-white">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="#" className="transition hover:text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Company
            </h3>

            <ul className="mt-6 space-y-4 text-gray-400">
              <li>
                <Link href="#" className="transition hover:text-white">
                  About
                </Link>
              </li>

              <li>
                <Link href="#" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="#" className="transition hover:text-white">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link href="#" className="transition hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-800 pt-8 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} CoachDM AI. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <span>🔒 Secure Payments</span>
            <span>⚡ AI Powered</span>
            <span>🌍 Built for Coaches Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}