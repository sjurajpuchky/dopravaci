const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

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

export async function verifyRecaptcha(token) {
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

  const hostnames = allowedHostnames();
  const hostname = typeof payload.hostname === "string" ? payload.hostname.toLowerCase() : "";
  if (hostnames.size > 0 && !hostnames.has(hostname)) {
    return { ok: false, reason: "hostname-mismatch" };
  }

  return { ok: true };
}

export function recaptchaFailureMessage(reason) {
  switch (reason) {
    case "not-configured":
      return "Google reCAPTCHA není správně nakonfigurovaná. Zprávu nyní nelze odeslat.";
    case "verification-unavailable":
      return "Google reCAPTCHA je dočasně nedostupná. Zkuste zprávu odeslat znovu za chvíli.";
    case "hostname-mismatch":
      return "Google reCAPTCHA není správně nastavená pro tuto doménu. Zprávu nyní nelze odeslat.";
    case "missing-token":
    case "rejected":
    default:
      return "Ověření Google reCAPTCHA vypršelo nebo je neplatné. Zaškrtněte prosím ověření znovu.";
  }
}
