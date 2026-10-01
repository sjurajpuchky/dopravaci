import { absoluteUrl } from "@/lib/seo";

export default function sitemap() {
  return [{ url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 }];
}
