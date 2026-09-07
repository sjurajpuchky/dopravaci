import Home from "@/screens/Home";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE, publicMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Stěhování a doprava Praha | Dopravaci.cz",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "MovingCompany"],
        "@id": `${absoluteUrl("/")}#business`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        image: DEFAULT_SOCIAL_IMAGE,
        telephone: "+420732530802",
        email: "ivekodopravci@seznam.cz",
        identifier: { "@type": "PropertyValue", propertyID: "IČO", value: "76651282" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jiránkova 1137/1",
          postalCode: "163 00",
          addressLocality: "Praha-Řepy",
          addressCountry: "CZ",
        },
        geo: { "@type": "GeoCoordinates", latitude: 50.0765, longitude: 14.298 },
        areaServed: ["Praha", "Středočeský kraj", "Česká republika"],
        knowsLanguage: "cs",
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
        name: "Stěhování, rozvoz nábytku a nestandardní přeprava",
        provider: { "@id": `${absoluteUrl("/")}#business` },
        areaServed: ["Praha", "Středočeský kraj", "Česká republika"],
        serviceType: ["Stěhování", "Rozvoz nábytku", "Přeprava těžkých předmětů", "Vyklízení"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Home />
    </>
  );
}
