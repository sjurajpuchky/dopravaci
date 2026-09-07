import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Loader2, Phone, Mail, MapPin, Package, Wallet } from "lucide-react";

const STATUS = {
  new: { label: "Nová", cls: "bg-amber/20 text-amber" },
  taken: { label: "Přidělená", cls: "bg-blue-500/20 text-blue-300" },
  completed: { label: "Dokončená", cls: "bg-emerald-500/20 text-emerald-300" },
};

export default function MyInquiries() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.inquiries.list().then(setItems);
  }, []);

  if (!items) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="font-mono text-xs text-steel-dim uppercase tracking-wider mb-4">
        Moje přidělené poptávky
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-steel-dim font-mono text-sm uppercase tracking-wider">
          Zatím vám nebyla přidělena žádná poptávka
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-asphalt border border-white/10 p-5">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS[p.status]?.cls}`}>
                  {STATUS[p.status]?.label}
                </span>
                <span className="font-display font-bold text-brown">{p.name}</span>
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
              {p.commission > 0 && (
                <div className="text-amber font-mono text-sm mt-3 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> Provize: {p.commission} Kč
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
