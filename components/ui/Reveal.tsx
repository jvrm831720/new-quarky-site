"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Tag =
  | "div"
  | "section"
  | "article"
  | "header"
  | "li"
  | "h1"
  | "h2"
  | "p"
  | "span";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: Tag;
};

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  as = "div",
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as React.ComponentType<HTMLMotionProps<typeof as>>;

  if (reduce) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
