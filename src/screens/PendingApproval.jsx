"use client";

import React from "react";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const handleLogout = () => logout(true);

  return (
    <div className="min-h-screen bg-asphalt flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber mx-auto flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-asphalt" strokeWidth={2.5} />
        </div>
        <h1 className="font-display font-extrabold text-white text-3xl mb-3">Čeká na schválení</h1>
        <p className="text-steel mb-2">
          Váš účet <span className="text-amber">{user?.email}</span> byl vytvořen a čeká na schválení administrátorem.
        </p>
        <p className="text-steel-dim text-sm mb-8">
          Po schválení získáte přístup k portálu poptávek a subdodávek.
        </p>
        <button
          onClick={handleLogout}
          className="btn-industrial border-2 border-white/20 text-white font-display font-bold uppercase tracking-wider px-6 py-3 inline-flex items-center gap-2 hover:border-amber hover:text-amber"
        >
          <LogOut className="w-4 h-4" /> Odhlásit se
        </button>
      </div>
    </div>
  );
}
