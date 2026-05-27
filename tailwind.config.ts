import type { Config } from "tailwindcss";

/**
 * Most styling lives in app/globals.css as raw CSS that mirrors cursor.com
 * `.type-*`, `.section`, `.container-site` patterns. Tailwind here is for
 * layout utilities (grid/flex/spacing) and the color palette so we can
 * write `text-fg`, `bg-card`, `border-border-02` etc.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        card: "var(--color-card)",
        "card-2": "var(--color-card-2)",
        "card-3": "var(--color-card-3)",
        "card-4": "var(--color-card-4)",
        "fg-01": "var(--color-fg-01)",
        "fg-05": "var(--color-fg-05)",
        "fg-10": "var(--color-fg-10)",
        "fg-20": "var(--color-fg-20)",
        "fg-40": "var(--color-fg-40)",
        "fg-60": "var(--color-fg-60)",
        "fg-80": "var(--color-fg-80)",
        "border-01": "var(--color-border-01)",
        "border-015": "var(--color-border-015)",
        "border-02": "var(--color-border-02)",
        "border-025": "var(--color-border-025)",
        "border-03": "var(--color-border-03)",
      },
      spacing: {
        v1: "calc(var(--v) * 1)",
        "v1.5": "calc(var(--v) * 1.5)",
        v2: "calc(var(--v) * 2)",
        "v2.5": "calc(var(--v) * 2.5)",
        v3: "calc(var(--v) * 3)",
        v4: "calc(var(--v) * 4)",
        "v4.5": "calc(var(--v) * 4.5)",
        v5: "calc(var(--v) * 5)",
        v6: "calc(var(--v) * 6)",
        v8: "calc(var(--v) * 8)",
        v10: "calc(var(--v) * 10)",
      },
      maxWidth: {
        "site-7xl": "80rem",
        "site-5xl": "64rem",
        "site-4xl": "56rem",
        "site-3xl": "48rem",
      },
      borderRadius: {
        "2xs": "2px",
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
