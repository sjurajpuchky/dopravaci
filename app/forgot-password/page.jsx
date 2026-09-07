import ForgotPassword from "@/screens/ForgotPassword";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Obnovení hesla", "Obnovení přístupu do portálu Dopravaci.cz.");

export default function Page() {
  return <ForgotPassword />;
}
