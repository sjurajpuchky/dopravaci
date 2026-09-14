const MAPY_SUGGEST_ENDPOINT = "https://api.mapy.cz/v1/suggest";

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMapySuggestion(item, index = 0) {
  if (!item || typeof item !== "object") return null;

  const name = text(item.name) || text(item.label);
  if (!name) return null;

  const label = text(item.label);
  const location = text(item.location);
  const postalCode = text(item.zip);
  const title = name;
  const locality = postalCode && !location.includes(postalCode)
    ? [postalCode, location].filter(Boolean).join(" ")
    : location || postalCode;
  const detail = [label && label !== name ? label : "", locality]
    .filter(Boolean)
    .join(" · ");
  const address = locality && !name.toLocaleLowerCase("cs").includes(locality.toLocaleLowerCase("cs"))
    ? `${name}, ${locality}`
    : name;
  const sourceId = item.id ?? item.userData?.id ?? item.userData?.sourceId;

  return {
    id: sourceId == null ? `${address}-${index}` : String(sourceId),
    address,
    title,
    detail,
    postalCode,
  };
}

export function normalizeMapySuggestions(payload) {
  if (!Array.isArray(payload?.items)) return [];
  return payload.items
    .map(normalizeMapySuggestion)
    .filter(Boolean);
}

export function buildMapySuggestUrl(query, apiKey) {
  const url = new URL(MAPY_SUGGEST_ENDPOINT);
  url.searchParams.set("lang", "cs");
  url.searchParams.set("limit", "6");
  url.searchParams.set("type", "regional.address");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("query", query);
  return url;
}
