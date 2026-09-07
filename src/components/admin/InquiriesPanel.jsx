import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Loader2, Trash2, CheckCircle2, UserPlus, Phone, Mail, MapPin, Package } from "lucide-react";

const STATUS = {
  new: { label: "Nová", cls: "bg-amber/20 text-amber" },
  taken: { label: "Přidělená", cls: "bg-blue-500/20 text-blue-300" },
  completed: { label: "Dokončená", cls: "bg-emerald-500/20 text-emerald-300" },
};

const approvalOf = (u) => u?.approval_status || u?.data?.approval_status || "pending";

export default function InquiriesPanel() {
  const [items, setItems] = useState(null);
  const [subs, setSubs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [assignFor, setAssignFor] = useState(null);
  const [assign, setAssign] = useState({ taken_by_id: "", commission: "" });

  const load = async () => {
    const list = await api.inquiries.list();
    setItems(list);
    const users = await api.users.list();
    setSubs(users.filter((u) => approvalOf(u) === "approved" && u.role !== "admin"));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = (items || []).filter((i) => filter === "all" || i.status === filter);

  const doAssign = async () => {
    if (!assign.taken_by_id) return;
    setBusy(true);
    const sub = subs.find((s) => s.id === assign.taken_by_id);
    await api.inquiries.update(assignFor.id, {
      taken_by_id: assign.taken_by_id,
      taken_by_name: sub?.email || sub?.full_name || "",
      commission: Number(assign.commission) || 0,
      status: "taken",
    });
    setBusy(false);
    setAssignFor(null);
    setAssign({ taken_by_id: "", commission: "" });
    load();
  };

  const complete = async (id) => {
    await api.inquiries.update(id, { status: "completed" });
    load();
  };

  const remove = async (id) => {
    if (window.confirm("Smazat poptávku?")) {
      await api.inquiries.delete(id);
      load();
    }
  };

  if (!items) return <Loading />;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "new", "taken", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border ${
              filter === f ? "bg-amber text-asphalt border-amber" : "border-white/15 text-steel hover:text-black"
            }`}
          >
            {f === "all" ? "Vše" : STATUS[f]?.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty text="Žádné poptávky" />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-asphalt border border-white/10 p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS[p.status]?.cls}`}>
                      {STATUS[p.status]?.label}
                    </span>
                    <span className="font-display font-bold text-brown">{p.name}</span>
                    <span className="font-mono text-[10px] text-steel-dim uppercase">
                      {new Date(p.created_date).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-steel">
                    <a href={`tel:${p.phone}`} className="flex items-center gap-1.5 hover:text-amber">
                      <Phone className="w-3.5 h-3.5" /> {p.phone}
                    </a>
                    {p.email && (
                      <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 hover:text-amber">
                        <Mail className="w-3.5 h-3.5" /> {p.email}
                      </a>
                    )}
                    {(p.from_city || p.to_city) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {p.from_city || "—"} → {p.to_city || "—"}
                      </span>
                    )}
                    {p.distance_km > 0 && <span>{p.distance_km} km</span>}
                    {p.volume > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> {p.volume} m³
                      </span>
                    )}
                  </div>
                  {p.cargo && <div className="text-sm text-steel-dim mt-2">Náklad: {p.cargo}</div>}
                  {p.note && <div className="text-sm text-steel-dim mt-1">{p.note}</div>}
                  {p.taken_by_name && (
                    <div className="text-xs text-amber mt-2 font-mono">
                      Přiděleno: {p.taken_by_name}
                      {p.commission ? ` · provize ${p.commission} Kč` : ""}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {p.status === "new" && (
                    <button
                      onClick={() => {
                        setAssignFor(p);
                        setAssign({ taken_by_id: "", commission: "" });
                      }}
                      className="btn-industrial bg-amber text-asphalt font-display font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" /> Přidělit
                    </button>
                  )}
                  {p.status === "taken" && (
                    <button
                      onClick={() => complete(p.id)}
                      className="btn-industrial border border-white/20 text-brown font-display font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5 hover:border-amber hover:text-amber"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Dokončit
                    </button>
                  )}
                  <button
                    onClick={() => remove(p.id)}
                    className="border border-white/15 text-steel hover:text-red-400 hover:border-red-400/40 px-3 py-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {assignFor && (
        <Modal onClose={() => setAssignFor(null)} title={`Přidělit poptávku — ${assignFor.name}`}>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-steel mb-2 block">Subdodavatel</label>
              <select
                value={assign.taken_by_id}
                onChange={(e) => setAssign({ ...assign, taken_by_id: e.target.value })}
                className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-black"
              >
                <option value="">— vyberte —</option>
                {subs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.email}
                    {s.company ? ` · ${s.company}` : ""}
                  </option>
                ))}
              </select>
              {subs.length === 0 && (
                <p className="text-steel-dim text-xs mt-2">
                  Nejsou žádní schválení subdodavatelé. Nejprve schvalte registraci v záložce Registrace.
                </p>
              )}
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-steel mb-2 block">Provize (Kč)</label>
              <input
                type="number"
                min="0"
                value={assign.commission}
                onChange={(e) => setAssign({ ...assign, commission: e.target.value })}
                className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-black"
              />
            </div>
            <button
              onClick={doAssign}
              disabled={busy || !assign.taken_by_id}
              className="btn-industrial w-full bg-amber text-asphalt font-display font-bold uppercase tracking-wider px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {busy ? "Přiděluji…" : "Potvrdit přidělení"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 text-amber animate-spin" />
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-center py-20 text-steel-dim font-mono text-sm uppercase tracking-wider">{text}</div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-5" onClick={onClose}>
      <div className="bg-asphalt border border-white/15 p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-brown">{title}</h3>
          <button onClick={onClose} className="text-steel hover:text-brown text-2xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
