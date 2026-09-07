import { Suspense } from "react";
import ResetPassword from "@/screens/ResetPassword";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata("Nastavení nového hesla", "Nastavení nového hesla do portálu Dopravaci.cz.");

export default function Page() {
  return <Suspense fallback={null}><ResetPassword /></Suspense>;
}
