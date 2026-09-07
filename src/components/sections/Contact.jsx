"use client";

import React, { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Check, Loader2 } from "lucide-react";
import { api } from "@/api/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function ContactMap({ latitude, longitude, brandName, brandSuffix, address }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let map;
    let disposed = false;

    import("leaflet").then(({ default: L }) => {
      if (disposed) return;

      const amberIcon = L.divIcon({
        className: "",
        html: `<div style="width:24px;height:24px;background:#C75B39;border:3px solid #FFF8ED;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 0 0 2px rgba(199,91,57,0.4);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      map = L.map(container, {
        center: [latitude, longitude],
        zoom: 14,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const popup = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = `${brandName}${brandSuffix}`;
      popup.append(title, document.createElement("br"), document.createTextNode(address));

      L.marker([latitude, longitude], { icon: amberIcon }).addTo(map).bindPopup(popup);
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [address, brandName, brandSuffix, latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="img"
      aria-label={`Mapa sídla ${brandName}${brandSuffix}, ${address}`}
    />
  );
}

export default function Contact() {
  const s = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", cargo: "", message: "" });

  const contactItems = [
    { icon: Phone, label: "Telefon", value: s.phone, href: s.phone_href },
    { icon: Mail, label: "E-mail", value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: "Sídlo", value: s.address, href: null },
    { icon: Clock, label: "IČO", value: `${s.ic} · ${s.owner_name}`, href: null },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.inquiries.create({
        name: form.name,
        phone: form.phone,
        email: form.email,
        cargo: form.cargo,
        note: form.message,
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ name: "", phone: "", email: "", cargo: "", message: "" });
      }, 4000);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Odeslání selhalo");
    } finally {
      setSending(false);
    }
  };

  const field = (label, name, type = "text", placeholder = "") => (
    <div>
      <label className="font-mono text-xs uppercase tracking-wider text-brown-soft mb-2 block">{label}</label>
      <input
        type={type}
        required
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className="warm-input"
      />
    </div>
  );

  return (
    <section id="kontakt" className="relative bg-contact-warm py-20 md:py-32 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-peach font-mono text-xs uppercase tracking-[0.14em] mb-3">Kontakt</div>
        <h2 className="display-mega text-white text-4xl md:text-5xl text-balance max-w-[16ch] mb-10">
          Spojte se s dispečinkem.
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="softcard">
            <div className="grid sm:grid-cols-2 gap-3">
              {contactItems.map((c) => (
                <div key={c.label} className="bg-sand-light rounded-[18px] p-4">
                  <c.icon className="w-5 h-5 text-terracotta mb-2" aria-hidden="true" />
                  <div className="font-mono text-[11px] text-terracotta uppercase tracking-wider mb-1">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="text-brown font-bold hover:text-terracotta transition-colors break-words">{c.value}</a>
                  ) : (
                    <div className="text-brown font-bold break-words">{c.value}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[22px] overflow-hidden h-[220px] border border-[rgba(107,79,58,0.15)]">
              <ContactMap
                latitude={s.map_lat}
                longitude={s.map_lng}
                brandName={s.brand_name}
                brandSuffix={s.brand_suffix}
                address={s.address}
              />
            </div>
          </div>

          <div className="softcard">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-terracotta flex items-center justify-center mb-5 rounded-2xl">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h3 className="font-display font-bold text-brown text-2xl mb-2">Poptávka odeslána</h3>
                <p className="text-brown-soft">Dispečer vás kontaktuje do 24 hodin.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                {field("Jméno / Firma", "name", "text", "Jan Novák / ACME s.r.o.")}
                {field("Telefon", "phone", "tel", "+420 123 456 789")}
                {field("E-mail", "email", "email", "jan@firma.cz")}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-brown-soft mb-2 block">Typ nákladu</label>
                  <input
                    type="text"
                    required
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    placeholder="např. transformátor 48 t, 22 × 3,5 × 4 m"
                    className="warm-input"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-brown-soft mb-2 block">Zpráva</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Trasa, termín, specifické požadavky…"
                    className="warm-input resize-none"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 text-sm rounded-[13px]">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-warm w-full disabled:opacity-60"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {sending ? "Odesílám…" : "Odeslat poptávku"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
