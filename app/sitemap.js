import { absoluteUrl } from "@/lib/seo";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const entries = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/clanky"), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    });
    entries.push(...articles.map((article) => ({
      url: absoluteUrl(`/clanky/${article.slug}`),
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.65,
    })));
  } catch {
    // Keep static public routes discoverable during a temporary DB outage.
  }

  return entries;
}
