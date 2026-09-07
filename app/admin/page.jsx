"use client";

import dynamic from "next/dynamic";
import ProtectedApprovedRoute from "@/components/ProtectedApprovedRoute";

const Admin = dynamic(() => import("@/screens/Admin"), { ssr: false });

export default function Page() {
  return <ProtectedApprovedRoute><Admin /></ProtectedApprovedRoute>;
}
