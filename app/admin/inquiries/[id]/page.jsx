"use client";

import dynamic from "next/dynamic";
import ProtectedApprovedRoute from "@/components/ProtectedApprovedRoute";

const InquiryDetail = dynamic(() => import("@/screens/InquiryDetail"), { ssr: false });

export default function Page() {
  return <ProtectedApprovedRoute><InquiryDetail /></ProtectedApprovedRoute>;
}
