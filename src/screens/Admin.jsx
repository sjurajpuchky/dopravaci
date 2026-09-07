"use client";

import React, { useState } from "react";
import { Truck, LogOut, ClipboardList, UserCheck, Newspaper, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import InquiriesPanel from "@/components/admin/InquiriesPanel";
import ApprovalsPanel from "@/components/admin/ApprovalsPanel";
import ArticlesPanel from "@/components/admin/ArticlesPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import MyInquiries from "@/components/admin/MyInquiries";

export default function Admin() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const [tab, setTab] = useState(isAdmin ? "inquiries" : "mine");

  return (
    <div className="min-h-screen bg-asphalt-2 text-brown">
      <header className="bg-asphalt border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-amber flex items-center justify-center transition-transform group-hover:scale-105">
              <Truck className="w-4 h-4 text-asphalt" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="font-display font-extrabold text-brown tracking-tight">
                DOPRAVACI<span className="text-amber">.CZ</span>
              </div>
              <div className="font-mono text-[10px] text-steel-dim uppercase tracking-[0.2em]">
                {isAdmin ? "Administrace" : "Portál subdodavatele"}
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block font-mono text-xs text-steel-dim">{user?.email}</div>
            <button
              onClick={() => logout(false)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-steel hover:text-amber"
            >
              <LogOut className="w-4 h-4" /> Odhlásit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8">
        {isAdmin ? (
          <>
            <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto no-scrollbar">
              <TabButton active={tab === "inquiries"} onClick={() => setTab("inquiries")} icon={ClipboardList} label="Poptávky" />
              <TabButton active={tab === "approvals"} onClick={() => setTab("approvals")} icon={UserCheck} label="Registrace" />
              <TabButton active={tab === "articles"} onClick={() => setTab("articles")} icon={Newspaper} label="Články" />
              <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={Settings} label="Nastavení webu" />
            </div>
            {tab === "inquiries" ? (
              <InquiriesPanel />
            ) : tab === "approvals" ? (
              <ApprovalsPanel />
            ) : tab === "articles" ? (
              <ArticlesPanel />
            ) : (
              <SettingsPanel />
            )}
          </>
        ) : (
          <MyInquiries />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
        active ? "border-amber text-amber" : "border-transparent text-steel hover:text-black"
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}
