import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientBootstrap } from "@/components/ClientBootstrap";
import { CommandPalette } from "@/components/CommandPalette";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESC } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  keywords: [
    "unix timestamp", "epoch converter", "epoch time", "timestamp to date",
    "date to timestamp", "iso 8601 converter", "milliseconds to date",
    "unix time", "time zone converter", "current unix timestamp",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: { type: "website", siteName: SITE_NAME, url: SITE_URL, title: `${SITE_NAME} — ${SITE_TAGLINE}`, description: SITE_DESC },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — ${SITE_TAGLINE}`, description: SITE_DESC },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
  width: "device-width",
  initialScale: 1,
};

const orgLd = { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.svg` };
const siteLd = {
  "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL,
  potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` }, "query-input": "required name=search_term_string" },
};
const appLd = {
  "@context": "https://schema.org", "@type": "SoftwareApplication", name: SITE_NAME,
  applicationCategory: "DeveloperApplication", operatingSystem: "Any", url: SITE_URL, description: SITE_DESC,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `!function(){try{var p="system",r=localStorage.getItem("chrono");if(r){var s=JSON.parse(r).state;if(s&&s.theme)p=s.theme;}var d=p==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;document.documentElement.dataset.theme=d;}catch(e){document.documentElement.dataset.theme="light";}}();`;

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ClientBootstrap />
        {children}
        <CommandPalette />
        <div id="toast" className="toast-el">Copied</div>
        <JsonLd data={[orgLd, siteLd, appLd]} />
      </body>
    </html>
  );
}
