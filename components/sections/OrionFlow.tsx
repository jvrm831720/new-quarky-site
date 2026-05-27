"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/* ──────────────────────────────────────────────────────────────────────
   ORION × ATLAS · UM CICLO COMPLETO
   Bento (3 + 1 hero). Cada mockup tem ciclo start → middle → end e
   pousa em estado estável. Hover (desktop) e IntersectionObserver
   (touch) disparam o ciclo.
   ────────────────────────────────────────────────────────────────────── */

export function OrionFlow() {
  return (
    <section
      id="orion-flow"
      aria-labelledby="orion-flow-heading"
      className="section border-t border-border-02"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 gap-x-10 gap-y-v3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow>ORION × ATLAS · UM CICLO COMPLETO</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="orion-flow-heading"
                className="mt-v2 type-lg md:type-xl text-fg max-w-[22ch] balance"
              >
                Da consulta ao laudo,
                <br />
                um único fluxo inteligente.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.1}>
              <p className="type-md-sm md:type-md text-fg-60 max-w-[40ch]">
                Cada decisão clínica passa por Atlas e ganha contexto com
                Orion — sem digitação dupla, sem requisição manual, sem laudo
                esquecido na gaveta.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-v4 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          <WorkflowCard
            index={1}
            colSpan="md:col-span-2"
            aspect="aspect-[5/6] md:aspect-[4/5]"
            title="A consulta começa no celular."
            desc="Dados do paciente em 30 segundos. Sem prancheta, sem sistema travado, sem depender da recepção do lab."
            mockup={(s) => <MockPhone state={s} />}
          />
          <WorkflowCard
            index={2}
            colSpan="md:col-span-2"
            aspect="aspect-[5/6] md:aspect-[4/5]"
            title="Orion lê o quadro em tempo real."
            desc="O vet digita as observações. A IA analisa, cruza padrões e sugere o próximo passo — antes mesmo de o vet pedir."
            mockup={(s) => <MockOrionAI state={s} />}
          />
          <WorkflowCard
            index={3}
            colSpan="md:col-span-2"
            aspect="aspect-[5/6] md:aspect-[4/5]"
            title="Exames vão direto pro lab."
            desc="Orion recomenda, o vet confirma e Atlas envia. Sem requisição em papel, sem dupla digitação — o lab já recebe pronto pra processar."
            mockup={(s) => <MockExams state={s} />}
          />
          <WorkflowCard
            index={4}
            colSpan="md:col-span-6"
            aspect="min-h-[46rem] md:min-h-0 md:aspect-[21/9]"
            title="Laudo técnico + transcrição da Orion."
            desc="Quando o lab finaliza, dois laudos chegam juntos no mesmo prontuário: um para o registro clínico, outro em linguagem que o tutor entende."
            mockup={(s) => <MockLaudo state={s} />}
            wide
            textBgImage="/rioquarky.png"
          />
        </div>

        <p className="sr-only">
          Fluxo Atlas + Orion em quatro etapas: cadastro de paciente no
          celular, leitura do quadro clínico pela IA, recomendação e envio
          automático de exames ao laboratório, e entrega de laudo técnico
          acompanhado de transcrição Orion para o tutor.
        </p>
      </div>
    </section>
  );
}

/* ─── Card primitive ──────────────────────────────────────────────────── */

type CardState = "idle" | "active";

