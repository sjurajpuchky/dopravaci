import Link from "next/link";
import { Phone, Truck } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/site-settings-defaults";

export function ArticleHeader({ settings = null }) {
  const site = { ...DEFAULT_SETTINGS, ...settings };
  const brand = `${site.brand_name}${site.brand_suffix}`;

  return (
    <header className="border-b border-white/10 bg-[#0b1218] text-white">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label={`${brand} – úvod`}>
          {site.logo_url ? (
            <img src={site.logo_url} alt="" className="h-10 w-10 rounded-sm object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#f5a623] text-[#101820]">
              <Truck className="h-5 w-5" strokeWidth={2.4} />
            </span>
          )}
          <span>
            <span className="block text-lg font-black tracking-[-0.03em]">{brand}</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">{site.brand_tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex" aria-label="Hlavní navigace">
          <Link href="/" className="transition-colors hover:text-white">Úvod</Link>
          <Link href="/clanky" className="text-white">Články</Link>
          <Link href="/#kontakt" className="transition-colors hover:text-white">Kontakt</Link>
        </nav>

        <a href={site.phone_href} className="transport-nav-cta">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">{site.phone}</span>
          <span className="sm:hidden">Zavolat</span>
        </a>
      </div>
    </header>
  );
}

export function ArticleFooter({ settings = null }) {
  const site = { ...DEFAULT_SETTINGS, ...settings };
  const brand = `${site.brand_name}${site.brand_suffix}`;

  return (
    <footer className="bg-[#0b1218] text-white/55">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10">
        <div className="font-bold text-white">{brand}</div>
        <nav className="flex gap-6" aria-label="Navigace v patičce">
          <Link href="/" className="transition-colors hover:text-white">Úvod</Link>
          <Link href="/clanky" className="transition-colors hover:text-white">Články</Link>
          <Link href="/#kontakt" className="transition-colors hover:text-white">Kontakt</Link>
        </nav>
        <div>© {new Date().getFullYear()} Všechna práva vyhrazena</div>
      </div>
    </footer>
  );
}
