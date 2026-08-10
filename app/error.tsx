"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-lg text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
          <TriangleAlert className="h-12 w-12 text-red-400" />
        </div>

        <h1 className="mt-8 text-4xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-4 text-zinc-400 leading-7">
          An unexpected error occurred while loading this page.
        </p>

        <button
          onClick={reset}
          className="mt-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 font-semibold transition hover:scale-105"
        >
          Try Again
        </button>

      </div>
    </main>
  );
}