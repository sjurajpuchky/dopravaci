const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_MIN_SCORE = 0.5;

function minimumScore() {
  const rawValue = (process.env.RECAPTCHA_MIN_SCORE || "").trim();
  const configured = rawValue ? Number(rawValue) : Number.NaN;
  return Number.isFinite(configured) && configured >= 0 && configured <= 1
    ? configured
    : DEFAULT_MIN_SCORE;
}

function allowedHostnames() {
  return new Set(
    (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
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
