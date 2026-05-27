"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Props = {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
};

const formatter = new Intl.NumberFormat("pt-BR");

export function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 1500,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>();
  const started = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setValue(Math.round(end * eased));

          if (progress < 1) {
            frame.current = requestAnimationFrame(tick);
          }
        };

        frame.current = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [duration, end]);

  return (
    <div ref={ref} className={className} style={style}>
      {prefix}
      {formatter.format(value)}
      {suffix}
    </div>
  );
}
