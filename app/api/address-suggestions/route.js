import { buildMapySuggestUrl, normalizeMapySuggestions } from "@/lib/server/address-suggestions";
import { fail, ok } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (query.length < 3 || query.length > 120) {
    return fail("Pro vyhledání adresy zadejte alespoň 3 znaky", 400);
  }

  const apiKey = process.env.MAPY_API_KEY?.trim();
  if (!apiKey) {
    console.error("Mapy.com API není nakonfigurované");
    return fail("Našeptávač adres není momentálně dostupný", 503);
  }

  try {
    const response = await fetch(buildMapySuggestUrl(query, apiKey), {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Mapy.com API vrátilo HTTP ${response.status}`);

    const payload = await response.json();
    return ok({ items: normalizeMapySuggestions(payload) });
  } catch (error) {
    console.error("Vyhledání adresy přes Mapy.com selhalo", error);
    return fail("Našeptávač adres není momentálně dostupný", 502);
  }
}
