import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { verifyRecaptcha } from "../src/lib/server/recaptcha.js";

const originalFetch = global.fetch;
const originalEnvironment = {
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  RECAPTCHA_MIN_SCORE: process.env.RECAPTCHA_MIN_SCORE,
  RECAPTCHA_ALLOWED_HOSTNAMES: process.env.RECAPTCHA_ALLOWED_HOSTNAMES,
};

beforeEach(() => {
  process.env.RECAPTCHA_SECRET_KEY = "test-secret";
  process.env.RECAPTCHA_MIN_SCORE = "0.5";
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

test("accepts a matching action, score and hostname", async () => {
  mockGoogleResponse({
    success: true,
    action: "inquiry_contact",
    score: 0.9,
    hostname: "dopravaci.cz",
  });

  const result = await verifyRecaptcha("browser-token", "inquiry_contact");

  assert.deepEqual(result, { ok: true, score: 0.9 });
});

test("rejects a token issued for a different form action", async () => {
  mockGoogleResponse({
    success: true,
    action: "inquiry_contact",
    score: 0.9,
    hostname: "dopravaci.cz",
  });

  const result = await verifyRecaptcha("browser-token", "inquiry_calculator");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "action-mismatch");
});

test("rejects a low score", async () => {
  mockGoogleResponse({
    success: true,
    action: "inquiry_calculator",
    score: 0.49,
    hostname: "dopravaci.cz",
  });

  const result = await verifyRecaptcha("browser-token", "inquiry_calculator");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "low-score");
  assert.equal(result.score, 0.49);
});

test("rejects a hostname outside the configured allowlist", async () => {
  mockGoogleResponse({
    success: true,
    action: "inquiry_contact",
    score: 0.9,
    hostname: "example.com",
  });

  const result = await verifyRecaptcha("browser-token", "inquiry_contact");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "hostname-mismatch");
});

test("fails closed when the server secret is not configured", async () => {
  delete process.env.RECAPTCHA_SECRET_KEY;
  global.fetch = async () => assert.fail("Google must not be called without configuration");

  const result = await verifyRecaptcha("browser-token", "inquiry_contact");

  assert.deepEqual(result, { ok: false, reason: "not-configured" });
});
