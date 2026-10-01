import Home from "@/screens/Home";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE, publicMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { prisma } from "@/lib/server/prisma";
import { serializeSettings } from "@/lib/server/serializers";

export const dynamic = "force-dynamic";

export const metadata = publicMetadata({
  title: "Nadrozměrná a velkotonážní přeprava | Dopravaci.cz",
  description: SITE_DESCRIPTION,
  path: "/",
  image: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
});

export default async function Page() {
  let settings = null;
  try {
    const row = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } });
    settings = row ? serializeSettings(row) : null;
  } catch {
    // Server defaults keep the complete page renderable during a temporary DB outage.
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${absoluteUrl("/")}#business`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        image: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
        telephone: "+420732530802",
        email: "info@dopravaci.cz",
        identifier: { "@type": "PropertyValue", propertyID: "IČO", value: "76651282" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jiránkova 1137/1",
          postalCode: "163 00",
          addressLocality: "Praha-Řepy",
          addressCountry: "CZ",
        },
        areaServed: ["Česká republika", "Evropa"],
        knowsLanguage: ["cs"],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: SITE_NAME,
        inLanguage: "cs-CZ",
        publisher: { "@id": `${absoluteUrl("/")}#business` },
      },
      {
        "@type": "Service",
        name: "Nadrozměrná a velkotonážní přeprava",
        provider: { "@id": `${absoluteUrl("/")}#business` },
        areaServed: ["Česká republika", "Evropa"],
        serviceType: [
          "Přeprava lopatek větrných elektráren",
          "Přeprava rour a potrubních dílů",
          "Přeprava velkotonážních nákladů",
          "Asistovaná přeprava",
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
      <Home settings={settings} />
    </>
  );
}
