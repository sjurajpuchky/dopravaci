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
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-4xl rounded-[24px] border border-[rgba(107,79,58,0.2)] bg-[#fff8ed] p-5 shadow-[0_18px_60px_rgba(68,47,31,0.24)] md:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-terracotta text-white sm:flex">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="cookie-banner-title" className="font-display text-lg font-extrabold text-[#493323]">
              Nastavení cookies
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#6b4f3a]">
              Nezbytné cookies používáme pro přihlášení a bezpečné fungování formulářů. S vaším souhlasem
              zapneme také Google Analytics, který nám pomáhá web zlepšovat.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose(COOKIE_CONSENT.REJECTED)}
            className="rounded-2xl border border-[rgba(107,79,58,0.28)] bg-white px-5 py-3 text-sm font-bold text-[#6b4f3a] transition-colors hover:bg-[#f8ead8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            Pouze nezbytné
          </button>
          <button
            type="button"
            onClick={() => choose(COOKIE_CONSENT.ACCEPTED)}
            className="rounded-2xl bg-terracotta px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
          >
            Povolit analytické
          </button>
        </div>
      </div>
    </section>
  );
}
