import { fail, ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle } from "@/lib/server/serializers";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({ where: { slug, published: true } });
  if (!article) return fail("Článek nebyl nalezen", 404);
  return ok(serializeArticle(article));
}
