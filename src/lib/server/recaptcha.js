const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_MIN_SCORE = 0.7;

function minimumScore() {
  const rawValue = (process.env.RECAPTCHA_MIN_SCORE || "").trim();
  const configured = rawValue ? Number(rawValue) : Number.NaN;
  return Number.isFinite(configured) && configured >= 0 && configured <= 1
    ? configured
    : DEFAULT_MIN_SCORE;
}

function allowedHostnames() {
  const hostnames = new Set(
    (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
  try {
    const appHostname = new URL(process.env.APP_URL || "").hostname.toLowerCase();
    if (appHostname) hostnames.add(appHostname);
  } catch {
    // An invalid APP_URL is handled by the rest of the application configuration.
  }
  return hostnames;
}

export async function verifyRecaptcha(token, expectedAction) {
  const secret = (process.env.RECAPTCHA_SECRET_KEY || "").trim();
  if (!secret) return { ok: false, reason: "not-configured" };
  if (typeof token !== "string" || !token.trim()) return { ok: false, reason: "missing-token" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  let payload;
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token.trim() }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, reason: "verification-unavailable" };
    payload = await response.json();
  } catch {
    return { ok: false, reason: "verification-unavailable" };
  } finally {
    clearTimeout(timeout);
  }

  if (payload?.success !== true) return { ok: false, reason: "rejected" };
  if (payload.action !== expectedAction) return { ok: false, reason: "action-mismatch" };

  const score = Number(payload.score);
  if (!Number.isFinite(score) || score < minimumScore()) {
    return { ok: false, reason: "low-score", score: Number.isFinite(score) ? score : null };
  }

  const hostnames = allowedHostnames();
  const hostname = typeof payload.hostname === "string" ? payload.hostname.toLowerCase() : "";
  if (hostnames.size > 0 && !hostnames.has(hostname)) {
    return { ok: false, reason: "hostname-mismatch" };
  }

  return { ok: true, score };
}

export function recaptchaFailureMessage(reason) {
  switch (reason) {
    case "not-configured":
      return "Google reCAPTCHA není správně nakonfigurovaná. Zprávu nyní nelze odeslat.";
    case "verification-unavailable":
      return "Google reCAPTCHA je dočasně nedostupná. Zkuste zprávu odeslat znovu za chvíli.";
    case "low-score":
      return "Google reCAPTCHA vyhodnotila odeslání jako podezřelé. Počkejte chvíli a zkuste to znovu.";
    case "hostname-mismatch":
      return "Google reCAPTCHA není správně nastavená pro tuto doménu. Zprávu nyní nelze odeslat.";
    case "missing-token":
    case "rejected":
    case "action-mismatch":
    default:
      return "Ověření Google reCAPTCHA vypršelo nebo je neplatné. Zkuste zprávu odeslat znovu.";
  }
}
