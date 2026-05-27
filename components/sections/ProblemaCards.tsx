"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

/* ──────────────────────────────────────────────────────────────────────
   PROBLEMA · bento de 6 cards
   Cada card ilustra uma faceta do problema "saúde sem memória".
   Animações ambientes (sempre suaves) que ganham intensidade no hover
   ou quando o card entra no viewport em touch.
   ────────────────────────────────────────────────────────────────────── */

export function ProblemaCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-5">
      <ProblemCard
        index={1}
        colSpan="md:col-span-2"
        eyebrow="Volume"
        title="2.8 bilhões de eventos. Zero em rede."
        desc="O Brasil gera bilhões de exames, laudos e consultas por ano. Quase nenhum vira inteligência clínica."
        mockup={(s) => <MockCounter state={s} />}
      />
      <ProblemCard
        index={2}
        colSpan="md:col-span-3"
        eyebrow="Silos"
        title="Sistemas que não conversam."
        desc="Lab, clínica e hospital operam em camadas isoladas. Cada evento clínico fica preso onde nasceu."
        mockup={(s) => <MockSilos state={s} />}
      />
      <ProblemCard
        index={3}
        colSpan="md:col-span-2"
        eyebrow="Legado"
        title="Software clínico da década de 2000."
        desc="Sistemas que pararam no tempo. Sem AI, sem integração, sem captura estruturada."
        mockup={(s) => <MockLegacy state={s} />}
      />
      <ProblemCard
        index={4}
        colSpan="md:col-span-2"
        eyebrow="Formato"
        title="Dados presos em PDF."
        desc="Resultados, laudos e prontuários viram imagem. Ilegíveis para máquina, inúteis para análise."
        mockup={(s) => <MockPDF state={s} />}
      />
      <ProblemCard
        index={5}
        colSpan="md:col-span-3"
        eyebrow="Memória"
        title="Cada paciente recomeça do zero."
        desc="Sem histórico cruzado entre serviços, o vet refaz exames, o médico investiga de novo, o tutor paga duas vezes."
        mockup={(s) => <MockMemory state={s} />}
      />
      <ProblemCard
        index={6}
        colSpan="md:col-span-2"
        eyebrow="Padrões"
        title="Sinais que ninguém cruza."
        desc="Sem rede que aprenda, padrões clínicos viram ruído. Caso por caso, paciente por paciente, os sinais se perdem."
        mockup={(s) => <MockPatterns state={s} />}
      />
    </div>
  );
}

/* ─── Card primitive ──────────────────────────────────────────────── */

type CardState = "idle" | "active";

