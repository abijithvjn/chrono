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
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ClientBootstrap />
        {children}
        <CommandPalette />
        <div id="toast" className="toast-el">Copied</div>
      </body>
    </html>
  );
}
