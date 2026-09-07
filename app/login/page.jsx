import Login from "@/screens/Login";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Přihlášení", "Přihlášení do portálu Dopravaci.cz.");

export default function Page() {
  return <Login />;
}
