import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Home as HomeIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function NavLink({ l, onNavigate, className }) {
  const isRoute = l.href.startsWith("/");
  const cls = "font-bold text-brown hover:text-terracotta transition-colors";
  if (isRoute) {
    return (
      <Link href={l.href} onClick={onNavigate} className={className || cls}>
        {l.label}
      </Link>
    );
  }
  return (
    <a href={l.href} onClick={onNavigate} className={className || cls}>
      {l.label}
    </a>
  );
}

const links = [
  { label: "Firma", href: "#firma" },
  { label: "Kalkulačka", href: "/#kalkulacka" },
  { label: "Realizace", href: "/#realizace" },
  { label: "Galerie", href: "/#galerie" },
  { label: "Články", href: "/clanky" },
  { label: "Kontakt", href: "/#kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const s = useSiteSettings();

  const Logo = (
    <Link href="/" className="flex items-center gap-3 group">
      {s.logo_url ? (
        <img src={s.logo_url} alt={`${s.brand_name}${s.brand_suffix}`} className="h-9 w-auto" />
      ) : (
        <>
          <div
            className="w-11 h-11 bg-terracotta flex items-center justify-center"
            style={{ borderRadius: "15px 15px 15px 5px", boxShadow: "0 5px 0 rgba(107,79,58,0.12)" }}
          >
            <HomeIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div className="font-display font-extrabold text-brown text-lg tracking-tight">
              {s.brand_name}
              <span className="text-terracotta">{s.brand_suffix}</span>
            </div>
            <div className="font-mono text-[10px] text-brown-soft uppercase tracking-[0.2em]">{s.brand_tagline}</div>
          </div>
        </>
      )}
    </Link>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[rgba(255,248,237,0.8)] backdrop-blur-md border-b border-[rgba(107,79,58,0.16)]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {Logo}

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.href} l={l} />
          ))}
          <a href="/#kalkulacka" className="btn-warm text-sm uppercase tracking-wider">
            Poptat přepravu
          </a>
        </nav>

        <button
          className="md:hidden text-brown p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-[rgba(107,79,58,0.16)]">
          <nav className="flex flex-col p-5 gap-4">
            {links.map((l) => (
              <NavLink key={l.href} l={l} onNavigate={() => setOpen(false)} className="font-bold text-brown hover:text-terracotta" />
            ))}
            <a
              href="/#kalkulacka"
              onClick={() => setOpen(false)}
              className="btn-warm text-sm uppercase tracking-wider"
            >
              Poptat přepravu
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
