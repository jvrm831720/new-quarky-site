import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://quarky.com.br"),
  title: {
    default: "Quarky — The clinical intelligence company.",
    template: "%s · Quarky",
  },
  description:
    "Construímos a infraestrutura que transforma dados clínicos esquecidos em inteligência que muda diagnósticos. Saúde humana. Saúde animal. Um dataset.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Quarky",
    title: "Quarky — The clinical intelligence company.",
    description:
      "Construímos a infraestrutura que transforma dados clínicos esquecidos em inteligência que muda diagnósticos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quarky — The clinical intelligence company.",
    description:
      "Health technology company construindo a infraestrutura clínica do Brasil.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Script inline que roda ANTES da hidratação — evita flash do tema errado.
const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var t=s==='dark'||s==='light'?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <RevealObserver />
        <SpeedInsights />
      </body>
    </html>
  );
}
