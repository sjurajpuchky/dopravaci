"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  COOKIE_CONSENT,
  COOKIE_CONSENT_EVENT,
  readCookieConsent,
} from "@/lib/cookie-consent";

const GOOGLE_TAG_ID_PATTERN = /^G-[A-Z0-9]+$/;

export default function GoogleAnalytics({ measurementId }) {
  const pathname = usePathname();
  const initialPageView = useRef(true);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const validMeasurementId = GOOGLE_TAG_ID_PATTERN.test(measurementId || "")
    ? measurementId
    : null;

  useEffect(() => {
    setAnalyticsAllowed(readCookieConsent() === COOKIE_CONSENT.ACCEPTED);

    const consentChanged = (event) => {
      const allowed = event.detail?.value === COOKIE_CONSENT.ACCEPTED;
      setAnalyticsAllowed(allowed);
      if (!allowed) window.gtag?.("consent", "update", { analytics_storage: "denied" });
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, consentChanged);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, consentChanged);
  }, []);

  useEffect(() => {
    if (!validMeasurementId || !analyticsAllowed) return;
    if (initialPageView.current) {
      initialPageView.current = false;
      return;
    }

    window.gtag?.("config", validMeasurementId, { page_path: pathname });
  }, [pathname, validMeasurementId, analyticsAllowed]);

  if (!validMeasurementId || !analyticsAllowed) return null;

  return (
    <>
      <Script
        id="google-tag-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', '${validMeasurementId}');`}
      </Script>
    </>
  );
}
