import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-md transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 type-sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg px-[1.05em] py-[0.66em] hover:bg-[color:rgba(38,37,30,0.86)]",
  secondary:
    "border border-border-025 text-fg px-[1.05em] py-[0.66em] hover:border-fg hover:bg-card",
  ghost:
    "text-fg px-[0.45em] py-[0.3em] hover:text-fg-60",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
