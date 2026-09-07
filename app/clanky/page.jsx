import ClankyPage from "@/screens/ClankyPage";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle } from "@/lib/server/serializers";
import { absoluteUrl, publicMetadata, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = publicMetadata({
  title: "Články a rady pro stěhování",
  description:
    "Praktické rady ke stěhování, rozvozu nábytku, vyklízení a bezpečné přepravě těžkých či nestandardních předmětů.",
  path: "/clanky",
});

export default async function Page() {
  let articles = [];
  try {
    const rows = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    articles = rows.map(serializeArticle);
  } catch {
    // The client retries through the public API if the database is temporarily unavailable.
    articles = null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Články a rady pro stěhování",
        description: "Praktické rady ke stěhování, rozvozu nábytku a nestandardní přepravě.",
        url: absoluteUrl("/clanky"),
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Úvod", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Články", item: absoluteUrl("/clanky") },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ClankyPage initialItems={articles} />
    </>
  );
}
