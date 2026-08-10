"use client";

import { useEffect, useState } from "react";

type Props = {
  value: number;
};

export default function AnimatedCounter({
  value,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += Math.ceil(value / 40);

      if (current >= value) {
        current = value;
        clearInterval(interval);
      }

      setCount(current);
    }, 25);

    return () => clearInterval(interval);
  }, [value]);

  return <>{count}</>;
}