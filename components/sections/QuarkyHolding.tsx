import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { QuarkyHoldingVisual } from "./QuarkyHoldingVisual";

export function QuarkyHolding() {
  return (
    <section
      aria-labelledby="missao-heading"
      className="section border-t border-border-02"
    >
      <div
        id="missao"
        className="container-site scroll-mt-[calc(var(--site-header-height)+1rem)]"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-v2 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <Eyebrow>O que somos</Eyebrow>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={0.05}>
              <h2
                id="missao-heading"
                className="type-lg md:type-xl text-fg max-w-[24ch] balance"
              >
                Uma empresa de produto.
                <br />
                Com uma tese de plataforma.
              </h2>
            </Reveal>
            <div className="mt-v3 max-w-[60ch] space-y-v2 type-md-sm md:type-md text-fg-60">
              <Reveal delay={0.1}>
                <p>
                  Identificamos mercados de saúde com décadas de atraso
                  tecnológico e entramos com software que substitui o que
                  existe. Ao fazer isso, passamos a capturar o dado que ninguém
                  tem.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  Não construímos features. Construímos fundações. Cada produto
                  é uma nova camada de infraestrutura clínica — e uma nova fonte
                  de dados proprietários, estruturados, impossíveis de replicar.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="text-fg">
                  Dado clínico estruturado em escala é o ativo mais valioso da
                  medicina do século XXI.
                  <br />É o que estamos construindo.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* The OS-stack visual replaces the previous 3-card grid */}
        <Reveal delay={0.18} y={20}>
          <div className="mt-v6">
            <QuarkyHoldingVisual />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
