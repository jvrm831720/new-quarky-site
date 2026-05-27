import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroDemo } from "./HeroDemo";
import { OrionOrbScene } from "./OrionOrbScene";

/**
 * Hero — copy v2 (holding-positioning).
 * Animations use the global CSS reveal system (RevealObserver in layout.tsx):
 *   eyebrow         delay 0s
 *   headline line 1 delay 0s
 *   headline line 2 delay 0.08s
 *   headline line 3 delay 0.16s
 *   subheadline     delay 0.3s
 *   CTAs            delay 0.45s
 *   particle sphere keeps its own canvas animation (untouched)
 */

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="section section--hero"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-x-10 gap-y-v3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div
              className="reveal mb-v2 uppercase"
              style={{
                fontFamily:
                  "berkeleyMono, ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "var(--color-fg-40)",
                transitionDelay: "0s",
              }}
            >
              São Paulo · Brasil · Health Technology
            </div>

            {/* Headline — each line staggered 0.08s */}
            <h1
              id="hero-heading"
              className="text-fg"
              style={{
                fontSize: "clamp(2rem, 4.2vw, 3.25rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontWeight: 400,
              }}
            >
              <span
                className="reveal block"
                style={{ transitionDelay: "0s" }}
              >
                Construímos o sistema
              </span>
              <span
                className="reveal block"
                style={{ transitionDelay: "0.08s" }}
              >
                operacional da saúde
              </span>
              <span
                className="reveal block"
                style={{ transitionDelay: "0.16s" }}
              >
                clínica.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="reveal mt-v2 type-md-sm md:type-md text-fg-60 max-w-[58ch]"
              style={{ transitionDelay: "0.3s" }}
            >
              Dados clínicos existem aos bilhões. Inteligência clínica, quase
              zero. Entramos nos mercados que ninguém digitalizou —
              substituímos a infraestrutura, capturamos o dado, e construímos
              a inteligência que nenhum concorrente pode comprar.
            </p>

            {/* CTAs — enter together */}
            <div
              className="reveal mt-v2.5 flex flex-wrap items-center gap-3"
              style={{ transitionDelay: "0.45s" }}
            >
              <Button href="#atlas" variant="primary">
                Conheça o Atlas <span aria-hidden="true">→</span>
              </Button>
              <Button href="#missao" variant="secondary">
                Nossa missão
              </Button>
            </div>
          </div>

          {/* Particle sphere + data ingestion + label */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2} y={20}>
              <OrionOrbScene />
            </Reveal>
          </div>
        </div>

        {/* Pipeline demo · background painting (cursor.com style) */}
        <Reveal delay={0.35} y={20}>
          <div className="mt-v6 relative rounded-2xl md:rounded-3xl overflow-hidden hero-frame-bg isolate">
            <Image
              src="/background-hero.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 1280px, 100vw"
              priority
              quality={100}
              unoptimized
              className="object-cover hero-frame-bg-image select-none pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 hero-frame-bg-overlay pointer-events-none"
            />
            <div className="relative z-10 p-3 sm:p-6 md:p-10 lg:p-14">
              <HeroDemo />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <p className="mt-v2 mono-cap text-center">
            Fluxo ilustrativo · dados anonimizados, exemplos representativos
          </p>
        </Reveal>
      </div>
    </section>
  );
}
