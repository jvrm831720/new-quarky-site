import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "#missao", label: "Missão" },
  { href: "#atlas", label: "Atlas" },
  { href: "#visao", label: "Visão" },
  { href: "#contato", label: "Contato" },
];

const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/quarkyco/",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
  },
  {
    href: "https://www.instagram.com/quarky.cc",
    label: "Instagram",
    icon: <InstagramIcon />,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-02 mt-auto">
      <div className="container-site pt-v6 pb-v3 grid grid-cols-1 gap-v3 md:grid-cols-12 md:items-end">
        {/* Left: brand */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <Link href="#top" aria-label="Quarky — voltar ao topo">
            <Image
              src="/logos/quarky.svg"
              alt="Quarky"
              width={457}
              height={99}
              className="h-[20px] w-auto logo-invert"
            />
          </Link>
          <div className="type-sm text-fg-60 leading-relaxed">
            Operações sediadas em São Paulo · Brasil
          </div>
        </div>

        {/* Center: nav */}
        <nav aria-label="Rodapé" className="md:col-span-4">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="type-sm text-fg-60 hover:text-fg transition-colors duration-150"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: contact + socials */}
        <div className="md:col-span-3 md:text-right flex flex-col gap-3 md:items-end">
          <a
            href="mailto:hello@quarky.cc"
            className="type-sm text-fg hover:text-fg-60 transition-colors duration-150"
          >
            hello@quarky.cc
          </a>
          <ul className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-02 text-fg-60 hover:text-fg hover:border-border-025 transition-colors duration-200"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border-02">
        <div className="container-site py-5">
          <p className="mono-cap">
            © 2026 Quarky. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 6.5h2.4v8.4H4V6.5Zm1.2-3.7a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM8 6.5h2.3v1.15h.03c.32-.6 1.1-1.23 2.27-1.23 2.43 0 2.88 1.6 2.88 3.68v4.8h-2.4v-4.25c0-1.02-.02-2.33-1.42-2.33-1.42 0-1.64 1.1-1.64 2.25v4.33H8V6.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="3.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.4" cy="4.6" r="0.7" fill="currentColor" />
    </svg>
  );
}
