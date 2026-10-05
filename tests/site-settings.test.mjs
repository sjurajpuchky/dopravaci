import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_HOMEPAGE_CONTENT, mergeHomepageContent } from "../src/lib/site-settings-defaults.js";

test("homepage CMS doplní chybějící sekce výchozím obsahem", () => {
  const content = mergeHomepageContent({
    services: { title: "Vlastní nadpis" },
    contact: { directLabel: "Dispečink" },
  });

  assert.equal(content.services.title, "Vlastní nadpis");
  assert.equal(content.services.eyebrow, DEFAULT_HOMEPAGE_CONTENT.services.eyebrow);
  assert.equal(content.recommendation.url, "https://www.stehuj.eu");
  assert.equal(content.services.items.length, 4);
  assert.equal(content.contact.directLabel, "Dispečink");
  assert.equal(content.process.steps.length, 3);
});

test("homepage CMS respektuje vlastní pořadí i prázdné seznamy", () => {
  const content = mergeHomepageContent({
    highlights: [],
    services: { items: [{ title: "Zakázková přeprava", text: "Popis" }] },
    process: { steps: [] },
  });

  assert.deepEqual(content.highlights, []);
  assert.equal(content.services.items[0].title, "Zakázková přeprava");
  assert.deepEqual(content.process.steps, []);
});
