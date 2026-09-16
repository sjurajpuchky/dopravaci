import assert from "node:assert/strict";
import test from "node:test";

import {
  COOKIE_CONSENT,
  COOKIE_CONSENT_KEY,
  readCookieConsent,
  writeCookieConsent,
} from "../src/lib/cookie-consent.js";

function storage(initialValue = null) {
  let value = initialValue;
  return {
    getItem(key) {
      assert.equal(key, COOKIE_CONSENT_KEY);
      return value;
    },
    setItem(key, nextValue) {
      assert.equal(key, COOKIE_CONSENT_KEY);
      value = nextValue;
    },
  };
}

test("cookie consent accepts only known values", () => {
  const target = storage();

  assert.equal(writeCookieConsent(COOKIE_CONSENT.ACCEPTED, target), true);
  assert.equal(readCookieConsent(target), COOKIE_CONSENT.ACCEPTED);
  assert.equal(writeCookieConsent("marketing", target), false);
  assert.equal(readCookieConsent(target), COOKIE_CONSENT.ACCEPTED);
});

test("unknown or missing cookie consent is treated as undecided", () => {
  assert.equal(readCookieConsent(storage()), null);
  assert.equal(readCookieConsent(storage("unknown")), null);
});
