# Quarky — site institucional

Site institucional da Quarky, health tech brasileira. Estética monocromática
extraída de [cursor.com](https://cursor.com) (snapshot em `/cursor`),
adaptada à identidade da Quarky (preto/cream, sem acento de cor).

## Stack

- **Next.js 14.2** (App Router, TypeScript)
- **Tailwind CSS 3.4** + variáveis CSS para tokens do design system
- **Framer Motion** para entradas em scroll (respeita `prefers-reduced-motion`)
- **Fontes locais** via `@font-face` em `app/fonts.css`
- 100% estático — `next build` gera HTML pré-renderizado

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm start        # serve build
```

## Decisões de arquitetura

- **App Router + Server Components por padrão.** Apenas `Header` e `Reveal`
  são `"use client"` (precisam de scroll listener / framer-motion).
- **Tokens em CSS vars, não em JS.** Tailwind referencia
  `var(--color-bg)` etc. Isso permite trocar tema (dark mode futuro)
  sem rebuild de classes.
- **Sem componentes prontos** (shadcn, MUI). Tudo custom em `components/ui`.
- **SEO via file conventions:** `app/icon.svg`, `app/robots.ts`,
  `app/sitemap.ts`. Metadata rica em `app/layout.tsx`.
- **Acessibilidade:** hierarquia semântica `<header>/<main>/<section>/<footer>`,
  `aria-labelledby` em cada seção, focus-visible com outline `#26251e`,
  contraste WCAG AA, `prefers-reduced-motion` totalmente respeitado.

## Design tokens — extraídos de `/cursor`

Snapshot bruto: `/Users/vitorgabriel/Desktop/cursor/cursor.com/pt-BR/home.html`.
Os tokens correspondem aos `--color-theme-*`, `--text-*` e `--leading-*` do
CSS gerado pela cursor.com (Tailwind v4 build).

### Cores (light, monocromática)

| Token              | Valor                       | Uso                                |
| ------------------ | --------------------------- | ---------------------------------- |
| `--color-bg`       | `#f7f7f4`                   | fundo do site                      |
| `--color-fg`       | `#26251e`                   | texto, ícones, botão primário      |
| `--color-fg-muted` | `rgba(38,37,30,0.62)`       | parágrafos secundários             |
| `--color-fg-faint` | `rgba(38,37,30,0.42)`       | aspas decorativas, hairlines       |
| `--color-card`     | `#f2f1ed`                   | seção destacada nível 1            |
| `--color-card-2`   | `#ebeae5`                   | seção destacada nível 2            |
| `--color-card-3`   | `#e6e5e0`                   | seção destacada nível 3            |
| `--color-card-4`   | `#e1e0db`                   | seção destacada nível 4            |
| `--color-border`   | `rgba(38,37,30,0.08)`       | divisores hairline                 |
| `--color-border-strong` | `rgba(38,37,30,0.18)`  | divisores fortes, botão secundário |

> **Acento de marca:** cursor.com usa laranja `#f54e00`. **Quarky removeu
> esse acento** por decisão editorial — paleta 100% monocromática para
> reforçar o tom institucional.

### Tipografia

| Família | Fonte usada       | Substituindo cursor.com |
| ------- | ----------------- | ----------------------- |
| Sans    | **CursorGothic**  | `CursorGothic` (custom) |
| Serif   | **EB Garamond**   | `EB Garamond` (idem)    |
| Mono    | **berkeleyMono**  | `berkeleyMono` (paga)   |

Carregadas como arquivos `.woff2` locais em `public/fonts/`, declaradas via
`@font-face` em `app/fonts.css` e importadas por `app/globals.css`.
Display: `swap`.

### Escala (em `tailwind.config.ts`)

```
xs    12px  · sm  14px  · base 16px  · md-sm 18px
md    22px  · md-lg 26px · lg 36px   · xl    52px
2xl   72px  · 3xl  96px
```

Pesos: 400 / 500 / 600 / 700.

### Raios

`2xs 2px · xs 4px · sm 6px · md 8px · lg 12px · xl 16px`.

### Ritmo vertical

`--section-y` é responsivo: `clamp(5rem, 9vw, 9rem)` entre seções.
Container: 1280px máx, padding lateral fluido `clamp(1.25rem, 4vw, 2.5rem)`.

## Como editar copy

Toda a copy está hardcoded nos componentes em `components/sections/`.
Cada seção é um arquivo: `Hero.tsx`, `Problema.tsx`,
`QuarkyHolding.tsx`, `Atlas.tsx`, `Visao.tsx`, `Sobre.tsx`.

- **Listas** (stats do Atlas, timeline da Visão, navegação do Header/Footer)
  ficam em
  arrays no topo do arquivo — edite ali.
- **Headings e parágrafos** ficam diretamente no JSX.
- **Logos** estão em `public/logos/` — substitua os SVGs mantendo o nome.
- **Metadata SEO** em `app/layout.tsx` (`metadata` export).

## Estrutura

```
app/
  layout.tsx       — metadata, viewport, layout raiz
  page.tsx         — composição das seções
  globals.css      — design tokens (CSS vars), reset, primitives
  fonts.css        — fontes locais via @font-face
  icon.svg         — favicon
  robots.ts        — robots.txt
  sitemap.ts       — sitemap.xml
components/
  ui/              — Header, Footer, Button, Eyebrow, Reveal
  sections/        — uma por seção do briefing
public/
  fonts/           — CursorGothic, EB Garamond, berkeleyMono
  logos/           — quarky.svg, atlas.svg
```

## Build atual

```
Route (app)                 Size      First Load JS
┌ ○ /                       46.9 kB        134 kB
├ ○ /_not-found             873 B           88 kB
├ ○ /icon.svg               0 B              0 B
├ ○ /robots.txt             0 B              0 B
└ ○ /sitemap.xml            0 B              0 B
```

Tudo `Static` (○) — pré-renderizado em build time, zero compute em runtime.
