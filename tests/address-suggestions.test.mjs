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
      zip: "163 00",
      userData: { id: 12345 },
    }),
    {
      id: "12345",
      address: "Jiránkova 1137/1, 163 00 Praha-Řepy, Česko",
      title: "Jiránkova 1137/1",
      detail: "163 00 Praha-Řepy, Česko",
      postalCode: "163 00",
    },
  );
});

test("PSČ se v adrese neduplikuje, pokud ho lokalita už obsahuje", () => {
  const suggestion = normalizeMapySuggestion({
    name: "Masarykovo náměstí 1",
    location: "686 01 Uherské Hradiště, Česko",
    zip: "686 01",
  });

  assert.equal(suggestion.address, "Masarykovo náměstí 1, 686 01 Uherské Hradiště, Česko");
  assert.equal(suggestion.detail, "686 01 Uherské Hradiště, Česko");
  assert.equal(suggestion.postalCode, "686 01");
});

test("neplatné položky z externího API se zahodí", () => {
  assert.deepEqual(normalizeMapySuggestions({ items: [null, {}, { name: "  " }] }), []);
  assert.deepEqual(normalizeMapySuggestions({}), []);
});
