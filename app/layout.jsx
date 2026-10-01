import "@/index.css";
import "leaflet/dist/leaflet.css";
import Script from "next/script";
import Providers from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { prisma } from "@/lib/server/prisma";
import { serializeSettings } from "@/lib/server/serializers";

const GOOGLE_TAG_ID = (process.env.GOOGLE_TAG_ID || "G-FN28LJKTQT").trim().toUpperCase();
const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Nadrozměrná a velkotonážní přeprava | Dopravaci.cz",
    template: "%s | Dopravaci.cz",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "nadrozměrná přeprava",
    "velkotonážní přeprava",
    "přeprava lopatek větrných elektráren",
    "přeprava rour",
    "přeprava trubek",
    "asistovaná přeprava",
    "přeprava těžkých strojů",
    "speciální doprava",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Nadrozměrná a speciální doprava",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/", languages: { "cs-CZ": "/" } },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "/",
    siteName: SITE_NAME,
    title: "Nadrozměrná a velkotonážní přeprava | Dopravaci.cz",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dopravaci.cz – nadrozměrná a velkotonážní přeprava" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadrozměrná a velkotonážní přeprava | Dopravaci.cz",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.SEZNAM_SITE_VERIFICATION
      ? { "seznam-wmt": process.env.SEZNAM_SITE_VERIFICATION }
      : undefined,
  },
};

export default async function RootLayout({ children }) {
  let initialSettings = null;
  try {
    const settings = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } });
    initialSettings = settings ? serializeSettings(settings) : null;
  } catch {
    // Defaults render on the server and the client retries through the public API.
  }

  return (
    <html lang="cs-CZ">
      <body>
        {RECAPTCHA_SITE_KEY ? (
          <Script
            id="google-recaptcha-v2"
            src="https://www.google.com/recaptcha/api.js?render=explicit&hl=cs"
            strategy="afterInteractive"
          />
        ) : null}
        <GoogleAnalytics measurementId={GOOGLE_TAG_ID} />
        <Providers initialSettings={initialSettings}>{children}</Providers>
      </body>
    </html>
  );
}
