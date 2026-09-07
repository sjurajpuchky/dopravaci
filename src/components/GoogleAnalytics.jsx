"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GOOGLE_TAG_ID_PATTERN = /^G-[A-Z0-9]+$/;

export default function GoogleAnalytics({ measurementId }) {
  const pathname = usePathname();
  const initialPageView = useRef(true);
  const validMeasurementId = GOOGLE_TAG_ID_PATTERN.test(measurementId || "")
    ? measurementId
    : null;

  useEffect(() => {
    if (!validMeasurementId) return;
    if (initialPageView.current) {
      initialPageView.current = false;
      return;
    }

    window.gtag?.("config", validMeasurementId, { page_path: pathname });
  }, [pathname, validMeasurementId]);

  if (!validMeasurementId) return null;

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
