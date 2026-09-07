import Register from "@/screens/Register";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Registrace dopravce", "Registrace do portálu spolupracujících dopravců.");

export default function Page() {
  return <Register />;
}