function WorkflowCard({
  index,
  title,
  desc,
  mockup,
  colSpan,
  aspect,
  wide = false,
  textBgImage,
}: {
  index: number;
  title: string;
  desc: string;
  mockup: (state: CardState) => ReactNode;
  colSpan: string;
  aspect: string;
  wide?: boolean;
  /** Quando setada, vira background do painel de texto à direita. */
  textBgImage?: string;
}) {
  const { ref, active, bind } = useCardActive();
  const state: CardState = active ? "active" : "idle";

  return (
    <Reveal delay={0.05 + index * 0.05} className={colSpan}>
      <div
        ref={ref}
        {...bind}
        className={[
          "group relative h-full rounded-xl border bg-card overflow-hidden isolate",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out-soft",
          "transform-gpu shadow-none md:hover:scale-[1.015] md:hover:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)] md:focus-within:scale-[1.015] md:focus-within:shadow-[0_28px_56px_-24px_rgba(38,37,30,0.28)]",
          aspect,
          active
            ? "border-border-025 md:-translate-y-[3px]"
            : "border-border-02",
        ].join(" ")}
      >
        {/* Inner edge highlight */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 z-20 rounded-xl transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{ boxShadow: "inset 0 0 0 1px rgba(38,37,30,0.10)" }}
        />

        <div
          className={[
            "absolute inset-0 flex",
            wide ? "flex-col md:flex-row" : "flex-col",
          ].join(" ")}
        >
          <div
            className={[
              "relative overflow-hidden",
              wide ? "flex-1 md:flex-[1.7]" : "flex-1",
            ].join(" ")}
          >
            {mockup(state)}
          </div>

          <div
            className={[
              "relative shrink-0 px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5 overflow-hidden",
              wide
                ? "border-t border-border-01 md:border-t-0 md:border-l md:w-[36%] md:flex md:flex-col md:justify-end"
                : "border-t border-border-01",
            ].join(" ")}
          >
            {textBgImage && (
              <>
                <Image
                  src={textBgImage}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  quality={100}
                  unoptimized
                  className="object-cover select-none pointer-events-none -z-10"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)",
                  }}
                />
              </>
            )}
            <div className="relative flex items-baseline gap-3">
              <span
                className={
                  textBgImage ? "mono-cap text-white/70" : "mono-cap text-fg-40"
                }
              >
                0{index}
              </span>
              <h3
                className={[
                  "type-md-sm md:type-md balance",
                  textBgImage ? "text-white" : "text-fg",
                ].join(" ")}
              >
                {title}
              </h3>
            </div>
            <p
              className={[
                "relative mt-2 type-sm max-w-[44ch] leading-snug-plus",
                textBgImage ? "text-white/85" : "text-fg-60",
              ].join(" ")}
            >
              {desc}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Active-state hook ─────────────────────────────────────────────── */

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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/* ─── Shared primitives ─────────────────────────────────────────────── */

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

