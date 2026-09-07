import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Loader2, Check, X, UserCheck } from "lucide-react";

const STATUS = {
  pending: { label: "Čeká", cls: "text-amber" },
  approved: { label: "Schválen", cls: "text-emerald-400" },
  rejected: { label: "Odmítnut", cls: "text-red-400" },
};

const approvalOf = (u) => u?.approval_status || u?.data?.approval_status || "pending";

export default function ApprovalsPanel() {
  const [users, setUsers] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = async () => setUsers(await api.users.list());
  useEffect(() => {
    load();
  }, []);

  const setStatus = async (u, status) => {
    setBusy(u.id);
    await api.users.update(u.id, { approval_status: status });
    setBusy(null);
    load();
  };

  if (!users) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber animate-spin" />
      </div>
    );
  }

  const order = { pending: 0, approved: 1, rejected: 2 };
  const sorted = [...users].sort(
    (a, b) => (order[approvalOf(a)] ?? 3) - (order[approvalOf(b)] ?? 3)
  );

  return (
    <div>
      <div className="font-mono text-xs text-steel-dim uppercase tracking-wider mb-4 flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-amber" /> Registrace subdodavatelů — schvalovací proces
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-steel-dim font-mono text-sm uppercase tracking-wider">
          Žádné registrace
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((u) => {
            const st = approvalOf(u);
            const isAdmin = u.role === "admin";
            return (
              <div
                key={u.id}
                className="bg-asphalt border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display font-bold text-brown">{u.email}</span>
                    {isAdmin && (
                      <span className="font-mono text-[10px] uppercase text-amber border border-amber/40 px-1.5">
                        Admin
                      </span>
                    )}
                    <span className={`font-mono text-xs uppercase ${STATUS[st]?.cls}`}>{STATUS[st]?.label}</span>
                  </div>
                  <div className="text-sm text-steel-dim mt-1">
                    {u.company && <span>{u.company} · </span>}
                    {u.phone && <span>{u.phone} · </span>}
                    Vytvořeno {new Date(u.created_date).toLocaleDateString("cs-CZ")}
                  </div>
                </div>
                {!isAdmin && (
                  <div className="flex gap-2 shrink-0">
                    {st !== "approved" && (
                      <button
                        onClick={() => setStatus(u, "approved")}
                        disabled={busy === u.id}
                        className="btn-industrial bg-amber text-asphalt font-display font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Schválit
                      </button>
                    )}
                    {st !== "rejected" && (
                      <button
                        onClick={() => setStatus(u, "rejected")}
                        disabled={busy === u.id}
                        className="border border-white/20 text-steel hover:text-red-400 hover:border-red-400/40 px-4 py-2 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> Odmítnout
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
