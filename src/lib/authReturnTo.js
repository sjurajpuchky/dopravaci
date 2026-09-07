// Bezpečný návrat na cestu stejného webu po přihlášení.
export function safeReturnTo(fallback = "/") {
  if (typeof window === "undefined") return fallback;
  const raw = new URLSearchParams(window.location.search).get("returnTo");
  if (!raw) return fallback;
  try {
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    const path = url.pathname + url.search + url.hash;
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return fallback;
    return path;
  } catch {
    return fallback;
  }
}
