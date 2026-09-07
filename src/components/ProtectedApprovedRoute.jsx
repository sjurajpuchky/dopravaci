"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const Fallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-asphalt">
    <div className="w-8 h-8 border-4 border-white/20 border-t-amber rounded-full animate-spin" />
  </div>
);

export default function ProtectedApprovedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth, authChecked, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isApproved = user?.approval_status === "approved";

  useEffect(() => {
    if (isLoadingAuth || !authChecked) return;
    if (!isAuthenticated) router.replace("/login");
    else if (!isAdmin && !isApproved) router.replace("/cekani-na-schvaleni");
  }, [authChecked, isAdmin, isApproved, isAuthenticated, isLoadingAuth, router]);

  if (isLoadingAuth || !authChecked || !isAuthenticated || (!isAdmin && !isApproved)) return <Fallback />;
  return children;
}
