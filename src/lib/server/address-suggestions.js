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
  const title = name;
  const detail = [label && label !== name ? label : "", location]
    .filter(Boolean)
    .join(", ");
  const address = location && !name.toLocaleLowerCase("cs").includes(location.toLocaleLowerCase("cs"))
    ? `${name}, ${location}`
    : name;
  const sourceId = item.id ?? item.userData?.id ?? item.userData?.sourceId;

  return {
    id: sourceId == null ? `${address}-${index}` : String(sourceId),
    address,
    title,
    detail,
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
