import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeGalleryItem } from "@/lib/server/serializers";

export async function GET() {
  const items = await prisma.galleryItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return ok(items.map(serializeGalleryItem));
}
