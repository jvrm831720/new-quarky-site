"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Three pillar cards, each with a distinct continuous animation.
 *
 *   01 / Infraestrutura → Wide blocks fall, pause, rotate on Y, dock, flash,
 *                         then build a stack in a continuous loop.
 *   02 / Dados          → Rain falling onto a wavy water surface. Some
 *                         drops transform into clinical/data words mid-fall
 *                         before being absorbed; ripples on impact.
 *   03 / Inteligência   → Neural network with input/hidden/output layers.
 *                         Activation pulses propagate L→R while the network
 *                         itself GROWS over time — new nodes appear,
 *                         then it resets and grows again.
 */

const FIG_W = 200;
const FIG_H = 160;

export function QuarkyHoldingVisual() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
      <PillarCard
        n="01"
        fig="01.A"
        title="Infraestrutura"
        body="Substituímos sistemas legados que dominam o mercado há décadas. Não como melhoria. Como substituição."
      >
        <InfraTower />
      </PillarCard>

      <PillarCard
        n="02"
        fig="02.A"
        title="Dados"
        body="Cada produto que lançamos é uma nova fonte de dados clínicos estruturados, proprietários, impossíveis de replicar."
      >
        <DataOcean />
      </PillarCard>

      <PillarCard
        n="03"
        fig="03.A"
        title="Inteligência"
        body="O dataset se torna o moat. A inteligência emerge do dado. E essa inteligência pertence à Quarky — e aos seus parceiros."
      >
        <NeuralExpand />
      </PillarCard>
    </div>
  );
}

function PillarCard({
  n,
  fig,
  title,
  body,
  children,
}: {
  n: string;
  fig: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-xl bg-card border border-border-02 overflow-hidden flex flex-col transform-gpu shadow-none transition-[transform,box-shadow,border-color] duration-500 ease-out-soft md:hover:scale-[1.015] md:hover:-translate-y-[3px] md:hover:border-border-025 md:hover:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)] md:focus-within:scale-[1.015] md:focus-within:-translate-y-[3px] md:focus-within:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)]">
      <div className="px-5 py-4 border-b border-border-02 flex items-baseline gap-2.5">
        <span className="num-cap">{n}</span>
        <span className="text-fg-40" aria-hidden="true">/</span>
        <span
          className="text-fg uppercase"
          style={{
            fontFamily: "berkeleyMono, ui-monospace, monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </span>
      </div>

      <div className="bg-bg relative" style={{ aspectRatio: "5 / 4" }}>
        <span
          className="absolute top-3 left-4 text-fg-40 z-10"
          style={{
            fontFamily: "berkeleyMono, ui-monospace, monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.12em",
          }}
        >
          FIG · {fig}
        </span>
        <div className="absolute inset-0">{children}</div>
      </div>

      <div className="px-5 py-5 type-md-sm text-fg-60 leading-snug-plus border-t border-border-02 flex-1">
        {body}
      </div>
    </article>
  );
}

