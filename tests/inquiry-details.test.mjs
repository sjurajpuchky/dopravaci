import test from "node:test";
import assert from "node:assert/strict";
import { buildCalculatorDetails } from "../src/lib/server/inquiry-details.js";

test("ukládá úplný a očištěný detail kalkulačky", () => {
  const result = buildCalculatorDetails({
    property_type: "byt",
    property_type_label: "Byt",
    items: [
      { id: "postel", label: "Postel / matrace", quantity: 2, heavy: false },
      { id: "trezor", label: "Trezor / bojler", quantity: 1, heavy: true },
      { id: "invalid", label: "", quantity: 0 },
    ],
    other_items: "Krabice",
    move_date: "2026-10-01",
    from_city: "Praha 1",
    from_floor: 3,
    from_elevator: "6",
    to_city: "Brno",
    to_floor: 1,
    to_elevator: "none",
    assembly: true,
    clearance: false,
    extra_hours: 2,
  });

  assert.equal(result.property_type_label, "Byt");
  assert.equal(result.items.length, 2);
  assert.deepEqual(result.origin, { address: "Praha 1", floor: 3, elevator: "6" });
  assert.deepEqual(result.destination, { address: "Brno", floor: 1, elevator: "none" });
  assert.deepEqual(result.services, { assembly: true, clearance: false, extra_hours: 2 });
  assert.equal(result.move_date, "2026-10-01");
});

test("odmítá neplatné číselné hodnoty detailu", () => {
  const result = buildCalculatorDetails({ from_floor: 999, to_floor: "x", extra_hours: -1 });
  assert.equal(result.origin.floor, null);
  assert.equal(result.destination.floor, null);
  assert.equal(result.services.extra_hours, null);
});
