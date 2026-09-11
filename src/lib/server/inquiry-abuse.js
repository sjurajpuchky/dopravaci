const MIN_FORM_AGE_MS = 1_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const rateLimits = globalThis.__dopravaciInquiryRateLimits || new Map();
globalThis.__dopravaciInquiryRateLimits = rateLimits;

export function inspectInquirySubmission(body, now = Date.now()) {
  if (typeof body?.company_website === "string" && body.company_website.trim()) {
    return { ok: false, silent: true, reason: "honeypot" };
  }

  const startedAt = Number(body?.form_started_at);
  const age = now - startedAt;
  if (!Number.isFinite(startedAt) || age < MIN_FORM_AGE_MS || age > MAX_FORM_AGE_MS) {
    return { ok: false, silent: false, reason: "invalid-form-age" };
  }

  return { ok: true };
}

function clientAddress(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwarded ||
    "unknown"
  );
}

export function consumeInquiryRateLimit(request, now = Date.now()) {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [key, timestamps] of rateLimits) {
    const recent = timestamps.filter((timestamp) => timestamp > cutoff);
    if (recent.length > 0) rateLimits.set(key, recent);
    else rateLimits.delete(key);
  }

  const key = clientAddress(request);
  const timestamps = rateLimits.get(key) || [];
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false, retryAfterSeconds: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1_000) };
  }

  timestamps.push(now);
  rateLimits.set(key, timestamps);
  return { ok: true };
}

export function clearInquiryRateLimits() {
  rateLimits.clear();
}
