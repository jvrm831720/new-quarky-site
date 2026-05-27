"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "#missao", label: "Missão" },
  { href: "#atlas", label: "Atlas" },
  { href: "#visao", label: "Visão" },
];

const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/quarkyco/",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
  },
  {
    href: "https://www.instagram.com/quarky.cc",
    label: "Instagram",
    icon: <InstagramIcon />,
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Fecha menu com Escape e trava scroll do body quando aberto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-border-02 bg-bg"
        style={{ height: "var(--site-header-height)" }}
      >
        <div className="container-site flex h-full items-center justify-between">
          <Link
            href="#top"
            aria-label="Quarky — ir para o início"
            className="block"
            onClick={closeMenu}
          >
            <Image
              src="/logos/quarky.svg"
              alt="Quarky"
              width={457}
              height={99}
              priority
              className="h-[18px] w-auto logo-invert"
            />
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="type-sm text-fg-60 hover:text-fg transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Link
              href="#contato"
              className="hidden md:inline-flex items-center gap-1.5 type-sm text-fg hover:text-fg-60 transition-colors duration-150"
            >
              Entre em contato
              <span aria-hidden="true">→</span>
            </Link>
            <HamburgerButton open={open} onClick={() => setOpen((p) => !p)} />
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 md:hidden"
            aria-modal="true"
            role="dialog"
            aria-label="Menu de navegação"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg"
              onClick={closeMenu}
            />

            {/* Content */}
            <div
              className="relative h-full flex flex-col"
              style={{ paddingTop: "var(--site-header-height)" }}
            >
              <nav
                aria-label="Mobile"
                className="container-site flex-1 flex flex-col justify-center py-v3"
              >
                <ul className="flex flex-col gap-v2">
                  {NAV.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, x: -16 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, x: -16 }
                      }
                      transition={{
                        duration: 0.3,
                        delay: 0.05 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block text-fg hover:text-fg-60 transition-colors duration-150"
                        style={{
                          fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
                          letterSpacing: "-0.025em",
                          lineHeight: 1.1,
                        }}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA contato + socials */}
                <motion.div
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05 + NAV.length * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-v4 pt-v3 border-t border-border-02"
                >
                  <Link
                    href="#contato"
                    onClick={closeMenu}
                    className="inline-flex items-center gap-2 type-md text-fg hover:text-fg-60 transition-colors duration-150"
                  >
                    Entre em contato
                    <span aria-hidden="true">→</span>
                  </Link>
                  <div className="mt-v2 mono-cap text-fg-40">
                    hello@quarky.cc
                  </div>

                  {/* Redes sociais */}
                  <ul className="mt-v3 flex items-center gap-2">
                    {SOCIALS.map((s) => (
                      <li key={s.href}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          title={s.label}
                          onClick={closeMenu}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border-02 text-fg-60 hover:text-fg hover:border-border-025 transition-colors duration-200"
                        >
                          {s.icon}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 6.5h2.4v8.4H4V6.5Zm1.2-3.7a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM8 6.5h2.3v1.15h.03c.32-.6 1.1-1.23 2.27-1.23 2.43 0 2.88 1.6 2.88 3.68v4.8h-2.4v-4.25c0-1.02-.02-2.33-1.42-2.33-1.42 0-1.64 1.1-1.64 2.25v4.33H8V6.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="3.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.4" cy="4.6" r="0.7" fill="currentColor" />
    </svg>
  );
}

function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="md:hidden relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-02 bg-card text-fg hover:border-border-025 transition-colors duration-200"
    >
      <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
      <span
        aria-hidden="true"
        className="relative block h-[10px] w-4"
      >
        <motion.span
          className="absolute left-0 right-0 h-[1.5px] bg-current rounded-full"
          animate={
            open
              ? { top: "4px", rotate: 45 }
              : { top: 0, rotate: 0 }
          }
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute left-0 right-0 h-[1.5px] bg-current rounded-full"
          animate={
            open
              ? { top: "4px", rotate: -45 }
              : { top: "8px", rotate: 0 }
          }
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
    </button>
  );
}