function ProblemCard({
  index,
  eyebrow,
  title,
  desc,
  mockup,
  colSpan,
}: {
  index: number;
  eyebrow: string;
  title: string;
  desc: string;
  mockup: (state: CardState) => ReactNode;
  colSpan: string;
}) {
  const { ref, active, bind } = useCardActive();
  const state: CardState = active ? "active" : "idle";

  return (
    <Reveal delay={0.04 + index * 0.05} className={colSpan}>
      <div
        ref={ref}
        {...bind}
        className={[
          "group relative h-full min-h-[24rem] md:min-h-[26rem] rounded-xl border bg-card overflow-hidden isolate",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out-soft",
          "transform-gpu shadow-none md:hover:scale-[1.015] md:hover:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)] md:focus-within:scale-[1.015] md:focus-within:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)]",
          active
            ? "border-border-025 md:-translate-y-[3px]"
            : "border-border-02",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 z-20 rounded-xl transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{ boxShadow: "inset 0 0 0 1px rgba(38,37,30,0.10)" }}
        />

        <div className="absolute inset-0 flex flex-col">
          <div className="relative overflow-hidden flex-1">
            {mockup(state)}
          </div>

          <div className="relative shrink-0 px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5 border-t border-border-01">
            <div className="flex items-baseline gap-3">
              <span className="mono-cap text-fg-40">{eyebrow}</span>
            </div>
            <h3 className="mt-1 type-md-sm md:type-md text-fg balance">{title}</h3>
            <p className="mt-2 type-sm text-fg-60 max-w-[44ch] leading-snug-plus">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Active-state hook (hover desktop, IO touch) ─────────────────── */

function useCardActive() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const isHoverDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isHoverDevice) return;

    const io = new IntersectionObserver(
      ([entry]) =>
        setActive(entry.isIntersecting && entry.intersectionRatio >= 0.55),
      { threshold: [0, 0.3, 0.55, 0.8, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const bind = {
    onMouseEnter: () => setActive(true),
    onMouseLeave: () => setActive(false),
    onFocus: () => setActive(true),
    onBlur: () => setActive(false),
  };

  return { ref, active, bind };
}

/* ─── Shared primitives ──────────────────────────────────────────── */

function Particles({ count }: { count: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      x: 8 + ((i * 37) % 85),
      y: 12 + ((i * 53) % 78),
      delay: (i * 0.7) % 3,
      duration: 4 + ((i * 0.9) % 4),
      size: i % 3 === 0 ? 1.5 : 1,
    })),
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            height: `${p.size}px`,
            width: `${p.size}px`,
            background: "var(--color-fg-20)",
          }}
          animate={{ opacity: [0, 0.55, 0], y: [0, -28, -52] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function XMark({ subtle = false }: { subtle?: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center h-3 w-3 rounded-full border shrink-0",
        subtle ? "border-fg-40" : "border-fg-60",
      ].join(" ")}
    >
      <svg width="6" height="6" viewBox="0 0 8 8" aria-hidden="true">
        <path
          d="M2 2l4 4M6 2l-4 4"
          stroke={subtle ? "var(--color-fg-40)" : "var(--color-fg-60)"}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block w-[2px] h-[0.85em] bg-fg align-middle ml-[1px]"
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const BERKELEY = "berkeleyMono, ui-monospace, SFMono-Regular, Menlo, monospace";

/* ─── Mockup 1 · Counter (volume vs zero) ─────────────────────────── */

function MockCounter({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [n, setN] = useState(2_847_193_456);

  useEffect(() => {
    if (reduce) return;
    const step = active ? 70 : 240;
    const add = () =>
      active
        ? Math.floor(Math.random() * 14) + 8
        : Math.floor(Math.random() * 4) + 1;
    const id = setInterval(() => setN((p) => p + add()), step);
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-5 md:p-6 flex flex-col justify-center gap-5 overflow-hidden">
      <Particles count={5} />

      <div className="relative z-10 space-y-1">
        <div className="mono-cap text-fg-40 text-[0.6rem]">
          eventos clínicos · ao ano
        </div>
        <div
          className="text-fg tabular-nums"
          style={{
            fontFamily: BERKELEY,
            fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {n.toLocaleString("pt-BR")}
          <motion.span
            aria-hidden="true"
            className="inline-block w-1 h-3 bg-fg align-middle ml-1"
            animate={!reduce ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="relative z-10 h-px bg-border-02" />

      <div className="relative z-10 space-y-1.5">
        <div className="mono-cap text-fg-40 text-[0.6rem]">
          estruturados em rede unificada
        </div>
        <div className="flex items-baseline gap-3">
          <span
            className="text-fg tabular-nums"
            style={{
              fontFamily: BERKELEY,
              fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
              lineHeight: 1.1,
            }}
          >
            0
          </span>
          <motion.span
            animate={!reduce ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.7 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1 mono-cap text-fg-40 text-[0.58rem]"
          >
            <XMark subtle />
            <span>sem captura</span>
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ─── Mockup 2 · Silos (3 columns, broken connections) ────────────── */

const SILOS = [
  { id: "lab", label: "LAB", types: ["HGR", "BIO", "URN", "T4", "COR"] },
  { id: "cli", label: "CLÍNICA", types: ["CONS", "RTN", "VAC", "REC", "AVL"] },
  { id: "hos", label: "HOSPITAL", types: ["ECG", "RX", "TAC", "RNM", "CIR"] },
];

function MockSilos({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [streams, setStreams] = useState<string[][]>(() =>
    SILOS.map((s) => s.types.slice(0, 3)),
  );

  useEffect(() => {
    if (reduce) return;
    const interval = active ? 850 : 2200;
    const ids = SILOS.map((s, i) =>
      setInterval(
        () => {
          setStreams((curr) => {
            const next = curr.slice();
            const newType =
              s.types[Math.floor(Math.random() * s.types.length)];
            next[i] = [newType, ...curr[i]].slice(0, 4);
            return next;
          });
        },
        interval + i * 350,
      ),
    );
    return () => ids.forEach(clearInterval);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-5 md:p-6 flex flex-col overflow-hidden">
      <Particles count={6} />

      <div className="relative z-10 flex items-center justify-between mb-3 pb-2.5 border-b border-border-02">
        <span className="mono-cap text-fg-40 text-[0.6rem]">
          integração entre sistemas
        </span>
        <span className="flex items-center gap-1.5">
          <XMark />
          <span
            className="text-fg uppercase"
            style={{
              fontFamily: BERKELEY,
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
            }}
          >
            não conectada
          </span>
        </span>
      </div>

      <div className="relative flex-1 grid grid-cols-3 gap-3 z-10">
        {SILOS.map((silo, i) => (
          <div
            key={silo.id}
            className={[
              "relative px-2 py-1 flex flex-col",
              i > 0
                ? "border-l border-dashed border-border-025 pl-3"
                : "",
            ].join(" ")}
          >
            {i > 0 && (
              <div className="absolute -left-[7px] top-1/2 -translate-y-1/2 z-20 bg-card-2 p-0.5">
                <XMark />
              </div>
            )}

            <div className="flex items-center justify-between mb-2.5">
              <span
                className="text-fg"
                style={{
                  fontFamily: BERKELEY,
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                }}
              >
                {silo.label}
              </span>
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-fg"
                animate={
                  !reduce
                    ? { opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }
                    : { opacity: 1 }
                }
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            </div>

            <ul className="flex flex-col gap-1 flex-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {streams[i].map((type, idx) => (
                  <motion.li
                    key={`${silo.id}-${idx}-${type}-${streams[i].length}`}
                    layout
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: -6, scale: 0.96 }
                    }
                    animate={
                      reduce
                        ? { opacity: 1 - idx * 0.18 }
                        : { opacity: 1 - idx * 0.18, y: 0, scale: 1 }
                    }
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: 6, scale: 0.96 }
                    }
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <span
                      className="h-1 w-1 rounded-full bg-fg shrink-0"
                      style={{ opacity: idx === 0 ? 1 : 0.55 }}
                    />
                    <span
                      className="text-fg"
                      style={{
                        fontFamily: BERKELEY,
                        fontSize: "0.66rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {type}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="border-t border-border-02 pt-1.5 mt-2 mono-cap text-fg-40 text-[0.55rem]">
              local · sem saída
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mockup 3 · Legacy (Win95-style window) ──────────────────────── */

function MockLegacy({ state }: { state: CardState }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex items-center justify-center overflow-hidden">
      <Particles count={3} />

      <div
        className="relative w-full max-w-[260px] bg-bg border-2 border-border-025"
        style={{ boxShadow: "3px 3px 0 var(--color-fg-15)" }}
      >
        <div
          className="flex items-center justify-between px-2 py-1 bg-fg text-bg"
          style={{ fontFamily: BERKELEY, fontSize: "0.65rem" }}
        >
          <span>LABSYS 2000 - v2.4</span>
          <div className="flex gap-0.5">
            <span className="px-1 bg-bg text-fg text-[0.55rem] border border-fg">_</span>
            <span className="px-1 bg-bg text-fg text-[0.55rem] border border-fg">□</span>
            <span className="px-1 bg-bg text-fg text-[0.55rem] border border-fg">×</span>
          </div>
        </div>

        <div
          className="flex gap-2 px-2 py-0.5 border-b border-border-025 text-fg-60"
          style={{ fontFamily: BERKELEY, fontSize: "0.6rem" }}
        >
          <span>
            <u>A</u>rquivo
          </span>
          <span>
            <u>E</u>ditar
          </span>
          <span>
            <u>S</u>istema
          </span>
          <span>
            <u>?</u>
          </span>
        </div>

        <div className="p-3 space-y-1.5">
          <div
            className="flex items-center gap-2 text-fg"
            style={{ fontFamily: BERKELEY, fontSize: "0.62rem" }}
          >
            <span className="w-12">ID:</span>
            <span className="flex-1 bg-card border border-border-025 px-1 py-0.5">
              3422
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-fg"
            style={{ fontFamily: BERKELEY, fontSize: "0.62rem" }}
          >
            <span className="w-12">Paciente:</span>
            <span className="flex-1 bg-card border border-border-025 px-1 py-0.5">
              Thor R.
              {!reduce && <BlinkingCursor />}
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-fg"
            style={{ fontFamily: BERKELEY, fontSize: "0.62rem" }}
          >
            <span className="w-12">Exame:</span>
            <span className="flex-1 bg-card border border-border-025 px-1 py-0.5">
              Hemograma ▼
            </span>
          </div>
          <div className="flex gap-1 pt-1.5">
            <span
              className="bg-card border border-border-025 px-2 py-0.5 text-fg"
              style={{ fontFamily: BERKELEY, fontSize: "0.6rem" }}
            >
              Salvar
            </span>
            <span
              className="bg-card border border-border-025 px-2 py-0.5 text-fg"
              style={{ fontFamily: BERKELEY, fontSize: "0.6rem" }}
            >
              Imprimir
            </span>
          </div>
        </div>

        <div
          className="px-2 py-0.5 border-t border-border-025 flex items-center justify-between text-fg-40"
          style={{ fontFamily: BERKELEY, fontSize: "0.55rem" }}
        >
          <span>pronto</span>
          <span>build 2003.04.12</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Mockup 4 · PDF (extraction attempts fail) ───────────────────── */

const PDF_LINES = [
  { width: "82%", field: "Paciente" },
  { width: "62%", field: "Data" },
  { width: "100%", field: "WBC" },
  { width: "74%", field: "RBC" },
  { width: "56%", field: "Ureia" },
];

function MockPDF({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [attemptIdx, setAttemptIdx] = useState(0);
  const [attempts, setAttempts] = useState(247);

  useEffect(() => {
    if (reduce) return;
    const stepMs = active ? 750 : 1700;
    const id = setInterval(() => {
      setAttemptIdx((p) => (p + 1) % PDF_LINES.length);
      setAttempts((p) => p + 1);
    }, stepMs);
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-5 flex flex-col items-center justify-center gap-3 overflow-hidden">
      <Particles count={4} />

      <motion.div
        animate={
          active && !reduce ? { rotate: -2, y: -3 } : { rotate: -1.5, y: 0 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "relative w-[210px] bg-bg border border-border-025 overflow-hidden",
          "transition-shadow duration-500",
          active
            ? "shadow-[0_32px_56px_-20px_rgba(38,37,30,0.32)]"
            : "shadow-[0_20px_40px_-16px_rgba(38,37,30,0.2)]",
        ].join(" ")}
      >
        <div
          className="px-2.5 py-1.5 border-b border-border-02 flex items-center justify-between"
          style={{ fontFamily: BERKELEY, fontSize: "0.55rem" }}
        >
          <span className="text-fg-60">EXAM_2847.PDF</span>
          <span className="text-fg-40">24MB</span>
        </div>

        <div className="p-3">
          <div className="text-[0.6rem] text-fg-80 font-medium mb-2.5">
            Resultado de Exame
          </div>
          <ul className="space-y-2.5">
            {PDF_LINES.map((l, i) => {
              const isActive = i === attemptIdx && !reduce;
              return (
                <li key={i} className="relative flex items-center h-2.5">
                  <div
                    className="h-1 bg-fg-15 rounded-sm"
                    style={{ width: l.width }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="pdf-extraction-highlight"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-[-3px] top-1/2 -translate-y-1/2 rounded-[3px] pointer-events-none"
                      style={{
                        width: `calc(${l.width} + 6px)`,
                        height: "14px",
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-[3px] border border-fg"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-[3px]"
                        animate={{ opacity: [0.05, 0.18, 0.05] }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{ background: "var(--color-fg)" }}
                      />
                      <motion.span
                        className="absolute -right-5 top-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                      >
                        <XMark subtle />
                      </motion.span>
                    </motion.div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      <div className="relative z-10 flex items-center gap-2 mono-cap text-fg-40 text-[0.6rem]">
        <span
          className="text-fg tabular-nums"
          style={{ fontFamily: BERKELEY }}
        >
          {attempts.toLocaleString("pt-BR")}
        </span>
        <span>tentativas</span>
        <span className="text-fg-20">·</span>
        <XMark subtle />
        <span>0 extraídos</span>
      </div>
    </div>
  );
}

/* ─── Mockup 5 · Memory (cross-reference search fails) ────────────── */

const VISITS = [
  { date: "12/03/25", label: "Consulta" },
  { date: "21/07/24", label: "Exame" },
  { date: "03/11/23", label: "Vacina" },
  { date: "08/01/23", label: "Consulta" },
];

function MockMemory({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"searching" | "failed">("failed");
  const [progress, setProgress] = useState(89);

  useEffect(() => {
    if (reduce) {
      setPhase("failed");
      setProgress(89);
      return;
    }

    let cancelled = false;
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let interval: ReturnType<typeof setInterval> | null = null;

    const cycle = () => {
      if (cancelled) return;
      setPhase("searching");
      setProgress(0);
      const stepMs = active ? 32 : 70;
      let p = 0;
      interval = setInterval(() => {
        if (cancelled) {
          if (interval) clearInterval(interval);
          return;
        }
        p += 3;
        if (p >= 89) {
          if (interval) clearInterval(interval);
          setProgress(89);
          setPhase("failed");
          timeouts.push(setTimeout(cycle, active ? 1800 : 3800));
        } else {
          setProgress(p);
        }
      }, stepMs);
    };

    timeouts.push(setTimeout(cycle, 250));

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      if (interval) clearInterval(interval);
    };
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-5 md:p-6 flex flex-col justify-center gap-4 overflow-hidden">
      <Particles count={5} />

      <div className="relative z-10">
        <div className="mono-cap text-fg-40 text-[0.6rem]">
          Thor R. · prontuário
        </div>
        <div className="mt-0.5 type-md-sm text-fg">Histórico clínico</div>
      </div>

      {/* Visit cards with broken connection X marks between them */}
      <div className="relative z-10 flex items-stretch">
        {VISITS.map((v, i) => (
          <div key={i} className="flex items-stretch flex-1">
            {i > 0 && (
              <motion.div
                className="flex items-center justify-center w-5 shrink-0"
                animate={
                  phase === "failed" && !reduce
                    ? { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }
                    : { opacity: 0.6, scale: 1 }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: "easeInOut",
                }}
              >
                <XMark subtle />
              </motion.div>
            )}
            <div className="flex-1 rounded-md border border-border-025 bg-bg p-2.5">
              <div
                className="text-fg-40 text-[0.55rem]"
                style={{ fontFamily: BERKELEY, letterSpacing: "0.04em" }}
              >
                {v.date}
              </div>
              <div className="text-[0.72rem] text-fg-80 mt-0.5">{v.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar: cycles searching → failed */}
      <div className="relative z-10 rounded-md border border-border-025 bg-bg px-3 py-2 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "searching" ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="mono-cap text-fg-60 text-[0.58rem] flex items-center gap-1.5">
                  <motion.svg
                    width="9"
                    height="9"
                    viewBox="0 0 10 10"
                    className="text-fg shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <circle
                      cx="5"
                      cy="5"
                      r="3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeDasharray="7 4"
                    />
                  </motion.svg>
                  cruzando dados entre serviços
                </span>
                <span
                  className="text-fg-40 tabular-nums text-[0.55rem]"
                  style={{ fontFamily: BERKELEY }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-[3px] bg-fg-10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-fg"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between"
            >
              <span className="mono-cap text-fg-60 text-[0.58rem] flex items-center gap-1.5">
                <XMark subtle />
                falha · 0 conexões em outros sistemas
              </span>
              <span
                className="text-fg-40 tabular-nums text-[0.55rem]"
                style={{ fontFamily: BERKELEY }}
              >
                89%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Mockup 6 · Patterns (varied cases, none investigated) ───────── */

const CASE_TYPES = [
  "Anemia leve",
  "Sopro cardíaco grau II",
  "Lesão renal incipiente",
  "Perda de peso súbita",
  "Tosse persistente",
  "Doença periodontal",
  "Cisto ovariano",
  "Hematúria oculta",
  "Apatia recorrente",
  "Leucocitose leve",
  "Disfagia esporádica",
  "Lipoma subcutâneo",
  "Pólipo intestinal",
  "Dor abdominal cíclica",
];

const INITIAL_CASES = Array.from({ length: 5 }, (_, i) => ({
  id: `#${6017 - i}`,
  type: CASE_TYPES[i],
}));

function MockPatterns({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [cases, setCases] = useState(INITIAL_CASES);
  const [totalSignals, setTotalSignals] = useState(2_847);
  const nextIdRef = useRef(6018);
  const typeIdxRef = useRef(5);

  useEffect(() => {
    if (reduce) return;
    const interval = active ? 1400 : 3500;
    const id = setInterval(() => {
      const newCase = {
        id: `#${nextIdRef.current++}`,
        type: CASE_TYPES[typeIdxRef.current % CASE_TYPES.length],
      };
      typeIdxRef.current++;
      setCases((curr) => [newCase, ...curr.slice(0, 4)]);
      setTotalSignals((p) => p + 1);
    }, interval);
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-5 md:p-6 flex flex-col justify-center gap-3 overflow-hidden">
      <Particles count={4} />

      <div className="relative z-10 mono-cap text-fg-40 text-[0.6rem] flex items-center justify-between">
        <span>casos detectados</span>
        <span className="text-fg-40">últimos 7 dias</span>
      </div>

      <ul className="relative z-10 space-y-1.5 min-h-[9rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          {cases.map((c, i) => (
            <motion.li
              key={c.id}
              layout
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: -10, scale: 0.96 }
              }
              animate={
                reduce
                  ? { opacity: 1 - i * 0.15 }
                  : { opacity: 1 - i * 0.15, x: 0, scale: 1 }
              }
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, x: 10, scale: 0.96 }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 text-[0.72rem]"
            >
              <span
                className="text-fg-40 tabular-nums shrink-0"
                style={{
                  fontFamily: BERKELEY,
                  fontSize: "0.62rem",
                  letterSpacing: "0.04em",
                }}
              >
                {c.id}
              </span>
              <span className="text-fg-80 flex-1 truncate">{c.type}</span>
              <XMark subtle />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="relative z-10 mono-cap text-fg-40 text-[0.58rem] flex items-center justify-between pt-1 border-t border-border-02">
        <span className="flex items-baseline gap-1.5">
          <span
            className="text-fg tabular-nums"
            style={{ fontFamily: BERKELEY, fontSize: "0.7rem" }}
          >
            {totalSignals.toLocaleString("pt-BR")}
          </span>
          <span>sinais</span>
        </span>
        <span className="flex items-center gap-1.5">
          <XMark subtle />
          <span>0 investigados</span>
        </span>
      </div>
    </div>
  );
}