function Sparkle({ pulse }: { pulse: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="text-fg shrink-0 leading-none mt-[2px]"
      animate={pulse ? { scale: [1, 1.22, 1], rotate: [0, 14, 0] } : { scale: 1 }}
      transition={{
        duration: 1.8,
        repeat: pulse ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      ✦
    </motion.span>
  );
}

function CheckCircle() {
  return (
    <span className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-fg shrink-0">
      <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
        <path
          d="M2.5 5l1.7 1.7L7.5 3.5"
          stroke="var(--color-bg)"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block w-[2px] h-[0.9em] bg-fg align-middle ml-[1px]"
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Mockup 1 · Phone (start → typing → saved) ──────────────────────── */

const PHONE_FIELDS = [
  { label: "Nome", value: "Thor" },
  { label: "Espécie", value: "Canino" },
  { label: "Raça", value: "Labrador" },
  { label: "Peso", value: "30 kg" },
];

function MockPhone({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [done, setDone] = useState(true);

  useEffect(() => {
    if (reduce || !active) {
      setDone(true);
      return;
    }
    setDone(false);
    const longestField = Math.max(...PHONE_FIELDS.map((f) => f.value.length));
    const totalMs = PHONE_FIELDS.length * 250 + longestField * 55 + 600;
    const t = setTimeout(() => setDone(true), totalMs);
    return () => clearTimeout(t);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 overflow-hidden">
      <Particles count={5} />

      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4"
        animate={active && !reduce ? { y: -2 } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={active && !reduce ? { rotate: -2 } : { rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={[
            "w-[240px] max-w-full rounded-[28px] border border-border-025 bg-bg overflow-hidden",
            "transition-shadow duration-500",
            active
              ? "shadow-[0_40px_72px_-24px_rgba(38,37,30,0.38)]"
              : "shadow-[0_24px_48px_-16px_rgba(38,37,30,0.22)]",
          ].join(" ")}
        >
          <div className="h-5 flex items-center justify-center border-b border-border-01">
            <span className="h-1 w-12 rounded-full bg-fg-15" />
          </div>
          <div className="px-3.5 py-3">
            <div className="mono-cap mb-2 text-[0.62rem]">Dados do Paciente</div>
            <ul className="space-y-2">
              {PHONE_FIELDS.map((f, i) => (
                <li key={f.label} className="space-y-0.5">
                  <div className="text-[0.58rem] uppercase tracking-wider text-fg-40">
                    {f.label}
                  </div>
                  <div className="border-b border-border-02 pb-0.5 text-[0.8rem] text-fg min-h-[1.1rem]">
                    <TypedText value={f.value} active={active} delayMs={i * 250} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between gap-2">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-1 text-[0.62rem] text-fg-60"
                  >
                    <CheckCircle />
                    <span>Salvo</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="atlas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[0.6rem] text-fg-40"
                  >
                    Atlas · v2.4
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                animate={
                  done && active && !reduce ? { scale: [1, 1.05, 1] } : { scale: 1 }
                }
                transition={{
                  duration: 1.6,
                  repeat: done && active ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className={[
                  "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[0.62rem] transition-colors duration-300",
                  done ? "bg-fg text-bg" : "bg-fg-10 text-fg-40",
                ].join(" ")}
              >
                Continuar <span aria-hidden="true">→</span>
              </motion.span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function TypedText({
  value,
  active,
  delayMs,
}: {
  value: string;
  active: boolean;
  delayMs: number;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(value.length);

  useEffect(() => {
    if (reduce || !active) {
      setN(value.length);
      return;
    }
    setN(0);
    let i = 0;
    let id: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      id = setInterval(() => {
        i++;
        setN(i);
        if (i >= value.length && id) clearInterval(id);
      }, 55);
    }, delayMs);
    return () => {
      clearTimeout(start);
      if (id) clearInterval(id);
    };
  }, [active, value, delayMs, reduce]);

  return <span>{value.slice(0, n) || " "}</span>;
}

/* ─── Mockup 2 · Orion AI (typing → scanning → response) ─────────────── */

const VET_TEXT =
  "Apatia, perda de apetite, leucócitos elevados em exame anterior.";
const ORION_RESPONSE =
  "Sugiro hemograma + bioquímica para investigar inflamação sistêmica.";

type AIPhase = "typing" | "scanning" | "responding" | "complete";

function MockOrionAI({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<AIPhase>("complete");
  const [vetN, setVetN] = useState(VET_TEXT.length);
  const [orionN, setOrionN] = useState(ORION_RESPONSE.length);

  useEffect(() => {
    if (reduce || !active) {
      setPhase("complete");
      setVetN(VET_TEXT.length);
      setOrionN(ORION_RESPONSE.length);
      return;
    }
    setPhase("typing");
    setVetN(0);
    setOrionN(0);
    const ts: ReturnType<typeof setTimeout>[] = [];

    let vi = 0;
    const vetInterval = setInterval(() => {
      vi++;
      setVetN(vi);
      if (vi >= VET_TEXT.length) clearInterval(vetInterval);
    }, 26);
    const typingMs = VET_TEXT.length * 26 + 200;

    ts.push(setTimeout(() => setPhase("scanning"), typingMs));

    const scanningMs = 1000;
    ts.push(
      setTimeout(() => {
        setPhase("responding");
        let oi = 0;
        const orionInterval = setInterval(() => {
          oi++;
          setOrionN(oi);
          if (oi >= ORION_RESPONSE.length) clearInterval(orionInterval);
        }, 22);
      }, typingMs + scanningMs),
    );

    const respondingMs = ORION_RESPONSE.length * 22 + 400;
    ts.push(
      setTimeout(
        () => setPhase("complete"),
        typingMs + scanningMs + respondingMs,
      ),
    );

    return () => {
      ts.forEach(clearTimeout);
      clearInterval(vetInterval);
    };
  }, [active, reduce]);

  const showResponse = phase === "responding" || phase === "complete";

  return (
    <div className="relative h-full w-full bg-card-2 p-5 flex flex-col gap-3 justify-center overflow-hidden">
      <Particles count={6} />

      {/* Floating status */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            key="scanning-badge"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-bg border border-border-025 px-2 py-0.5 text-[0.58rem] mono-cap text-fg-60"
          >
            <motion.span
              className="text-fg"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.span>
            <span>Orion analisando</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vet observations */}
      <div className="relative rounded-md border border-border-025 bg-bg p-3 shadow-[0_8px_24px_-12px_rgba(38,37,30,0.12)] overflow-hidden z-10">
        <div className="mono-cap mb-1.5 text-[0.58rem] flex items-center justify-between">
          <span>Observações clínicas</span>
          <span className="text-fg-40">Vet · Carla</span>
        </div>
        <div className="text-[0.76rem] leading-snug text-fg-80 min-h-[2.8rem]">
          <span>{VET_TEXT.slice(0, vetN)}</span>
          {phase === "typing" && <BlinkingCursor />}
        </div>

        {/* Scanning beam */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              aria-hidden="true"
              key="beam"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(38,37,30,0.14), transparent)",
              }}
            />
          )}
        </AnimatePresence>
        {/* Border glow during scan */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-md pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 1px rgba(38,37,30,0.22)" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Connector with travelling pulse */}
      <div className="relative flex justify-center h-2 z-10">
        <div className="absolute left-1/2 top-0 w-[1px] h-full -translate-x-1/2 bg-fg-15" />
        <AnimatePresence>
          {(phase === "scanning" || phase === "responding") && (
            <motion.span
              key="pulse"
              initial={{ y: -4, opacity: 0 }}
              animate={{ y: 10, opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full -translate-x-1/2 bg-fg"
              style={{ boxShadow: "0 0 6px rgba(38,37,30,0.5)" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Orion response */}
      <motion.div
        initial={false}
        animate={{
          opacity: showResponse ? 1 : 0,
          scale: showResponse ? 1 : 0.94,
          y: showResponse ? 0 : 6,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-md border border-border-025 bg-card-3 px-3 py-2.5 flex items-start gap-2 overflow-hidden min-h-[3.2rem] z-10"
      >
        {/* Aurora-style gradient pulsing */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 40%, rgba(38,37,30,0.10), transparent 60%), radial-gradient(circle at 80% 60%, rgba(38,37,30,0.06), transparent 70%)",
          }}
          animate={
            showResponse && !reduce
              ? { opacity: [0.5, 1, 0.5] }
              : { opacity: 0 }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Shimmer sweep on emergence */}
        <AnimatePresence>
          {phase === "responding" && (
            <motion.div
              aria-hidden="true"
              key="shimmer"
              initial={{ x: "-110%" }}
              animate={{ x: "110%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "linear" }}
              className="absolute inset-y-0 w-1/2 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              }}
            />
          )}
        </AnimatePresence>

        <Sparkle pulse={active && !reduce} />
        <span className="relative z-10 text-[0.74rem] leading-snug text-fg-80">
          <span className="text-fg">Orion · </span>
          <span>{ORION_RESPONSE.slice(0, orionN)}</span>
          {phase === "responding" && orionN < ORION_RESPONSE.length && (
            <BlinkingCursor />
          )}
        </span>
      </motion.div>
    </div>
  );
}

/* ─── Mockup 3 · Exames (recomenda → confirma → envia → sucesso) ─────── */

const MINI_EXAMS = [
  { name: "Hemograma Completo", rec: true },
  { name: "Bioquímica Sérica", rec: true },
  { name: "Urinálise tipo I", rec: false },
  { name: "T4 livre · TSH", rec: false },
];

type ExamPhase =
  | "idle"
  | "analyzing"
  | "checking"
  | "sending"
  | "sent";

function MockExams({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<ExamPhase>("sent");
  const [checks, setChecks] = useState<number[]>([0, 1]);
  const [showBadges, setShowBadges] = useState(true);

  useEffect(() => {
    if (reduce || !active) {
      setPhase("sent");
      setChecks([0, 1]);
      setShowBadges(true);
      return;
    }
    setPhase("idle");
    setChecks([]);
    setShowBadges(false);
    const ts = [
      setTimeout(() => {
        setPhase("analyzing");
        setShowBadges(true);
      }, 400),
      setTimeout(() => {
        setPhase("checking");
        setChecks([0]);
      }, 1400),
      setTimeout(() => setChecks([0, 1]), 1800),
      setTimeout(() => setPhase("sending"), 2400),
      setTimeout(() => setPhase("sent"), 3900),
    ];
    return () => ts.forEach(clearTimeout);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 p-5 flex flex-col justify-center gap-3 overflow-hidden">
      <Particles count={4} />

      {/* Floating status while analyzing */}
      <AnimatePresence>
        {phase === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-bg border border-border-025 px-2 py-0.5 text-[0.58rem] mono-cap text-fg-60"
          >
            <motion.span
              className="text-fg"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.span>
            <span>Orion analisando</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="space-y-2 relative z-10">
        {MINI_EXAMS.map((e, i) => {
          const checked = checks.includes(i);
          return (
            <li
              key={e.name}
              className="flex items-center gap-2.5 text-[0.78rem] text-fg"
            >
              <MiniCheckbox checked={checked} />
              <span className="flex-1 truncate">{e.name}</span>
              {e.rec && (
                <motion.span
                  initial={false}
                  animate={{
                    opacity: showBadges ? 0.78 : 0,
                    x: showBadges ? 0 : 4,
                  }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="mono-cap inline-flex items-center gap-1 text-fg-60 text-[0.55rem]"
                >
                  <span>✦</span> Orion
                </motion.span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Status banner with end state */}
      <div className="relative z-10 min-h-[2rem]">
        <AnimatePresence mode="wait">
          {phase === "sending" && (
            <motion.div
              key="sending"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="relative flex items-center justify-between rounded-md border border-border-025 bg-bg px-3 py-1.5 text-[0.68rem] overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-0 left-0"
                style={{ background: "rgba(38,37,30,0.07)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
              <span className="mono-cap text-fg-60 relative">
                → Enviando ao laboratório
              </span>
              <motion.span
                className="relative h-1.5 w-1.5 rounded-full bg-fg"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
          {phase === "sent" && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-between rounded-md border border-border-025 bg-bg px-3 py-1.5 text-[0.68rem] overflow-hidden"
            >
              <motion.span
                initial={false}
                animate={
                  active && !reduce
                    ? { boxShadow: ["0 0 0 0 rgba(38,37,30,0)", "0 0 0 6px rgba(38,37,30,0)"] }
                    : {}
                }
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="rounded-full"
                style={{ display: "inline-flex" }}
              >
                <span className="mono-cap text-fg flex items-center gap-1.5">
                  <CheckCircle /> Requisição enviada
                </span>
              </motion.span>
              <span className="mono-cap text-fg-40 text-[0.58rem]">
                #RQ-3422
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MiniCheckbox({ checked }: { checked: boolean }) {
  return (
    <motion.span
      animate={{ scale: checked ? [0.85, 1.12, 1] : 1 }}
      transition={{ duration: 0.32 }}
      className={[
        "h-3.5 w-3.5 rounded-[3px] border shrink-0 flex items-center justify-center transition-colors duration-200",
        checked ? "bg-fg border-fg" : "border-border-025 bg-bg",
      ].join(" ")}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M2 5l2 2 4-4"
            stroke="var(--color-bg)"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.span>
  );
}

/* ─── Mockup 4 · Laudo + Transcrição Orion (hero) ────────────────────── */

const LAUDO_TECH_LINES = [
  { text: "Hemograma Completo", kind: "header" as const },
  { text: "WBC · 14.200/µL  (ref. 6–17)", kind: "data" as const },
  { text: "RBC · 6.8 M/µL    (ref. 5.5–8.5)", kind: "data" as const },
  { text: "Bioquímica Sérica", kind: "header" as const },
  { text: "Ureia · 58 mg/dL  (ref. 21–60)", kind: "data" as const },
];

const ORION_TRANSCRIPT = [
  "Thor está bem no geral — algumas alterações pequenas que valem acompanhar.",
  "Leucócitos um pouco acima do normal podem indicar inflamação leve.",
  "Ureia no limite superior · reavaliar em 30 dias.",
];

type LaudoPhase = "tech" | "transcript" | "sent";

function MockLaudo({ state }: { state: CardState }) {
  const active = state === "active";
  const reduce = useReducedMotion();
  const canTilt = useMediaQuery("(min-width: 640px)");
  const [shownTech, setShownTech] = useState(LAUDO_TECH_LINES.length);
  const [shownTranscript, setShownTranscript] = useState(ORION_TRANSCRIPT.length);
  const [phase, setPhase] = useState<LaudoPhase>("sent");

  useEffect(() => {
    if (reduce || !active) {
      setShownTech(LAUDO_TECH_LINES.length);
      setShownTranscript(ORION_TRANSCRIPT.length);
      setPhase("sent");
      return;
    }
    setShownTech(0);
    setShownTranscript(0);
    setPhase("tech");
    const ts: ReturnType<typeof setTimeout>[] = [];

    LAUDO_TECH_LINES.forEach((_, i) => {
      ts.push(setTimeout(() => setShownTech(i + 1), 350 + i * 280));
    });

    const transcriptStart = 350 + LAUDO_TECH_LINES.length * 280 + 200;
    ts.push(setTimeout(() => setPhase("transcript"), transcriptStart - 100));
    ORION_TRANSCRIPT.forEach((_, i) => {
      ts.push(
        setTimeout(() => setShownTranscript(i + 1), transcriptStart + i * 400),
      );
    });

    ts.push(
      setTimeout(
        () => setPhase("sent"),
        transcriptStart + ORION_TRANSCRIPT.length * 400 + 200,
      ),
    );

    return () => ts.forEach(clearTimeout);
  }, [active, reduce]);

  return (
    <div className="relative h-full w-full bg-card-2 overflow-hidden flex items-center justify-center p-4 sm:p-5 md:p-8">
      <Particles count={10} />

      {/* Status pill (end state) */}
      <AnimatePresence>
        {phase === "sent" && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-bg border border-border-025 px-2 py-0.5 text-[0.58rem] mono-cap text-fg-60"
          >
            <CheckCircle />
            <span>Enviado ao vet</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[680px] grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {/* Technical laudo */}
        <motion.div
          animate={
            active && !reduce && canTilt
              ? { y: -4, rotate: -1.2 }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={[
            "rounded-lg border border-border-025 bg-bg overflow-hidden",
            "transition-shadow duration-500",
            active
              ? "shadow-[0_32px_64px_-20px_rgba(38,37,30,0.3)]"
              : "shadow-[0_20px_40px_-16px_rgba(38,37,30,0.18)]",
          ].join(" ")}
        >
          <div className="px-3 py-2 border-b border-border-02 flex items-center justify-between text-[0.7rem]">
            <span className="text-fg font-medium">Laudo técnico</span>
            <span className="mono-cap text-fg-40 text-[0.55rem]">RQ-3422</span>
          </div>
          <div className="px-3 py-2.5 space-y-1 text-[0.7rem] leading-relaxed min-h-[7rem] sm:min-h-[8rem]">
            {LAUDO_TECH_LINES.map((l, i) => {
              if (i >= shownTech) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={
                    l.kind === "header"
                      ? "text-fg pt-1 text-[0.72rem] font-medium"
                      : "text-fg-80"
                  }
                  style={
                    l.kind === "data"
                      ? {
                          fontFamily:
                            "berkeleyMono, ui-monospace, monospace",
                          fontSize: "0.65rem",
                        }
                      : undefined
                  }
                >
                  {l.text}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Orion transcript */}
        <motion.div
          animate={
            active && !reduce && canTilt
              ? { y: -4, rotate: 1.2 }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.05,
          }}
          className={[
            "relative rounded-lg border border-border-025 bg-bg overflow-hidden",
            "transition-shadow duration-500",
            active
              ? "shadow-[0_32px_64px_-20px_rgba(38,37,30,0.3)]"
              : "shadow-[0_20px_40px_-16px_rgba(38,37,30,0.18)]",
          ].join(" ")}
        >
          {/* Shimmer when transcript phase starts */}
          <AnimatePresence>
            {phase === "transcript" && (
              <motion.div
                aria-hidden="true"
                key="trans-shimmer"
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "linear" }}
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative px-3 py-2 border-b border-border-02 flex items-center gap-1.5 bg-card-3 text-[0.7rem] text-fg">
            <Sparkle pulse={active && !reduce} />
            <span>Transcrição Orion · para o tutor</span>
          </div>
          <div className="relative px-3 py-2.5 space-y-1.5 text-[0.72rem] leading-relaxed text-fg-80 min-h-[8.5rem] sm:min-h-[8rem]">
            {ORION_TRANSCRIPT.map((line, i) => {
              if (i >= shownTranscript) return null;
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={i === 0 ? "text-fg" : ""}
                >
                  {line}
                </motion.p>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
