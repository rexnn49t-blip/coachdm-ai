"use client";

import { useEffect, useState } from "react";

type DynamicGreetingProps = {
  coachName: string;
};

export default function DynamicGreeting({
  coachName,
}: DynamicGreetingProps) {
  const [greeting, setGreeting] =
    useState("Good morning");

  useEffect(() => {
    const currentHour = new Date().getHours();

    setGreeting(
      currentHour < 12
        ? "Good morning"
        : currentHour < 17
          ? "Good afternoon"
          : "Good evening"
    );
  }, []);

  return (
    <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
      {greeting}, {coachName} 👋
    </h2>
  );
}