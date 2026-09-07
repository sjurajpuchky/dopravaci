import { requireAdmin } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle } from "@/lib/server/serializers";

function partialArticleData(body) {
  const data = {};
  const stringFields = {
    title: ["title", 255], slug: ["slug", 191], excerpt: ["excerpt", 20000],
    content: ["content", 2000000], image_url: ["imageUrl", 5000], tag: ["tag", 100],
    meta: ["meta", 20000], author_name: ["authorName", 191],
  };
  for (const [input, [field, limit]] of Object.entries(stringFields)) {
    if (input in (body || {})) data[field] = cleanString(body[input], limit) || (field === "content" || field === "title" || field === "slug" ? "" : null);
  }
  if ("slug" in data) data.slug = data.slug.toLowerCase();
  if ("gallery" in (body || {})) data.gallery = Array.isArray(body.gallery) ? body.gallery.filter((v) => typeof v === "string").slice(0, 100) : [];
  if ("videos" in (body || {})) data.videos = Array.isArray(body.videos) ? body.videos.filter((v) => typeof v === "string").slice(0, 50) : [];
  if ("published" in (body || {})) data.published = Boolean(body.published);
  return data;
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const { id } = await params;
  const data = partialArticleData(await readJson(request));
  if (!Object.keys(data).length) return fail("Nebyly předány žádné změny");
  try {
    const article = await prisma.article.update({ where: { id }, data });
    return ok(serializeArticle(article));
  } catch (error) {
    if (error?.code === "P2002") return fail("Tento slug již používá jiný článek", 409);
    return fail("Článek nebyl nalezen", 404);
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const { id } = await params;
  await prisma.article.deleteMany({ where: { id } });
  return ok({ success: true });
}
