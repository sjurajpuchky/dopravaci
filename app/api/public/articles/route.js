import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle } from "@/lib/server/serializers";

export async function GET() {
  const articles = await prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 500 });
  return ok(articles.map(serializeArticle));
}
