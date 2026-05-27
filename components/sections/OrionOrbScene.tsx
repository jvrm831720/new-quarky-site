"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MoleculeOrb } from "./MoleculeOrb";

/**
 * OrionOrbScene
 * - Orb wave-driven original
 * - Label "ORION INTELLIGENCE" + contador "DATASET · N EVENTOS" abaixo
 */

export function OrionOrbScene() {
  const reduce = useReducedMotion();
  const [counter, setCounter] = useState(2_847_193);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setCounter((p) => p + Math.floor(Math.random() * 5) + 2);
    }, 110);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="w-full">
      <div
        className="relative w-full mx-auto max-w-[460px] lg:max-w-none"
        style={{ aspectRatio: "1 / 1" }}
      >
        <MoleculeOrb />
      </div>

      <div className="mt-v2 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2.5">
          <motion.span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-fg"
            animate={
              reduce
                ? undefined
                : { opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="uppercase text-fg"
            style={{
              fontFamily: "berkeleyMono, ui-monospace, monospace",
              fontSize: "0.74rem",
              letterSpacing: "0.32em",
            }}
          >
            Orion Intelligence
          </span>
        </div>
        <span
          aria-hidden="true"
          className="text-fg-40 tabular-nums"
          style={{
            fontFamily: "berkeleyMono, ui-monospace, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
          }}
        >
          DATASET · {counter.toLocaleString("pt-BR")} EVENTOS
        </span>
      </div>
    </div>
  );
}
