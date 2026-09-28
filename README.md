# Quarky — Institutional Website

> **A custom-built institutional website focused on visual identity, performance, accessibility and responsive product storytelling.**

Quarky is a health-tech institutional website built with Next.js and a custom component system.

This project is part of my web and product-development portfolio and demonstrates that my work is not limited to backend systems, automations or AI infrastructure.

I also build polished customer-facing experiences.

---

## Project goals

The site was designed around a few constraints:

- strong visual identity;
- clean information hierarchy;
- responsive behavior;
- static performance;
- accessible interactions;
- custom components;
- controlled motion;
- SEO-friendly structure.

The result is a lightweight institutional experience rather than a generic component-library template.

---

## Frontend stack

- Next.js 14
- App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- CSS custom properties
- local font loading
- static generation

---

## Architecture

The application uses **Server Components by default**.

Client-side code is limited to components that actually need browser behavior, such as:

- navigation interaction;
- scroll behavior;
- animated reveals.

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── fonts.css
├── icon.svg
├── robots.ts
└── sitemap.ts

components/
├── ui/
└── sections/

public/
├── fonts/
└── logos/
```

The homepage is composed from isolated sections rather than one oversized page component.

---

## Design system

The project uses CSS custom properties as design tokens.

This keeps visual decisions centralized and makes future theme changes possible without scattering hard-coded values through the application.

The system includes tokens for:

- backgrounds;
- foreground text;
- muted text;
- cards;
- borders;
- spacing;
- typography;
- radii.

The visual direction is intentionally monochromatic and restrained.

---

## Custom components

The site avoids relying on a large UI framework.

Reusable primitives were created specifically for the project, including elements such as:

- Header;
- Footer;
- Button;
- Eyebrow;
- Reveal.

This keeps the design language consistent without importing an entire design system for a relatively focused website.

---

## Motion

Framer Motion is used selectively for scroll-entry transitions.

Animations are intentionally lightweight.

The implementation respects:

```text
prefers-reduced-motion
```

so visual polish does not come at the cost of accessibility.

---

## Accessibility

The project includes:

- semantic page landmarks;
- structured heading hierarchy;
- `aria-labelledby` where appropriate;
- keyboard focus states;
- WCAG-aware contrast;
- reduced-motion support.

Accessibility is treated as part of frontend quality rather than a cleanup task after design.

---

## SEO

The Next.js App Router conventions are used for:

- metadata;
- favicon;
- robots.txt;
- sitemap.xml.

The site is statically rendered, keeping the public experience fast and crawlable.

---

## Performance approach

The page is designed to minimize unnecessary runtime work.

Key choices include:

- static generation;
- Server Components by default;
- limited client boundaries;
- local assets;
- controlled animation usage;
- no large general-purpose component framework.

---

## Running locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

---

## Editing the site

Page sections are organized under:

```text
components/sections/
```

Shared UI primitives live under:

```text
components/ui/
```

SEO metadata is defined through the App Router structure.

---

## What this project demonstrates

Quarky demonstrates frontend work across:

- institutional websites;
- landing-page architecture;
- responsive interfaces;
- Next.js;
- custom design systems;
- accessibility;
- SEO;
- performance;
- animation;
- reusable React components.

It complements my backend and automation projects by showing end-to-end web delivery capability.

---

## Author

**João Mendes**  
AI, Automation & Software Technical Partner

Construo software, sites, automações, integrações e soluções com IA para empresas, agências e software houses.

GitHub: [@jvrm831720](https://github.com/jvrm831720)
