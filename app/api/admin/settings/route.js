import { requireAdmin } from "@/lib/server/auth";
import { fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeSettings } from "@/lib/server/serializers";

const FIELD_MAP = {
  logo_url: "logoUrl", brand_name: "brandName", brand_suffix: "brandSuffix", brand_tagline: "brandTagline",
  phone: "phone", phone_href: "phoneHref", email: "email", address: "address", ic: "ic", owner_name: "ownerName",
  hero_eyebrow: "heroEyebrow", hero_title: "heroTitle", hero_paragraph: "heroParagraph", hero_image_url: "heroImageUrl",
  hero_cta_primary: "heroCtaPrimary", hero_cta_secondary: "heroCtaSecondary",
  stat1_value: "stat1Value", stat1_label: "stat1Label", stat2_value: "stat2Value", stat2_label: "stat2Label",
  stat3_value: "stat3Value", stat3_label: "stat3Label", stat4_value: "stat4Value", stat4_label: "stat4Label",
  about_eyebrow: "aboutEyebrow", about_title: "aboutTitle", about_paragraph_1: "aboutParagraph1",
  about_paragraph_2: "aboutParagraph2", about_image_url: "aboutImageUrl", map_lat: "mapLat", map_lng: "mapLng", gallery: "gallery",
};

function settingsData(body) {
  const data = {};
  for (const [input, field] of Object.entries(FIELD_MAP)) {
    if (!(input in (body || {}))) continue;
    if (input === "gallery") data[field] = Array.isArray(body[input]) ? body[input].slice(0, 100) : [];
    else if (input === "map_lat" || input === "map_lng") data[field] = Number.isFinite(Number(body[input])) ? Number(body[input]) : null;
    else data[field] = typeof body[input] === "string" ? body[input].slice(0, 20000) || null : null;
  }
  return data;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  return ok(serializeSettings(await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } })));
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const data = settingsData(await readJson(request));
  const current = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  const settings = current
    ? await prisma.siteSettings.update({ where: { id: current.id }, data })
    : await prisma.siteSettings.create({ data });
  return ok(serializeSettings(settings));
}
