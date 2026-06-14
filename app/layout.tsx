import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientBootstrap } from "@/components/ClientBootstrap";
import { CommandPalette } from "@/components/CommandPalette";

export const metadata: Metadata = {
  metadataBase: new URL("https://chrono.local"),
  title: "Chrono — the developer's timestamp toolkit",
  description:
    "Paste any timestamp, date, JWT, JSON, or log line and instantly see every representation. Unix, ISO 8601, RFC, relative, code snippets, timezones — fast, keyboard-first, no ads.",
  applicationName: "Chrono",
  manifest: "/manifest.webmanifest",
  keywords: ["epoch", "unix timestamp", "converter", "ISO 8601", "developer tools", "JWT", "cron"],
  openGraph: { title: "Chrono — timestamp toolkit", description: "The fastest, cleanest timestamp tool for developers.", type: "website" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Set the resolved theme before first paint to avoid a flash.
  const themeScript = `!function(){try{var p="system",r=localStorage.getItem("chrono");if(r){var s=JSON.parse(r).state;if(s&&s.theme)p=s.theme;}var d=p==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;document.documentElement.dataset.theme=d;}catch(e){document.documentElement.dataset.theme="light";}}();`;

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ClientBootstrap />
        {children}
        <CommandPalette />
        <div id="toast" className="toast-el">Copied</div>
      </body>
    </html>
  );
}
