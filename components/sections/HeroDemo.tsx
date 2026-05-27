"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Exam = {
  patient: string;
  species: string;
  breed: string;
  age: string;
  type: string;
  origin: string;
  fields: { label: string; value: string }[];
};

const POOL: Exam[] = [
  {
    patient: "Bella M.",
    species: "Cão",
    breed: "Labrador",
    age: "6 anos",
    type: "Hemograma completo",
    origin: "Lab Vet Centro · SP",
    fields: [
      { label: "Hematócrito", value: "44.2 %" },
      { label: "Leucócitos", value: "12.300 /μL" },
      { label: "Plaquetas", value: "285 k/μL" },
      { label: "Hemoglobina", value: "15.1 g/dL" },
    ],
  },
  {
    patient: "Thor R.",
    species: "Cão",
    breed: "Pinscher",
    age: "4 anos",
    type: "Bioquímico sérico",
    origin: "Pet Lab SP",
    fields: [
      { label: "Ureia", value: "38 mg/dL" },
      { label: "Creatinina", value: "1.2 mg/dL" },
      { label: "ALT", value: "52 U/L" },
      { label: "Fosfatase alcalina", value: "98 U/L" },
    ],
  },
  {
    patient: "Mia C.",
    species: "Gato",
    breed: "SRD",
    age: "9 anos",
    type: "Urinálise tipo I",
    origin: "BioVet Diagnóstico",
    fields: [
      { label: "Densidade", value: "1.038" },
      { label: "pH", value: "6.5" },
      { label: "Proteína", value: "negativa" },
      { label: "Sedimento", value: "raros cristais" },
    ],
  },
  {
    patient: "Luna F.",
    species: "Cão",
    breed: "Golden",
    age: "8 anos",
    type: "T4 livre · TSH",
    origin: "Animal Clin · Campinas",
    fields: [
      { label: "T4 livre", value: "0.7 ng/dL" },
      { label: "TSH", value: "0.42 ng/mL" },
      { label: "Suspeita", value: "hipotireoidismo" },
      { label: "Confiança", value: "0.91" },
    ],
  },
  {
    patient: "Zeus P.",
    species: "Cão",
    breed: "Pastor Alemão",
    age: "3 anos",
    type: "Coagulograma",
    origin: "Diagnóstica Vet",
    fields: [
      { label: "TP", value: "8.2 s" },
      { label: "TTPA", value: "14.6 s" },
      { label: "Fibrinogênio", value: "245 mg/dL" },
      { label: "INR", value: "1.04" },
    ],
  },
  {
    patient: "Nina V.",
    species: "Gato",
    breed: "Siamês",
    age: "11 anos",
    type: "Citologia oncótica",
    origin: "AlphaVet Lab",
    fields: [
      { label: "Origem", value: "linfonodo" },
      { label: "Celularidade", value: "alta" },
      { label: "Padrão", value: "linfoide reativo" },
      { label: "Confiança", value: "0.88" },
    ],
  },
  {
    patient: "Bento S.",
    species: "Cão",
    breed: "Bulldog",
    age: "5 anos",
    type: "Sorologia · cinomose",
    origin: "Lab Pet Care",
    fields: [
      { label: "IgG", value: "1:512 (positivo)" },
      { label: "IgM", value: "1:64 (positivo)" },
      { label: "Fase", value: "infecção recente" },
      { label: "Confiança", value: "0.96" },
    ],
  },
  {
    patient: "Maya T.",
    species: "Felino",
    breed: "Persa",
    age: "7 anos",
    type: "Cortisol basal",
    origin: "Lab Vet Centro · SP",
    fields: [
      { label: "Cortisol", value: "4.8 μg/dL" },
      { label: "Referência", value: "1–5 μg/dL" },
      { label: "Status", value: "limite superior" },
      { label: "Confiança", value: "0.83" },
    ],
  },
];

const TICK_MS = 3200;
const QUEUE_LEN = 5;

type Keyed = Exam & { _k: number };

