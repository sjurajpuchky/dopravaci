import "@/index.css";
import "leaflet/dist/leaflet.css";
import Script from "next/script";
import Providers from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const GOOGLE_TAG_ID = (process.env.GOOGLE_TAG_ID || "G-FN28LJKTQT").trim().toUpperCase();
const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Stěhování a doprava Praha | Dopravaci.cz",
    template: "%s | Dopravaci.cz",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "stěhování Praha",
    "stěhovací firma Praha",
    "rozvoz nábytku Praha",
    "přeprava těžkých předmětů",
    "přeprava objemného zboží",
    "vyklízení Praha",
    "montáž nábytku",
    "paletová doprava",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Stěhování a doprava",
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
    title: "Stěhování a doprava Praha | Dopravaci.cz",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dopravaci.cz – stěhování a doprava v Praze" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stěhování a doprava Praha | Dopravaci.cz",
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

export default function RootLayout({ children }) {
  return (
    <html lang="cs-CZ">
      <body>
        {RECAPTCHA_SITE_KEY ? (
          <Script
            id="google-recaptcha-v3"
            src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`}
            strategy="afterInteractive"
          />
        ) : null}
        <GoogleAnalytics measurementId={GOOGLE_TAG_ID} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
