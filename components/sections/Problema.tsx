import { ProblemaCards } from "./ProblemaCards";

/**
 * Problema — "Por que isso importa".
 * Eyebrow + headline + intro + bento de 6 cards animados + resolução.
 */

export function Problema() {
  return (
    <section
      id="problema"
      aria-labelledby="problema-heading"
      className="section border-t border-border-02"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 gap-x-10 gap-y-v2 md:grid-cols-12">
          <div className="md:col-span-3">
            <div
              className="reveal uppercase"
              style={{
                fontFamily:
                  "berkeleyMono, ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "var(--color-fg-40)",
                transitionDelay: "0s",
              }}
            >
              Por que isso importa
            </div>
          </div>

          <div className="md:col-span-9">
            <h2
              id="problema-heading"
              className="reveal type-md-lg md:type-lg text-fg max-w-[14ch]"
              style={{ transitionDelay: "0s" }}
            >
              A saúde opera
              <br />
              sem memória.
            </h2>

            <p
              className="reveal mt-v3 max-w-[60ch] type-md-sm md:type-md text-fg-60"
              style={{ transitionDelay: "0.1s" }}
            >
              Dados clínicos existem em escala massiva no Brasil — exames,
              laudos, prontuários, consultas. Mas vivem em silos, em
              formatos que máquinas não leem, em sistemas que não conversam.
              A medicina nunca aprendeu com o que já viu.
            </p>
          </div>
        </div>

        {/* Bento de 6 cards animados ilustrando facetas do problema */}
        <div
          className="reveal mt-v5"
          style={{ transitionDelay: "0.2s" }}
        >
          <ProblemaCards />
        </div>

        {/* Resolução — punch final */}
        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-12 mt-v5">
          <div className="md:col-span-3" />
          <div className="md:col-span-9">
            <p
              className="reveal text-fg max-w-[44ch] balance"
              style={{
                transitionDelay: "0.3s",
                fontSize: "clamp(1.5rem, 2.6vw, 1.875rem)",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.25,
              }}
            >
              A Quarky existe para mudar isso. Não com um produto. Com
              infraestrutura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
