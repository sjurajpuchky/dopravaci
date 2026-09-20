import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { recaptchaFailureMessage, verifyRecaptcha } from "../src/lib/server/recaptcha.js";
import {
  clearInquiryRateLimits,
  consumeInquiryRateLimit,
  inspectInquirySubmission,
} from "../src/lib/server/inquiry-abuse.js";

const originalFetch = global.fetch;
const originalEnvironment = {
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  RECAPTCHA_ALLOWED_HOSTNAMES: process.env.RECAPTCHA_ALLOWED_HOSTNAMES,
};

beforeEach(() => {
  clearInquiryRateLimits();
  process.env.RECAPTCHA_SECRET_KEY = "test-secret";
  process.env.RECAPTCHA_ALLOWED_HOSTNAMES = "dopravaci.cz,www.dopravaci.cz";
});

afterEach(() => {
  global.fetch = originalFetch;
  for (const [name, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

function mockGoogleResponse(payload, status = 200) {
  global.fetch = async (_url, options) => {
    assert.equal(options.method, "POST");
    assert.equal(options.body.get("secret"), "test-secret");
    assert.equal(options.body.get("response"), "browser-token");
    return {
      ok: status >= 200 && status < 300,
      json: async () => payload,
    };
  };
}

test("accepts a valid v2 token for an allowed hostname", async () => {
  mockGoogleResponse({
    success: true,
    hostname: "dopravaci.cz",
  });

  const result = await verifyRecaptcha("browser-token");

  assert.deepEqual(result, { ok: true });
});

test("rejects a token declined by Google", async () => {
  mockGoogleResponse({
    success: false,
    "error-codes": ["timeout-or-duplicate"],
  });

  const result = await verifyRecaptcha("browser-token");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "rejected");
});

test("rejects a hostname outside the configured allowlist", async () => {
  mockGoogleResponse({
    success: true,
    hostname: "example.com",
  });

  const result = await verifyRecaptcha("browser-token");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "hostname-mismatch");
});

test("fails closed when the server secret is not configured", async () => {
  delete process.env.RECAPTCHA_SECRET_KEY;
  global.fetch = async () => assert.fail("Google must not be called without configuration");

  const result = await verifyRecaptcha("browser-token");

  assert.deepEqual(result, { ok: false, reason: "not-configured" });
});

test("rejects a missing checkbox token without contacting Google", async () => {
  global.fetch = async () => assert.fail("Google must not be called without a token");

  const result = await verifyRecaptcha("");

  assert.deepEqual(result, { ok: false, reason: "missing-token" });
});

test("returns a clear user message for every reCAPTCHA failure", () => {
  for (const reason of ["not-configured", "verification-unavailable", "hostname-mismatch", "missing-token", "rejected"]) {
    const message = recaptchaFailureMessage(reason);
    assert.match(message, /Google reCAPTCHA/);
    assert.ok(message.length > 30);
  }
});

test("rejects honeypot and implausibly fast submissions", () => {
  assert.deepEqual(
    inspectInquirySubmission({ company_website: "https://spam.example", form_started_at: 1 }, 5_000),
    { ok: false, silent: true, reason: "honeypot" },
  );
  assert.deepEqual(
    inspectInquirySubmission({ company_website: "", form_started_at: 4_500 }, 5_000),
    { ok: false, silent: false, reason: "invalid-form-age" },
  );
  assert.deepEqual(
    inspectInquirySubmission({ company_website: "", form_started_at: 3_000 }, 5_000),
    { ok: true },
  );
});

test("limits accepted submissions per client address", () => {
  const request = { headers: new Headers({ "x-real-ip": "192.0.2.1" }) };
  for (let index = 0; index < 5; index += 1) {
    assert.deepEqual(consumeInquiryRateLimit(request, 10_000 + index), { ok: true });
  }
  const blocked = consumeInquiryRateLimit(request, 10_100);
  assert.equal(blocked.ok, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});
