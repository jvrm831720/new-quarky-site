import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";

type Stat = {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  {
    end: 3400,
    suffix: "+",
    label: "LABORATÓRIOS INDEPENDENTES NO BRASIL",
  },
  {
    end: 0,
    prefix: "R$ ",
    label: "DE INTELIGÊNCIA CLÍNICA ESTRUTURADA NESSE MERCADO",
  },
  {
    end: 1,
    label: "ECOSSISTEMA CONSTRUÍDO PARA MUDAR ISSO",
  },
];

export function Atlas() {
  return (
    <section
      id="atlas"
      aria-labelledby="atlas-heading"
      className="section border-t border-border-02 bg-card"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 gap-x-10 gap-y-v2 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal delay={0}>
              <Eyebrow>PRODUTO · ATO I</Eyebrow>
            </Reveal>
            <Reveal delay={0}>
              <div className="mt-v2">
                <Image
                  src="/logos/atlas.svg"
                  alt="Atlas"
                  width={1297}
                  height={508}
                  className="h-[40px] w-auto logo-invert"
                />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <h2
              id="atlas-heading"
              className="type-lg md:type-xl text-fg max-w-[20ch] balance"
            >
              <Reveal as="span" className="block" delay={0}>
                Atlas. O primeiro LIS
              </Reveal>
              <Reveal as="span" className="block" delay={0.08}>
                veterinário AI-native
              </Reveal>
              <Reveal as="span" className="block" delay={0.16}>
                do Brasil.
              </Reveal>
            </h2>
            <div className="mt-v3 max-w-[60ch] space-y-v2 type-md-sm md:type-md text-fg-60">
              <Reveal delay={0.1}>
                <p>
                  O mercado veterinário brasileiro tem 3.400+ laboratórios
                  independentes. A maioria opera com sistemas da década de 2000.
                  Sem automação. Sem IA. Sem integração entre clínica e lab.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p>
                  O Atlas conecta o veterinário ao laboratório em um fluxo
                  digital completo: a requisição é feita de forma simples e
                  centralizada, a Orion sugere os exames certos com base nos
                  sinais clínicos, o laudo chega estruturado, e o prontuário
                  do paciente cresce a cada consulta.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-fg">
                  A medicina veterinária vai primeiro. Ciclo mais rápido,
                  mercado fragmentado, dado igualmente valioso — e nenhum
                  concorrente construído para durar.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Stat block */}
        <Reveal delay={0.5}>
          <div className="mt-v6 border-y border-border-02 py-v3 grid grid-cols-1 gap-x-10 gap-y-v3 md:grid-cols-3">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col gap-3">
                <CountUp
                  end={s.end}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="text-fg tabular-nums"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    letterSpacing: "-0.035em",
                    lineHeight: 0.92,
                  }}
                />
                <div className="mono-cap max-w-[28ch]">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA + lab partner badge */}
        <div className="mt-v4 flex flex-col gap-v2 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <Button href="https://sistema.atlasecolab.com/" variant="primary">
              Ver o Atlas <span aria-hidden="true">→</span>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mono-cap max-w-[60ch]">
              Desenvolvido com o maior laboratório veterinário independente do
              Brasil.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
