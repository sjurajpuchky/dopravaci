import PendingApproval from "@/screens/PendingApproval";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Registrace čeká na schválení", "Stav registrace do portálu dopravců.");

export default function Page() {
  return <PendingApproval />;
}
