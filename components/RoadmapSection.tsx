"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/* ──────────────────────────────────────────────────────────────────────
   O QUE VEM DEPOIS — bento (3 produtos + 4 pilares)
   Row 1: produtos do roadmap (Atlas LIS · Atlas Clínica wide · Saúde Humana)
   Row 2: pilares da infraestrutura (Orion AI · Dataset · Integração · Plataforma)
   Cada card tem mockup animado, spotlight no hover, IntersectionObserver no mobile.
   ────────────────────────────────────────────────────────────────────── */

export function RoadmapSection() {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="section border-t border-border-02"
    >
      <div className="container-site">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-v2">
          <div className="md:col-span-3">
            <Reveal>
              <Eyebrow>O QUE VEM DEPOIS</Eyebrow>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <h2
              id="roadmap-heading"
              className="type-md-lg md:type-lg text-fg max-w-[26ch] balance"
            >
              <Reveal as="span" className="block">
                O Atlas é o primeiro passo
              </Reveal>
              <Reveal as="span" className="block" delay={0.08}>
                de um ecossistema maior.
              </Reveal>
            </h2>
            <p
              className="reveal mt-v3 max-w-[60ch] type-md-sm md:type-md text-fg-60"
              style={{ transitionDelay: "0.15s" }}
            >
              Três produtos no roadmap. Quatro pilares de infraestrutura. Uma
              única tese: capturar o dado clínico estruturado que ninguém tem.
            </p>
          </div>
        </div>

        {/* Bento */}
        <div className="mt-v5 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* Row 1 — produtos */}
          <RoadmapCard
            index={1}
            colSpan="md:col-span-3"
            minHeight="min-h-[24rem] md:min-h-[24rem]"
            badge="EM PRODUÇÃO"
            badgeKind="live"
            number="01"
            title="Atlas LIS"
            desc="LIS veterinário AI-native em uso. Captura cada laudo, cada exame, cada caso."
            mockup={(s) => <MockAtlasLIS state={s} />}
          />
          <RoadmapCard
            index={2}
            colSpan="md:col-span-6"
            minHeight="min-h-[24rem] md:min-h-[24rem]"
            badge="EM CONSTRUÇÃO"
            badgeKind="construction"
            number="02"
            title="Atlas Clínica"
            desc="Ecossistema unificado lab + clínica. Gestão completa, agendamento, financeiro — substituindo o stack legado."
            mockup={(s) => <MockAtlasClinica state={s} />}
            wide
          />
          <RoadmapCard
            index={3}
            colSpan="md:col-span-3"
            minHeight="min-h-[24rem] md:min-h-[24rem]"
            badge="DESTINO"
            badgeKind="future"
            number="03"
            title="Saúde Humana"
            desc="O mesmo playbook em um mercado 10× maior. Pavimentado pelo dataset veterinário."
            mockup={(s) => <MockSaudeHumana state={s} />}
          />

          {/* Row 2 — pilares */}
          <RoadmapCard
            index={4}
            colSpan="md:col-span-3"
            minHeight="min-h-[20rem]"
            badge="PILAR · IA"
            badgeKind="muted"
            title="Orion · IA clínica"
            desc="Sugere, resume e aprende. Treinada em dado clínico real, capturado na ponta."
            mockup={(s) => <MockOrion state={s} />}
          />
          <RoadmapCard
            index={5}
            colSpan="md:col-span-3"
            minHeight="min-h-[20rem]"
            badge="PILAR · DADO"
            badgeKind="muted"
            title="Dataset proprietário"
            desc="Cada exame, laudo e diagnóstico vira inteligência estruturada. Moat impossível de comprar."
            mockup={(s) => <MockDataset state={s} />}
          />
          <RoadmapCard
            index={6}
            colSpan="md:col-span-3"
            minHeight="min-h-[20rem]"
            badge="PILAR · REDE"
            badgeKind="muted"
            title="Lab ↔ Clínica"
            desc="Comunicação nativa entre laboratório e clínica. Zero papel, zero retrabalho."
            mockup={(s) => <MockIntegracao state={s} />}
          />
          <RoadmapCard
            index={7}
            colSpan="md:col-span-3"
            minHeight="min-h-[20rem]"
            badge="PILAR · API"
            badgeKind="muted"
            title="Plataforma aberta"
            desc="API documentada para ERPs, parceiros e o próprio ecossistema clínico."
            mockup={(s) => <MockPlataforma state={s} />}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Card primitive ──────────────────────────────────────────────────── */

type CardState = "idle" | "active";
type BadgeKind = "live" | "construction" | "future" | "muted";

function RoadmapCard({
  index,
  colSpan,
  minHeight,
  badge,
  badgeKind,
  number,
  title,
  desc,
  mockup,
  wide = false,
}: {
  index: number;
  colSpan: string;
  minHeight: string;
  badge: string;
  badgeKind: BadgeKind;
  number?: string;
  title: string;
  desc: string;
  mockup: (state: CardState) => ReactNode;
  wide?: boolean;
}) {
  const { ref, active, bind } = useCardActive();
  const state: CardState = active ? "active" : "idle";

  return (
    <Reveal delay={0.04 + index * 0.04} className={colSpan}>
      <div
        ref={ref}
        {...bind}
        className={[
          "group relative h-full rounded-xl border bg-card overflow-hidden isolate",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out-soft",
          "transform-gpu shadow-none md:hover:scale-[1.015] md:hover:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)] md:focus-within:scale-[1.015] md:focus-within:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)]",
          minHeight,
          active
            ? "border-border-025 md:-translate-y-[3px]"
            : "border-border-02",
        ].join(" ")}
      >
        {/* Inner edge */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 z-20 rounded-xl transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{ boxShadow: "inset 0 0 0 1px rgba(38,37,30,0.10)" }}
        />

        <div className="absolute inset-0 flex flex-col">
          {/* Header */}
          <div className="relative shrink-0 px-5 pt-5 md:px-6 md:pt-6 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2 min-w-0">
              <BadgeLabel kind={badgeKind} label={badge} />
              <h3 className="type-md-sm md:type-md text-fg balance">
                {title}
              </h3>
              <p className="type-sm text-fg-60 max-w-[42ch] leading-snug-plus">
                {desc}
              </p>
            </div>
            {number && (
              <span
                aria-hidden="true"
                className="tabular-nums shrink-0 select-none"
                style={{
                  fontFamily: "berkeleyMono, ui-monospace, monospace",
                  fontSize: "1.6rem",
                  letterSpacing: "-0.01em",
                  color: "var(--color-fg-15)",
                  lineHeight: 1,
                }}
              >
                {number}
              </span>
            )}
          </div>

          {/* Mockup */}
          <div className="relative flex-1 overflow-hidden mt-3">
            {mockup(state)}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function BadgeLabel({ kind, label }: { kind: BadgeKind; label: string }) {
  const dotKind = kind === "live";
  return (
    <span className="inline-flex items-center gap-1.5">
      {dotKind && <LiveDot />}
      <span
        className="uppercase"
        style={{
          fontFamily: "berkeleyMono, ui-monospace, monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color:
            kind === "future"
              ? "var(--color-fg)"
              : kind === "live"
              ? "var(--color-fg)"
              : "var(--color-fg-40)",
          fontWeight: kind === "future" ? 600 : 500,
        }}
      >
        {label}
      </span>
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ background: "var(--color-fg)", opacity: 0.4 }}
        animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      <span
        className="relative inline-flex h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--color-fg)" }}
      />
    </span>
  );
}

