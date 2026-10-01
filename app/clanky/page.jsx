import ClankyPage from "@/screens/ClankyPage";
import { prisma } from "@/lib/server/prisma";
import { serializeArticle, serializeSettings } from "@/lib/server/serializers";
import { absoluteUrl, publicMetadata, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = publicMetadata({
  title: "Články o dopravě a přepravě",
  description:
    "Praktické informace o dopravě, plánování tras, manipulaci a bezpečné přepravě těžkých či nestandardních předmětů.",
  path: "/clanky",
});

const PAGE_SIZE = 24;

export default async function Page({ searchParams }) {
  let articles = [];
  let settings = null;
  let currentPage = Math.max(1, Number.parseInt((await searchParams)?.page || "1", 10) || 1);
  let totalPages = 1;
  try {
    const [count, settingsRow] = await Promise.all([
      prisma.article.count({ where: { published: true } }),
      prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
    ]);
    totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const rows = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    articles = rows.map(serializeArticle);
    settings = settingsRow ? serializeSettings(settingsRow) : null;
  } catch {
    // The page remains server-renderable with an empty state and default branding.
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Články o dopravě a přepravě",
        description: "Praktické informace o dopravě, manipulaci s náklady a nestandardní přepravě.",
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
      <ClankyPage items={articles} currentPage={currentPage} totalPages={totalPages} settings={settings} />
    </>
  );
}
