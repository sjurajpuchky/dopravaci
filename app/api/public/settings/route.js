import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeSettings } from "@/lib/server/serializers";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  return ok(settings ? serializeSettings(settings) : null);
}
