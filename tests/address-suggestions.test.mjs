import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMapySuggestUrl,
  normalizeMapySuggestion,
  normalizeMapySuggestions,
} from "../src/lib/server/address-suggestions.js";

test("Mapy.com dotaz vyžaduje pouze adresní výsledky", () => {
  const url = buildMapySuggestUrl("Jiránkova 1, Praha", "test-key");

  assert.equal(url.origin, "https://api.mapy.cz");
  assert.equal(url.pathname, "/v1/suggest");
  assert.equal(url.searchParams.get("query"), "Jiránkova 1, Praha");
  assert.equal(url.searchParams.get("type"), "regional.address");
  assert.equal(url.searchParams.get("lang"), "cs");
  assert.equal(url.searchParams.get("limit"), "6");
  assert.equal(url.searchParams.get("apikey"), "test-key");
});

test("výsledek se převede na jednoznačnou adresu pro formulář", () => {
  assert.deepEqual(
    normalizeMapySuggestion({
      name: "Jiránkova 1137/1",
      label: "Jiránkova 1137/1",
      location: "Praha-Řepy, Česko",
      userData: { id: 12345 },
    }),
    {
      id: "12345",
      address: "Jiránkova 1137/1, Praha-Řepy, Česko",
      title: "Jiránkova 1137/1",
      detail: "Praha-Řepy, Česko",
    },
  );
});

test("neplatné položky z externího API se zahodí", () => {
  assert.deepEqual(normalizeMapySuggestions({ items: [null, {}, { name: "  " }] }), []);
  assert.deepEqual(normalizeMapySuggestions({}), []);
});
