"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-lg text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-500/10">
          <SearchX className="h-12 w-12 text-violet-400" />
        </div>

        <h1 className="mt-8 text-5xl font-bold">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Page not found
        </h2>

        <p className="mt-4 text-zinc-400 leading-7">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 font-semibold transition hover:scale-105"
        >
          Back to Dashboard
        </Link>

      </div>
    </main>
  );
}