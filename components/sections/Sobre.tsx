"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Sobre — A EMPRESA · seção final com imagem SP como background full-bleed.
 * Texto branco sobreposto, vignette de baixo + ambient float dos blocos.
 */

export function Sobre() {
  const reduce = useReducedMotion();

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="relative isolate border-t border-border-02 overflow-hidden"
    >
      {/* Background SP — container isolado, animação CSS só no elemento da imagem */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 overflow-hidden"
        style={{
          isolation: "isolate",
          contain: "strict",
        }}
      >
        <Image
          src="/spquarky.png"
          alt=""
          fill
          sizes="100vw"
          quality={100}
          unoptimized
          className="object-cover select-none pointer-events-none sp-bg-drift"
        />
      </div>

      {/* Vignette + darkening overlay para legibilidade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <div className="relative container-site section">
        {/* Bloco 1 — A empresa */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-v2 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <div
                className="reveal uppercase"
                style={{
                  fontFamily:
                    "berkeleyMono, ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.6)",
                  transitionDelay: "0s",
                }}
              >
                A empresa
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <h2
                id="sobre-heading"
                className="type-md-lg md:type-lg max-w-[22ch] balance"
                style={{ color: "#ffffff" }}
              >
                Construída em São Paulo.
                <br />
                Pensada para o Brasil inteiro.
              </h2>
            </Reveal>
            <div className="mt-v3 max-w-[60ch] space-y-v2 type-md-sm md:type-md">
              <Reveal delay={0.07}>
                <p style={{ color: "rgba(255,255,255,0.75)" }}>
                  Operações sediadas em São Paulo. Atuando em todo o Brasil.
                </p>
              </Reveal>
              <Reveal delay={0.13}>
                <p style={{ color: "rgba(255,255,255,0.75)" }}>
                  Nascemos com uma tese: o setor de saúde brasileiro tem
                  mercados enormes, sistemas antiquados, e zero de dados
                  estruturados. Quem construir a infraestrutura correta vai
                  controlar o dado mais valioso do país.
                </p>
              </Reveal>
              <Reveal delay={0.19}>
                <p style={{ color: "#ffffff" }}>
                  Estamos construindo essa infraestrutura. Um produto de cada
                  vez.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Bloco 2 — CTA contato */}
        <div
          id="contato"
          className="mt-v6 border-t pt-v4"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="flex flex-col gap-v2 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p
                className="type-lg md:type-xl max-w-[24ch] balance"
                style={{ color: "#ffffff" }}
              >
                Se você acredita nessa tese, fale com a gente.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Button
                href="mailto:hello@quarky.cc"
                variant="secondary"
              >
                Entrar em contato <span aria-hidden="true">→</span>
              </Button>
            </Reveal>
          </div>

          {/* Coordenadas SP — flutuando à esquerda do CTA */}
          <Reveal delay={0.25}>
            <motion.div
              animate={
                reduce ? undefined : { opacity: [0.55, 0.85, 0.55] }
              }
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-v3 inline-flex items-center gap-2.5"
              style={{
                fontFamily:
                  "berkeleyMono, ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                {!reduce && (
                  <span
                    className="absolute inline-flex h-full w-full rounded-full"
                    style={{
                      background: "#ffffff",
                      opacity: 0.4,
                      animation:
                        "ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
                    }}
                  />
                )}
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: "#ffffff" }}
                />
              </span>
              <span>SÃO PAULO · BRASIL · 23.5°S 46.6°W</span>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
