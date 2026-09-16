export const COOKIE_CONSENT_KEY = "dopravaci_cookie_consent_v1";
export const COOKIE_CONSENT_EVENT = "dopravaci:cookie-consent";
export const COOKIE_SETTINGS_EVENT = "dopravaci:cookie-settings";

export const COOKIE_CONSENT = Object.freeze({
  ACCEPTED: "accepted",
  REJECTED: "rejected",
});

export function readCookieConsent(storage) {
  const target = storage || (typeof window !== "undefined" ? window.localStorage : null);
  if (!target) return null;

  try {
    const value = target.getItem(COOKIE_CONSENT_KEY);
    return Object.values(COOKIE_CONSENT).includes(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value, storage) {
  if (!Object.values(COOKIE_CONSENT).includes(value)) return false;
  const target = storage || (typeof window !== "undefined" ? window.localStorage : null);
  if (!target) return false;

  try {
    target.setItem(COOKIE_CONSENT_KEY, value);
    return true;
  } catch {
    return false;
  }
}
