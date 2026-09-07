export const SITE_NAME = "Dopravaci.cz";
export const SITE_DESCRIPTION =
  "Stěhování, rozvoz nábytku a přeprava těžkých i nestandardních předmětů v Praze, okolí a po celé ČR.";
export const DEFAULT_SOCIAL_IMAGE =
  "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000000-bb95ebb960/1.jpeg?ph=9b5be8ccee";

function normalizeSiteUrl(value) {
  try {
    return new URL(value || "https://dopravaci.cz").origin;
  } catch {
    return "https://dopravaci.cz";
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.APP_URL);

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function publicMetadata({ title, description = SITE_DESCRIPTION, path = "/", image, type = "website" }) {
  const canonical = absoluteUrl(path);
  const socialImage = image || absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "cs_CZ",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function privateMetadata(title, description) {
  return {
    title,
    description,
    robots: { index: false, follow: false, nocache: true },
  };
}