export function HeroDemo() {
  const reduce = useReducedMotion();
  const counterRef = useRef(QUEUE_LEN);
  const [queue, setQueue] = useState<Keyed[]>(() =>
    Array.from({ length: QUEUE_LEN }).map((_, i) => ({
      ...POOL[i % POOL.length],
      _k: i,
    })),
  );
  const [current, setCurrent] = useState<Keyed>(() => ({
    ...POOL[0],
    _k: -1,
  }));
  const [stats, setStats] = useState({
    exames: 1247832,
    pacientes: 184923,
    padroes: 1842,
    labs: 312,
  });

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const k = counterRef.current++;
      const next = POOL[k % POOL.length];
      setQueue((q) => [{ ...next, _k: k }, ...q.slice(0, QUEUE_LEN - 1)]);
      setCurrent({ ...next, _k: k });
      setStats((s) => ({
        exames: s.exames + Math.floor(Math.random() * 4) + 1,
        pacientes: s.pacientes + (Math.random() > 0.4 ? 1 : 0),
        padroes: s.padroes + (Math.random() > 0.92 ? 1 : 0),
        labs: s.labs + (Math.random() > 0.97 ? 1 : 0),
      }));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const fmt = (n: number) => n.toLocaleString("pt-BR");
  const examId =
    "QRK-VET-" +
    (8000000 + counterRef.current).toString().slice(-7);

  return (
    <div className="rounded-xl bg-card border border-border-02 overflow-hidden shadow-[0_1px_0_rgba(38,37,30,0.04),0_8px_24px_-8px_rgba(38,37,30,0.08)]">
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border-02 bg-card-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-fg-15" />
          <span className="w-2.5 h-2.5 rounded-full bg-fg-15" />
          <span className="w-2.5 h-2.5 rounded-full bg-fg-15" />
        </div>
        <div className="ml-auto mono-cap">
          quarky · pipeline de ingestão clínica
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border-02 min-h-[440px]">
        {/* QUEUE — hidden on small screens */}
        <div className="hidden md:flex md:col-span-3 p-5 flex-col">
          <div className="mono-cap mb-4">Fila de ingestão</div>
          <ul className="space-y-1 flex-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {queue.map((item, i) => (
                <motion.li
                  key={item._k}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-2.5 py-2"
                >
                  <span
                    className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${
                      i === 0 ? "bg-fg" : "bg-fg-40"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="type-sm text-fg truncate">
                      {item.patient}
                    </div>
                    <div className="type-xs text-fg-60 truncate">
                      {item.type}
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {/* EXTRACTION — main panel */}
        <div className="md:col-span-6 p-5 md:p-6 bg-bg flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="mono-cap">Extração estruturada</div>
            <div
              className="text-fg-60"
              style={{
                fontFamily: "berkeleyMono, ui-monospace, monospace",
                fontSize: "0.6875rem",
                letterSpacing: "0.04em",
              }}
            >
              {examId}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current._k}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <div className="type-md-lg text-fg">{current.patient}</div>
                <div className="type-sm text-fg-60">
                  {current.species} · {current.breed} · {current.age}
                </div>
              </div>
              <div className="mt-1 type-sm text-fg-60">{current.type}</div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 border-t border-border-02 pt-4">
                {current.fields.map((f, i) => (
                  <motion.div
                    key={`${current._k}-${i}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.18 + i * 0.11,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-baseline justify-between gap-3 border-b border-border-01 pb-2"
                  >
                    <span className="type-xs text-fg-60">{f.label}</span>
                    <span
                      className="text-fg"
                      style={{
                        fontFamily: "berkeleyMono, ui-monospace, monospace",
                        fontSize: "0.8125rem",
                        letterSpacing: "0",
                      }}
                    >
                      {f.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.18 + current.fields.length * 0.11 + 0.1,
                }}
                className="mt-4 flex items-center gap-2 flex-wrap"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-fg" />
                <span className="type-xs text-fg-60">
                  Origem · {current.origin}
                </span>
                <span className="ml-auto mono-cap text-fg">
                  ✓ ingerido no dataset
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* STATS */}
        <div className="md:col-span-3 p-5 flex flex-col">
          <div className="mono-cap mb-4">Dataset clínico</div>
          <ul className="space-y-4 flex-1">
            <StatRow label="Exames ingeridos" value={stats.exames} fmt={fmt} />
            <StatRow
              label="Pacientes únicos"
              value={stats.pacientes}
              fmt={fmt}
            />
            <StatRow
              label="Padrões clínicos"
              value={stats.padroes}
              fmt={fmt}
            />
            <StatRow
              label="Laboratórios conectados"
              value={stats.labs}
              fmt={fmt}
            />
          </ul>
          <div className="mt-5 pt-4 border-t border-border-02 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {!reduce && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fg opacity-30" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fg" />
            </span>
            <span className="mono-cap">streaming · ao vivo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  fmt,
}: {
  label: string;
  value: number;
  fmt: (n: number) => string;
}) {
  return (
    <li>
      <div className="type-xs text-fg-60 mb-1">{label}</div>
      <motion.div
        key={value}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-fg tabular-nums"
        style={{
          fontFamily: "berkeleyMono, ui-monospace, monospace",
          fontSize: "1.125rem",
          letterSpacing: "-0.01em",
        }}
      >
        {fmt(value)}
      </motion.div>
    </li>
  );
}
