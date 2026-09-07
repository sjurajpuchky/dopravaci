import React from "react";
import Link from "next/link";
import { Phone, Mail, Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const s = useSiteSettings();

  return (
    <footer className="bg-footer-warm text-peach">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {s.logo_url ? (
                <img src={s.logo_url} alt={`${s.brand_name}${s.brand_suffix}`} className="h-9 w-auto" />
              ) : (
                <>
                  <div className="w-9 h-9 bg-terracotta flex items-center justify-center rounded-[12px]">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="leading-none">
                    <div className="font-display font-extrabold text-white text-lg tracking-tight">
                      {s.brand_name}
                      <span className="text-terracotta">{s.brand_suffix}</span>
                    </div>
                    <div className="font-mono text-[10px] text-peach uppercase tracking-[0.2em]">{s.brand_tagline}</div>
                  </div>
                </>
              )}
            </div>
            <p className="text-[rgba(255,226,184,0.8)] text-sm leading-relaxed max-w-md">
              Rozvoz nábytku a přeprava nestandardních předmětů v Praze a okolí.
              Sedačky, skříně, těžké bojlery i palety — vyzvedneme, dovezeme a smontujeme.
            </p>
          </div>

          <div>
            <div className="font-mono text-xs text-terracotta uppercase tracking-wider mb-4">Navigace</div>
            <ul className="space-y-2">
              {[
                { l: "O nás", h: "#firma" },
                { l: "Kalkulačka", h: "#kalkulacka" },
                { l: "Realizace", h: "#realizace" },
                { l: "Galerie", h: "#galerie" },
                { l: "Články & rady", h: "/clanky" },
                { l: "Kontakt", h: "#kontakt" },
              ].map((i) => (
                <li key={i.h}>
                  {i.h.startsWith("/") ? (
                    <Link href={i.h} className="text-peach text-sm hover:text-terracotta transition-colors">{i.l}</Link>
                  ) : (
                    <a href={i.h} className="text-peach text-sm hover:text-terracotta transition-colors">{i.l}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs text-terracotta uppercase tracking-wider mb-4">Pro dopravce</div>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="text-peach text-sm hover:text-terracotta transition-colors">Portál dopravců</Link>
              </li>
              <li>
                <Link href="/login" className="text-peach text-sm hover:text-terracotta transition-colors">Přihlášení</Link>
              </li>
              <li>
                <Link href="/register" className="text-peach text-sm hover:text-terracotta transition-colors">Registrace subdodavatele</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs text-terracotta uppercase tracking-wider mb-4">Spojení</div>
            <ul className="space-y-3">
              <li>
                <a href={s.phone_href} className="flex items-center gap-2 text-peach text-sm hover:text-terracotta transition-colors">
                  <Phone className="w-4 h-4" /> {s.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className="flex items-center gap-2 text-peach text-sm hover:text-terracotta transition-colors">
                  <Mail className="w-4 h-4" /> {s.email}
                </a>
              </li>
              <li className="text-peach text-sm">{s.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(255,226,184,0.15)] flex flex-col md:flex-row justify-between gap-4 font-mono text-xs text-[rgba(255,226,184,0.7)]">
          <div>
            © {new Date().getFullYear()} {s.brand_name}{s.brand_suffix} — s láskou ke stěhování{" "}
            <span className="animate-pulse-amber inline-block text-terracotta">♥</span>
          </div>
          <div className="flex gap-6">
            <Link href="/admin" className="hover:text-terracotta transition-colors">Administrace</Link>
            <a href="#" className="hover:text-terracotta transition-colors">Ochrana osobních údajů</a>
            <a href="#" className="hover:text-terracotta transition-colors">Podmínky</a>
          </div>
          <div>
            Stránky vyrobila{" "}
            <a href="https://vendortumise.cz" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
              VendorTumise s.r.o.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
