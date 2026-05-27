"use client";

import { useEffect } from "react";

/**
 * One-time global IntersectionObserver that watches every element with
 * `.reveal`, `.reveal-from-right`, or `.reveal-from-left`. When the element
 * enters the viewport (≥15%), it gets the `.visible` class — the CSS in
 * globals.css then plays the transition.
 *
 * Also installs a MutationObserver so dynamically inserted elements
 * (e.g. via AnimatePresence) are picked up automatically.
 *
 * Honours `prefers-reduced-motion`: under that preference, every matching
 * element is marked visible immediately on mount (no animation needed —
 * the global reduced-motion rule already collapses transitions to 0.01ms).
 */

const SELECTOR =
  ".reveal:not(.visible), .reveal-from-right:not(.visible), .reveal-from-left:not(.visible)";

export function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      document
        .querySelectorAll<HTMLElement>(SELECTOR)
        .forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    const observe = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>(SELECTOR)
        .forEach((el) => io.observe(el));
    };

    observe(document);

    // Watch for dynamically added reveal targets (AnimatePresence, etc.)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          const el = node as Element;
          // The added element itself
          if (el.matches?.(SELECTOR)) io.observe(el);
          // Or any descendants
          observe(el);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
