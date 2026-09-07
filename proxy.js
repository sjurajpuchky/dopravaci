import { NextResponse } from "next/server";

const FALLBACK_ORIGIN = "https://dopravaci.cz";

function canonicalOrigin() {
  try {
    return new URL(process.env.APP_URL || FALLBACK_ORIGIN);
  } catch {
    return new URL(FALLBACK_ORIGIN);
  }
}

export function proxy(request) {
  const canonical = canonicalOrigin();
  const requestHost = (request.headers.get("host") || "").toLowerCase();
  const canonicalHost = canonical.host.toLowerCase();
  const bareHost = canonicalHost.replace(/^www\./, "");
  const acceptedHosts = new Set([bareHost, `www.${bareHost}`]);

  if (acceptedHosts.has(requestHost) && requestHost !== canonicalHost) {
    const url = request.nextUrl.clone();
    url.protocol = canonical.protocol;
    url.hostname = canonical.hostname;
    url.port = canonical.port;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
