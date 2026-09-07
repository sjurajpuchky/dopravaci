import { requireAdmin } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle } from "@/lib/server/serializers";

function articleData(body) {
  return {
    title: cleanString(body?.title, 255),
    slug: cleanString(body?.slug, 191).toLowerCase(),
    excerpt: cleanString(body?.excerpt, 20000) || null,
    content: typeof body?.content === "string" ? body.content.slice(0, 2000000) : "",
    imageUrl: cleanString(body?.image_url, 5000) || null,
    gallery: Array.isArray(body?.gallery) ? body.gallery.filter((v) => typeof v === "string").slice(0, 100) : [],
    videos: Array.isArray(body?.videos) ? body.videos.filter((v) => typeof v === "string").slice(0, 50) : [],
    tag: cleanString(body?.tag, 100) || null,
    meta: cleanString(body?.meta, 20000) || null,
    published: Boolean(body?.published),
    authorName: cleanString(body?.author_name, 191) || null,
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return ok(articles.map(serializeArticle));
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const data = articleData(await readJson(request));
  if (!data.title || !data.slug) return fail("Titulek a slug jsou povinné");
  try {
    const article = await prisma.article.create({ data });
    return ok(serializeArticle(article), { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") return fail("Tento slug již používá jiný článek", 409);
    throw error;
  }
}
