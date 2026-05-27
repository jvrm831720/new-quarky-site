import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Visao() {
  return (
    <section
      id="visao"
      aria-labelledby="visao-heading"
      className="section border-t border-border-02"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 gap-x-10 gap-y-v2 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <Eyebrow>O que vem depois</Eyebrow>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <h2
                id="visao-heading"
                className="type-lg md:type-xl text-fg max-w-[16ch] balance"
              >
                O dataset é o destino.
              </h2>
            </Reveal>
            <div className="mt-v3 max-w-[60ch] space-y-v2 type-md-sm md:type-md text-fg-60">
              <Reveal delay={0.07}>
                <p>
                  O Atlas é o primeiro passo. Cada laudo processado, cada
                  diagnóstico registrado, cada dado clínico capturado pelo
                  sistema alimenta algo maior.
                </p>
              </Reveal>
              <Reveal delay={0.13}>
                <p>
                  Orion é a camada de inteligência da Quarky — um motor de IA
                  treinado exclusivamente em dados clínicos reais, coletados
                  diretamente na ponta do ecossistema de saúde.
                </p>
              </Reveal>
              <Reveal delay={0.19}>
                <p className="text-fg">
                  Quando a infraestrutura estiver instalada, o dataset se torna
                  o diferencial que nenhum concorrente pode comprar. Só pode
                  construir. E nós já começamos.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
