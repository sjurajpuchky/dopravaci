import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata(
  "Administrace a portál dopravce",
  "Zabezpečená administrace a portál spolupracujících dopravců."
);

export default function AdminLayout({ children }) {
  return children;
}
