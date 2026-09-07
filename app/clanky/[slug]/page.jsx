import { cache } from "react";
import { notFound } from "next/navigation";
import ClanekDetail from "@/screens/ClanekDetail";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle } from "@/lib/server/serializers";
import { absoluteUrl, publicMetadata, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

const getArticle = cache(async (slug) => {
  const article = await prisma.article.findFirst({ where: { slug, published: true } });
  return article ? serializeArticle(article) : null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let article = null;
  try {
    article = await getArticle(slug);
  } catch {
    return publicMetadata({
      title: "Článek",
      description: "Články a rady Dopravaci.cz ke stěhování a přepravě.",
      path: `/clanky/${slug}`,
    });
  }

  if (!article) {
    return { title: "Článek nenalezen", robots: { index: false, follow: false } };
  }

  return {
    ...publicMetadata({
      title: article.title,
      description: article.excerpt || `Přečtěte si článek ${article.title} na ${SITE_NAME}.`,
      path: `/clanky/${article.slug}`,
      image: article.image_url || undefined,
      type: "article",
    }),
    openGraph: {
      ...publicMetadata({
        title: article.title,
        description: article.excerpt || `Přečtěte si článek ${article.title} na ${SITE_NAME}.`,
        path: `/clanky/${article.slug}`,
        image: article.image_url || undefined,
        type: "article",
      }).openGraph,
      publishedTime: new Date(article.created_date).toISOString(),
      modifiedTime: new Date(article.updated_date).toISOString(),
      authors: [article.author_name || SITE_NAME],
      tags: article.tag ? [article.tag] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticle(slug);
  } catch {
    article = null;
  }
  if (!article) notFound();

  const url = absoluteUrl(`/clanky/${article.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: article.image_url || undefined,
        datePublished: article.created_date,
        dateModified: article.updated_date,
        inLanguage: "cs-CZ",
        author: { "@type": "Person", name: article.author_name || SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Úvod", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Články", item: absoluteUrl("/clanky") },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <ClanekDetail initialItem={article} />
    </>
  );
}
