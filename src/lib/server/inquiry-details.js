const cleanString = (value, maxLength) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const cleanNumber = (value, { integer = false, min = 0, max = 100000 } = {}) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return null;
  return integer ? Math.round(number) : number;
};

export function buildCalculatorDetails(body) {
  const items = Array.isArray(body?.items)
    ? body.items.slice(0, 100).map((item) => ({
        id: cleanString(item?.id, 64),
        label: cleanString(item?.label, 191),
        quantity: cleanNumber(item?.quantity, { integer: true, min: 1, max: 999 }),
        heavy: Boolean(item?.heavy),
      })).filter((item) => item.id && item.label && item.quantity)
    : [];

  return {
    property_type: cleanString(body?.property_type, 64) || null,
    property_type_label: cleanString(body?.property_type_label, 191) || null,
    items,
    other_items: cleanString(body?.other_items, 5000) || null,
    move_date: cleanString(body?.move_date, 32) || null,
    origin: {
      address: cleanString(body?.from_city, 191) || null,
      floor: cleanNumber(body?.from_floor, { integer: true, min: -10, max: 200 }),
      elevator: cleanString(body?.from_elevator, 32) || null,
    },
    destination: {
      address: cleanString(body?.to_city, 191) || null,
      floor: cleanNumber(body?.to_floor, { integer: true, min: -10, max: 200 }),
      elevator: cleanString(body?.to_elevator, 32) || null,
    },
    services: {
      assembly: Boolean(body?.assembly),
      clearance: Boolean(body?.clearance),
      extra_hours: cleanNumber(body?.extra_hours, { integer: true, min: 0, max: 100 }),
    },
  };
}