/* ─── Active-state hook ──────────────────────────────────────────────── */

function useCardActive() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const active = inView || hovered;

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.2, 0.35, 0.55, 0.8, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const bind = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  return { ref, active, bind };
}

/* ─── Shared primitives ──────────────────────────────────────────────── */

const BERKELEY = "berkeleyMono, ui-monospace, SFMono-Regular, Menlo, monospace";

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

/* ─── Mockup 1 · Atlas LIS (dashboard com pulse live) ─────────────────── */

const LIS_ROWS = [
  { id: "RQ-3422", patient: "Thor R.", status: "Pronto" },
  { id: "RQ-3421", patient: "Bella M.", status: "Em análise" },
  { id: "RQ-3420", patient: "Luna F.", status: "Coletado" },
];

function MockAtlasLIS({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [counter, setCounter] = useState(127);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setCounter((p) => p + (Math.random() < 0.45 ? 1 : 0));
    }, active ? 700 : 1900);
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex flex-col gap-2 overflow-hidden">
      <Particles count={3} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="mono-cap text-fg-40 text-[0.58rem]">requisições · hoje</span>
        <motion.span
          key={counter}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="text-fg tabular-nums"
          style={{ fontFamily: BERKELEY, fontSize: "0.78rem" }}
        >
          {counter}
        </motion.span>
      </div>

      <ul className="relative z-10 space-y-1.5 flex-1">
        {LIS_ROWS.map((r, i) => (
          <motion.li
            key={r.id}
            initial={false}
            animate={
              active && !reduce
                ? { opacity: 1 - i * 0.15, x: 0 }
                : { opacity: 1 - i * 0.15, x: 0 }
            }
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-2 text-[0.68rem]"
          >
            <motion.span
              className="h-1 w-1 rounded-full bg-fg shrink-0"
              animate={
                active && !reduce && i === 0
                  ? { opacity: [0.4, 1, 0.4] }
                  : { opacity: 1 }
              }
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
            />
            <span
              className="text-fg-60 shrink-0"
              style={{ fontFamily: BERKELEY }}
            >
              {r.id}
            </span>
            <span className="text-fg flex-1 truncate min-w-0">{r.patient}</span>
            <span className="mono-cap text-fg-40 text-[0.55rem] shrink-0">
              {r.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Mockup 2 · Atlas Clínica (4 quadrantes conectados) ─────────────── */

const CLINICA_QUADRANTS = [
  { label: "LAB", count: "847" },
  { label: "CLÍNICA", count: "234" },
  { label: "FINANCEIRO", count: "R$ 48K" },
  { label: "AGENDA", count: "12 HJ" },
];

function MockAtlasClinica({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % 4),
      active ? 900 : 2200,
    );
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex items-center justify-center overflow-hidden">
      <Particles count={5} />

      <div className="relative z-10 w-full max-w-[360px] grid grid-cols-2 gap-2 md:gap-2.5">
        {CLINICA_QUADRANTS.map((q, i) => (
          <motion.div
            key={q.label}
            animate={
              activeIdx === i && !reduce
                ? { borderColor: "var(--color-fg-40)", y: -2 }
                : { borderColor: "var(--color-border-025)", y: 0 }
            }
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-md border bg-bg px-3 py-2.5 flex flex-col gap-1.5 overflow-hidden"
          >
            <div
              className="flex items-center justify-between"
              style={{ fontFamily: BERKELEY, fontSize: "0.55rem" }}
            >
              <span className="text-fg-40 uppercase" style={{ letterSpacing: "0.1em" }}>
                {q.label}
              </span>
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-fg"
                animate={
                  activeIdx === i && !reduce
                    ? { opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }
                    : { opacity: 0.3, scale: 1 }
                }
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>
            <div
              className="text-fg"
              style={{ fontFamily: BERKELEY, fontSize: "0.85rem", lineHeight: 1 }}
            >
              {q.count}
            </div>

            {/* Highlight overlay quando ativo */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              animate={
                activeIdx === i && !reduce
                  ? { opacity: [0, 0.06, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 1.6 }}
              style={{ background: "var(--color-fg)" }}
            />
          </motion.div>
        ))}

        {/* Cross connector (central) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="text-fg-40"
          >
            <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.7" />
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="32"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.35"
            />
            <line
              x1="0"
              y1="16"
              x2="32"
              y2="16"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.35"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Mockup 3 · Saúde Humana (escala 10x) ───────────────────────────── */

function MockSaudeHumana({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex flex-col justify-center gap-4 overflow-hidden">
      <Particles count={3} />

      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="text-fg-40 mono-cap text-[0.58rem] w-20"
          >
            ANIMAL
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "18%" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-2 rounded-sm bg-fg-40"
          />
          <span
            className="text-fg-40 mono-cap text-[0.55rem]"
            style={{ fontFamily: BERKELEY }}
          >
            ~3.400 labs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-fg mono-cap text-[0.58rem] w-20"
          >
            HUMANO
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-2 rounded-sm bg-fg"
          />
        </div>

        <div className="flex justify-end pt-1">
          <span
            className="text-fg-40 mono-cap text-[0.55rem]"
            style={{ fontFamily: BERKELEY }}
          >
            ~34.000 labs
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-3 pt-3 border-t border-border-02">
        <span className="mono-cap text-fg-40 text-[0.58rem]">tamanho</span>
        <motion.span
          className="text-fg"
          style={{ fontFamily: BERKELEY, fontSize: "1.6rem", lineHeight: 1 }}
          animate={
            active && !reduce
              ? { scale: [1, 1.06, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          10×
        </motion.span>
      </div>
    </div>
  );
}

/* ─── Mockup 4 · Orion AI (sugestão emerge) ──────────────────────────── */

function MockOrion({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<"thinking" | "result">("result");

  useEffect(() => {
    if (reduce) return;
    setShown("thinking");
    const id = setTimeout(() => setShown("result"), active ? 900 : 1400);
    return () => clearTimeout(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex flex-col justify-center gap-2.5 overflow-hidden">
      <Particles count={4} />

      <div className="relative z-10 rounded-md border border-border-025 bg-bg p-2.5 text-[0.7rem] leading-snug text-fg-80">
        <div className="mono-cap text-[0.55rem] mb-1">Observações</div>
        <p>Apatia, leucócitos elevados.</p>
      </div>

      <div className="relative z-10 rounded-md border border-border-025 bg-card-3 p-2.5 text-[0.7rem] leading-snug text-fg-80 flex items-start gap-2 overflow-hidden min-h-[3.3rem]">
        <motion.span
          aria-hidden="true"
          className="text-fg shrink-0 leading-none mt-[2px]"
          animate={
            active && !reduce
              ? { scale: [1, 1.2, 1], rotate: [0, 14, 0] }
              : { scale: 1 }
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ✦
        </motion.span>
        <span className="relative">
          <span className="text-fg">Orion · </span>
          <AnimatePresence mode="wait">
            {shown === "thinking" ? (
              <motion.span
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex gap-0.5 align-middle"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block h-1 w-1 rounded-full bg-fg-60"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.span>
            ) : (
              <motion.span
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                Sugiro hemograma + bioquímica.
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}

/* ─── Mockup 5 · Dataset (contador subindo) ──────────────────────────── */

function MockDataset({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [counter, setCounter] = useState(2_847_193);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setCounter((p) => p + Math.floor(Math.random() * 5) + 2),
      active ? 90 : 250,
    );
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex flex-col justify-center gap-3 overflow-hidden">
      <Particles count={5} />

      <div className="relative z-10 space-y-1">
        <div className="mono-cap text-fg-40 text-[0.58rem]">
          eventos · ao ano
        </div>
        <div
          className="text-fg tabular-nums"
          style={{
            fontFamily: BERKELEY,
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {counter.toLocaleString("pt-BR")}
        </div>
      </div>

      {/* Subtle inflow bars (data streaming in) */}
      <div className="relative z-10 flex flex-col gap-1">
        {[0.4, 0.65, 0.8, 0.55].map((width, i) => (
          <motion.div
            key={i}
            className="h-[2px] bg-fg-20 rounded-full overflow-hidden"
            style={{ width: `${width * 100}%` }}
            animate={
              active && !reduce
                ? { opacity: [0.4, 1, 0.4] }
                : { opacity: 0.55 }
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mono-cap text-fg-40 text-[0.58rem] pt-1 border-t border-border-02">
        ingerindo · contínuo
      </div>
    </div>
  );
}

/* ─── Mockup 6 · Integração Lab ↔ Clínica ───────────────────────────── */

function MockIntegracao({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex items-center justify-center overflow-hidden">
      <Particles count={3} />

      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between gap-2">
          {/* Node Lab */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative h-8 w-8 rounded-md border border-border-025 bg-bg flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-fg" />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-md border border-fg"
                animate={
                  !reduce
                    ? { opacity: [0, 0.5, 0], scale: [1, 1.4, 1] }
                    : { opacity: 0 }
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span
              className="mono-cap text-fg text-[0.55rem]"
              style={{ letterSpacing: "0.1em" }}
            >
              LAB
            </span>
          </div>

          {/* Connection with traveling dot */}
          <div className="flex-1 relative h-8 flex items-center mx-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-fg-20" />
            <motion.span
              aria-hidden="true"
              className="absolute h-1.5 w-1.5 rounded-full bg-fg top-1/2 -translate-y-1/2"
              animate={
                !reduce
                  ? { left: ["0%", "100%"], opacity: [0, 1, 0] }
                  : { left: "50%" }
              }
              transition={{
                duration: active ? 1.6 : 2.6,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ boxShadow: "0 0 4px rgba(38,37,30,0.5)" }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute h-1.5 w-1.5 rounded-full bg-fg top-1/2 -translate-y-1/2"
              animate={
                !reduce
                  ? { right: ["0%", "100%"], opacity: [0, 1, 0] }
                  : { right: "50%" }
              }
              transition={{
                duration: active ? 1.6 : 2.6,
                repeat: Infinity,
                delay: 0.8,
                ease: "linear",
              }}
              style={{ boxShadow: "0 0 4px rgba(38,37,30,0.5)" }}
            />
          </div>

          {/* Node Clínica */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative h-8 w-8 rounded-md border border-border-025 bg-bg flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-fg" />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-md border border-fg"
                animate={
                  !reduce
                    ? { opacity: [0, 0.5, 0], scale: [1, 1.4, 1] }
                    : { opacity: 0 }
                }
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </div>
            <span
              className="mono-cap text-fg text-[0.55rem]"
              style={{ letterSpacing: "0.1em" }}
            >
              CLÍNICA
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[0.55rem]">
          <span className="mono-cap text-fg-40">latência</span>
          <span
            className="text-fg tabular-nums"
            style={{ fontFamily: BERKELEY }}
          >
            ~120ms
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Mockup 7 · Plataforma (API endpoint) ───────────────────────────── */

const API_LINES = [
  { method: "POST", path: "/v1/exams", status: "201" },
  { method: "GET", path: "/v1/patients/8423", status: "200" },
  { method: "POST", path: "/v1/laudos", status: "201" },
];

function MockPlataforma({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setActiveIdx((p) => (p + 1) % API_LINES.length),
      active ? 1100 : 2400,
    );
    return () => clearInterval(id);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-4 md:p-5 flex flex-col justify-center gap-2 overflow-hidden">
      <Particles count={3} />

      <ul className="relative z-10 space-y-1.5">
        {API_LINES.map((line, i) => {
          const isActive = i === activeIdx;
          return (
            <motion.li
              key={i}
              animate={
                isActive && !reduce
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0.45, x: 0 }
              }
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 rounded-md border border-border-025 bg-bg px-2.5 py-1.5 text-[0.62rem] overflow-hidden relative"
              style={{ fontFamily: BERKELEY }}
            >
              {isActive && !reduce && (
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-0 w-1/3 pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{ duration: 0.95, ease: "linear" }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(38,37,30,0.06), transparent)",
                  }}
                />
              )}
              <span
                className="relative text-fg-60 uppercase shrink-0"
                style={{ fontSize: "0.55rem", letterSpacing: "0.05em" }}
              >
                {line.method}
              </span>
              <span className="relative text-fg flex-1 truncate min-w-0">
                {line.path}
              </span>
              <span
                className="relative shrink-0"
                style={{
                  color: isActive ? "var(--color-fg)" : "var(--color-fg-40)",
                }}
              >
                {line.status}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <div className="relative z-10 mono-cap text-fg-40 text-[0.58rem] pt-1 border-t border-border-02">
        api · v1 · documentada
      </div>
    </div>
  );
}
