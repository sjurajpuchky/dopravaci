import assert from "node:assert/strict";
import test from "node:test";

import { trackAnalyticsEvent } from "../src/lib/analytics.js";
import { COOKIE_CONSENT, COOKIE_CONSENT_KEY } from "../src/lib/cookie-consent.js";

function browser(consent, events) {
  return {
    localStorage: {
      getItem(key) {
        assert.equal(key, COOKIE_CONSENT_KEY);
        return consent;
      },
    },
    gtag(...args) {
      events.push(args);
    },
  };
}

test("analytics event is sent after analytics consent", () => {
  const events = [];
  global.window = browser(COOKIE_CONSENT.ACCEPTED, events);

  assert.equal(trackAnalyticsEvent("contact_form_submitted", { form_name: "contact" }), true);
  assert.deepEqual(events, [["event", "contact_form_submitted", { form_name: "contact" }]]);

  delete global.window;
});

test("analytics event is blocked without analytics consent", () => {
  const events = [];
  global.window = browser(COOKIE_CONSENT.REJECTED, events);

  assert.equal(trackAnalyticsEvent("calculator_form_submitted"), false);
  assert.deepEqual(events, []);

  delete global.window;
});
