import Home from "@/screens/Home";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE, publicMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { prisma } from "@/lib/server/prisma";
import { serializeSettings } from "@/lib/server/serializers";
import { DEFAULT_SETTINGS, mergeHomepageContent } from "@/lib/site-settings-defaults";

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

  const resolvedSettings = { ...DEFAULT_SETTINGS, ...settings };
  const homepageContent = mergeHomepageContent(resolvedSettings.homepage_content);
  const brand = `${resolvedSettings.brand_name}${resolvedSettings.brand_suffix}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${absoluteUrl("/")}#business`,
        name: brand,
        url: absoluteUrl("/"),
        image: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
        telephone: resolvedSettings.phone,
        email: resolvedSettings.email,
        identifier: { "@type": "PropertyValue", propertyID: "IČO", value: resolvedSettings.ic },
        address: {
          "@type": "PostalAddress",
          streetAddress: resolvedSettings.address,
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
        serviceType: homepageContent.services.items.map((service) => service.title),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Home settings={resolvedSettings} />
    </>
  );
}
