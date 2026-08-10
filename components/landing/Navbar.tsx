"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";

import {
  UserButton,
  useUser,
} from "@clerk/nextjs";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Features",
    href: "/#features",
  },
  {
    name: "FAQs",
    href: "/#faq",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Settings",
    href: "/settings",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/90 backdrop-blur-xl"
          : "bg-black/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <MessageSquareText className="h-6 w-6 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Coach<span className="text-blue-500">DM AI</span>
            </h2>

            <p className="text-xs text-gray-400">
              AI Sales Assistant
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden items-center gap-8 lg:flex xl:gap-10">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium text-gray-300 transition hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="ml-8 hidden items-center gap-4 lg:flex">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition hover:border-blue-500 hover:bg-zinc-900"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:scale-105 hover:bg-blue-700"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Menu className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-black/95 backdrop-blur-xl lg:hidden">
          <div className="space-y-6 p-6">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="block text-lg text-gray-300 transition hover:text-white"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              {isSignedIn ? (
                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-12 w-12",
                      },
                    }}
                  />
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl border border-zinc-700 py-3 text-center text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}