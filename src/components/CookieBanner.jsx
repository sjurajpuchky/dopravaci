"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import {
  COOKIE_CONSENT,
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readCookieConsent() === null);

    const openSettings = () => setVisible(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  function choose(value) {
    writeCookieConsent(value);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { value } }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#151719]/95 p-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur md:inset-x-4 md:bottom-4 md:rounded-[24px] md:p-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
        <div className="flex gap-4">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#d89a2b] text-[#151719] sm:flex">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="cookie-banner-title" className="font-display text-base font-extrabold text-white md:text-lg">
              Nastavení cookies
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-sm">
              Nezbytné cookies zajišťují bezpečné fungování webu. Analytické cookies zapneme jen s vaším
              souhlasem.
            </p>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => choose(COOKIE_CONSENT.REJECTED)}
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d89a2b] sm:px-5 sm:py-3 sm:text-sm"
          >
            Pouze nezbytné
          </button>
          <button
            type="button"
            onClick={() => choose(COOKIE_CONSENT.ACCEPTED)}
            className="rounded-xl bg-[#d89a2b] px-3 py-2.5 text-xs font-bold text-[#151719] transition-colors hover:bg-[#e7aa3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d89a2b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151719] sm:px-5 sm:py-3 sm:text-sm"
          >
            Povolit analytické
          </button>
        </div>
      </div>
    </section>
  );
}
