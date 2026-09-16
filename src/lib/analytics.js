import { COOKIE_CONSENT, readCookieConsent } from "./cookie-consent.js";

export function trackAnalyticsEvent(name, parameters = {}) {
  if (typeof window === "undefined") return false;
  if (readCookieConsent() !== COOKIE_CONSENT.ACCEPTED) return false;
  if (typeof window.gtag !== "function") return false;

  window.gtag("event", name, parameters);
  return true;
}