/* ─── shared util ───────────────────────────────────────────── */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useFgColor() {
  const ref = useRef<{ r: number; g: number; b: number }>({
    r: 38,
    g: 37,
    b: 30,
  });
  useEffect(() => {
    const read = () => {
      const fg =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-fg")
          .trim() || "#26251e";
      const h = fg.replace("#", "");
      const v =
        h.length === 3
          ? h
              .split("")
              .map((c) => c + c)
              .join("")
          : h;
      const n = parseInt(v, 16);
      ref.current = {
        r: (n >> 16) & 0xff,
        g: (n >> 8) & 0xff,
        b: n & 0xff,
      };
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ═════════════════════════════════════════════════════════════
   01 · INFRAESTRUTURA — Falling-blocks tower
   ═════════════════════════════════════════════════════════════ */

const INFRA_STACK_SIZE = 6;
const INFRA_STACK_GAP = 15;
const INFRA_LAND_MS = 2100;
const INFRA_NEXT_DELAY_MS = 260;
const INFRA_RESET_MS = 900;

type InfraActiveBlock = {
  level: number;
  token: number;
};

function InfraTower() {
  const reduce = useReducedMotion();
  const [landed, setLanded] = useState<number[]>([]);
  const [active, setActive] = useState<InfraActiveBlock | null>(null);

  useEffect(() => {
    const fullStack = Array.from({ length: INFRA_STACK_SIZE }, (_, i) => i);

    if (reduce) {
      setActive(null);
      setLanded(fullStack);
      return;
    }

    let disposed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, delay: number) => {
      const timer = setTimeout(() => {
        if (!disposed) fn();
      }, delay);
      timers.push(timer);
    };

    const startBlock = (level: number) => {
      if (level === 0) setLanded([]);
      setActive({ level, token: Date.now() + level });

      schedule(() => {
        setLanded((prev) => [...prev, level]);
        setActive(null);

        const nextLevel = level + 1;
        if (nextLevel >= INFRA_STACK_SIZE) {
          schedule(() => startBlock(0), INFRA_RESET_MS);
          return;
        }

        schedule(() => startBlock(nextLevel), INFRA_NEXT_DELAY_MS);
      }, INFRA_LAND_MS);
    };

    startBlock(0);

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div className="infra-stage" aria-hidden="true">
      <div className="infra-guide infra-guide--vertical" />
      <div className="infra-guide infra-guide--base" />
      <div className="infra-shadow" />

      {landed.map((level) => (
        <InfraPlate key={`landed-${level}`} level={level} />
      ))}

      {active ? (
        <InfraPlate
          key={`active-${active.token}`}
          level={active.level}
          active
        />
      ) : null}
    </div>
  );
}

function InfraPlate({
  level,
  active = false,
}: {
  level: number;
  active?: boolean;
}) {
  const turnsRight = level % 2 === 0;
  const style = {
    "--stack-y": `${level * -INFRA_STACK_GAP}px`,
    "--spin-end": turnsRight ? "360deg" : "-360deg",
    zIndex: level + (active ? 20 : 1),
  } as React.CSSProperties;

  return (
    <div
      className={`infra-plate-wrap${active ? " infra-plate-wrap--fall" : ""}`}
      style={style}
    >
      <div className="infra-plate">
        <span className="infra-plate-mark" />
        <span className="infra-plate-line infra-plate-line--a" />
        <span className="infra-plate-line infra-plate-line--b" />
        <span className="infra-plate-line infra-plate-line--c" />
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   02 · DADOS — Rain with technical-word particles + waved water
   ═════════════════════════════════════════════════════════════ */

const DATA_WORDS = [
  "HEMOGRAMA",
  "HBA1C",
  "CREATININA",
  "ECG",
  "T4_LIVRE",
  "LEUCÓCITOS",
  "BIÓPSIA",
  "PCR",
  "TROPONINA",
  "D-DIMER",
  "BILIRRUBINA",
  "TGO",
  "INR",
  "ALBUMINA",
  "CK-MB",
  "URINÁLISE",
  "HEMATÓCRITO",
  "TIROXINA",
  "LIPIDOGRAMA",
  "COHORT_42",
  "PRONTUÁRIO",
  "DIAGNÓSTICO",
  "EXAME_LAB",
  "BIOMARKER",
];

type Drop = {
  x: number;
  y: number;
  vy: number;
  alpha: number;
  size: number;
  word: string | null;
};

const DROP_COUNT = 50;
const WATER_BASE = 0.78;

function pickWord(rng: () => number): string {
  return DATA_WORDS[Math.floor(rng() * DATA_WORDS.length)];
}

function newDrop(rng: () => number): Drop {
  return {
    x: rng(),
    y: -rng() * 0.6 - 0.05,
    vy: 0.16 + rng() * 0.4,
    alpha: 0.4 + rng() * 0.5,
    size: 0.8 + rng() * 1.2,
    word: rng() > 0.78 ? pickWord(rng) : null,
  };
}

function DataOcean() {
  const reduce = useReducedMotion();
  const fg = useFgColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let widthCss = 0;
    let heightCss = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      widthCss = rect.width;
      heightCss = rect.height;
      canvas.width = Math.round(widthCss * dpr);
      canvas.height = Math.round(heightCss * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const baseRng = mulberry32(2024);
    const drops: Drop[] = Array.from({ length: DROP_COUNT }).map(() =>
      newDrop(baseRng),
    );
    const ripples: Array<{ x: number; t: number; max: number }> = [];

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "150px" },
    );
    io.observe(canvas);

    let raf = 0;
    let prev = performance.now();
    let waveT = 0;

    const tick = (now: number) => {
      const dt = Math.min(50, now - prev) / 1000;
      prev = now;
      if (visible) {
        waveT += dt;
        draw(dt);
      }
      raf = requestAnimationFrame(tick);
    };

    const waterY = (xNorm: number, h: number): number => {
      const baseY = h * WATER_BASE;
      const wave1 = Math.sin(xNorm * 6 + waveT * 0.9) * h * 0.012;
      const wave2 = Math.sin(xNorm * 11 - waveT * 0.55) * h * 0.006;
      return baseY + wave1 + wave2;
    };

    const draw = (dt: number) => {
      const w = widthCss;
      const h = heightCss;
      const { r, g, b } = fg.current;
      ctx.clearRect(0, 0, w, h);

      // 1) Drops
      ctx.font =
        "10px berkeleyMono, ui-monospace, SFMono-Regular, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y += d.vy * dt;
        const screenY = d.y * h;
        const wy = waterY(d.x, h);

        if (screenY >= wy) {
          ripples.push({
            x: d.x,
            t: 0,
            max: 0.04 + Math.random() * 0.07,
          });
          // recycle
          d.x = Math.random();
          d.y = -0.05 - Math.random() * 0.5;
          d.vy = 0.16 + Math.random() * 0.4;
          d.alpha = 0.4 + Math.random() * 0.5;
          d.size = 0.8 + Math.random() * 1.2;
          d.word = Math.random() > 0.78 ? pickWord(Math.random) : null;
          continue;
        }

        if (d.word && d.y > 0.18 && d.y < 0.62) {
          // Word zone: fade in/out
          const t = (d.y - 0.18) / (0.62 - 0.18);
          const wAlpha =
            t < 0.25
              ? t / 0.25
              : t > 0.75
              ? (1 - t) / 0.25
              : 1;
          const fa = wAlpha * d.alpha * 0.95;
          ctx.fillStyle = `rgba(${r},${g},${b},${fa.toFixed(3)})`;
          ctx.fillText(d.word, d.x * w, screenY);
        } else {
          // Trail + dot
          const trailLen = 8 + d.vy * 12;
          const grad = ctx.createLinearGradient(
            d.x * w,
            screenY - trailLen,
            d.x * w,
            screenY,
          );
          grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
          grad.addColorStop(
            1,
            `rgba(${r},${g},${b},${(d.alpha * 0.5).toFixed(3)})`,
          );
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(d.x * w, screenY - trailLen);
          ctx.lineTo(d.x * w, screenY);
          ctx.stroke();

          ctx.fillStyle = `rgba(${r},${g},${b},${d.alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(d.x * w, screenY, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2) Water — sine wave surface
      const samples = 64;
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const xn = i / samples;
        const x = xn * w;
        const y = waterY(xn, h);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
      ctx.lineWidth = 0.7;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pool fill below the wave
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const xn = i / samples;
        const x = xn * w;
        const y = waterY(xn, h);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = `rgba(${r},${g},${b},0.06)`;
      ctx.fill();

      // Subtle pool surface texture (fixed dashes to read as accumulated data)
      for (let i = 0; i < 32; i++) {
        const xn = ((i * 137) % 100) / 100;
        const sy = waterY(xn, h) + ((i * 31) % 8) + 3;
        ctx.fillStyle = `rgba(${r},${g},${b},0.16)`;
        ctx.fillRect(xn * w, sy, 4, 0.6);
      }

      // 3) Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.t += dt * 1.5;
        if (rp.t > 1) {
          ripples.splice(i, 1);
          continue;
        }
        const radius = rp.t * rp.max * w;
        const alpha = (1 - rp.t) * 0.42;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.ellipse(
          rp.x * w,
          waterY(rp.x, h),
          radius,
          radius * 0.32,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    };

    if (reduce) {
      // single static frame
      draw(0);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [fg, reduce]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

/* ═════════════════════════════════════════════════════════════
   03 · INTELIGÊNCIA — Scaling neural net + propagation pulse
   ═════════════════════════════════════════════════════════════ */

const NN_PAD_X = 26;
const NN_PAD_Y = 22;
const NN_MIN = [2, 3, 1] as const;
const NN_MAX = [4, 6, 2] as const;
const NN_GROW_MS = 1700;

function NeuralExpand() {
  const reduce = useReducedMotion();
  const [counts, setCounts] = useState<[number, number, number]>([
    NN_MIN[0],
    NN_MIN[1],
    NN_MIN[2],
  ]);

  useEffect(() => {
    if (reduce) {
      setCounts([NN_MAX[0], NN_MAX[1], NN_MAX[2]]);
      return;
    }
    const interval = setInterval(() => {
      setCounts((prev) => {
        const [a, b, c] = prev;
        const atMax = a >= NN_MAX[0] && b >= NN_MAX[1] && c >= NN_MAX[2];
        if (atMax) {
          // Reset to grow again
          return [NN_MIN[0], NN_MIN[1], NN_MIN[2]];
        }
        // Grow preferring the hidden layer, then input, then output
        if (b < NN_MAX[1]) return [a, b + 1, c];
        if (a < NN_MAX[0]) return [a + 1, b, c];
        if (c < NN_MAX[2]) return [a, b, c + 1];
        return prev;
      });
    }, NN_GROW_MS);

    return () => clearInterval(interval);
  }, [reduce]);

  const layout = useMemo(() => {
    const layerXs = counts.map((_, i) =>
      counts.length > 1
        ? NN_PAD_X + (i / (counts.length - 1)) * (FIG_W - NN_PAD_X * 2)
        : FIG_W / 2,
    );
    const nodes: Array<{ id: string; layer: number; x: number; y: number }> =
      [];
    counts.forEach((count, li) => {
      const colX = layerXs[li];
      for (let k = 0; k < count; k++) {
        const y = NN_PAD_Y + ((k + 0.5) / count) * (FIG_H - NN_PAD_Y * 2);
        nodes.push({ id: `L${li}-N${k}`, layer: li, x: colX, y });
      }
    });

    type Edge = {
      id: string;
      layer: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
    const edges: Edge[] = [];
    let acc = 0;
    for (let li = 0; li < counts.length - 1; li++) {
      const startA = acc;
      const startB = acc + counts[li];
      for (let i = 0; i < counts[li]; i++) {
        for (let j = 0; j < counts[li + 1]; j++) {
          const a = nodes[startA + i];
          const b = nodes[startB + j];
          edges.push({
            id: `E${li}-${i}-${j}`,
            layer: li,
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
          });
        }
      }
      acc += counts[li];
    }
    return { nodes, edges };
  }, [counts]);

  const totalCycle = 2.4;

  return (
    <svg
      viewBox={`0 0 ${FIG_W} ${FIG_H}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <AnimatePresence>
        {layout.edges.map((e) => {
          const layerDelay = (e.layer / 1) * (totalCycle * 0.42);
          return (
            <motion.line
              key={e.id}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className="nn-edge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.6 },
                x1: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                y1: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                x2: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                y2: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              }}
              style={{
                animationDuration: `${totalCycle}s`,
                animationDelay: `-${layerDelay}s`,
              }}
            />
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {layout.nodes.map((n) => {
          const layerDelay =
            (n.layer / Math.max(1, counts.length - 1)) * (totalCycle * 0.42);
          return (
            <motion.circle
              key={n.id}
              r={2.6}
              className="nn-node"
              initial={{ scale: 0, opacity: 0, cx: n.x, cy: n.y }}
              animate={{ scale: 1, opacity: 1, cx: n.x, cy: n.y }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.35 } }}
              transition={{
                scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.5 },
                cx: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                cy: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              }}
              style={{
                animationDuration: `${totalCycle}s`,
                animationDelay: `-${layerDelay}s`,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
