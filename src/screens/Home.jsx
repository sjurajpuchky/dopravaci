import {
  ArrowRight,
  Factory,
  Mail,
  MapPin,
  PackageOpen,
  Phone,
  Route,
  ShieldCheck,
  Truck,
  Weight,
  Wind,
} from "lucide-react";
import { DEFAULT_SETTINGS, mergeHomepageContent } from "@/lib/site-settings-defaults";

const serviceIcons = [Wind, PackageOpen, Weight, ShieldCheck];
const highlightIcons = [Route, ShieldCheck, Factory];

export default function Home({ settings = null }) {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  const content = mergeHomepageContent(s.homepage_content);
  const brand = `${s.brand_name}${s.brand_suffix}`;

  return (
    <main className="transport-site min-h-screen bg-[#eef1f3] text-[#101820]">
      <header className="absolute inset-x-0 top-0 z-30 border-b border-white/15 bg-[#0b1218]/60 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <a href="#top" className="flex items-center gap-3 text-white" aria-label={`${brand} – úvod`}>
            {s.logo_url ? (
              <img src={s.logo_url} alt="" className="h-10 w-10 rounded-sm object-contain" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#f5a623] text-[#101820]">
                <Truck className="h-5 w-5" strokeWidth={2.4} />
              </span>
            )}
            <span>
              <span className="block text-lg font-black tracking-[-0.03em]">{brand}</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-white/60">{s.brand_tagline}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/80 md:flex" aria-label="Hlavní navigace">
            <a href="#sluzby" className="transition-colors hover:text-white">{content.navigation.services}</a>
            <a href="#postup" className="transition-colors hover:text-white">{content.navigation.process}</a>
            <a href="#kontakt" className="transition-colors hover:text-white">{content.navigation.contact}</a>
          </nav>

          <a href={s.phone_href} className="transport-nav-cta">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{s.phone}</span>
            <span className="sm:hidden">Zavolat</span>
          </a>
        </div>
      </header>

      <section id="top" className="relative flex min-h-[760px] items-end overflow-hidden bg-[#0b1218] pt-28 md:min-h-screen">
        <img
          src={s.hero_image_url}
          alt="Nadrozměrná přeprava lopatky větrné elektrárny na speciálním návěsu"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
          fetchPriority="high"
        />
        <div className="transport-hero-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b1218] to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-14 pt-28 md:px-10 md:pb-20">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 border border-white/20 bg-black/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#f5a623]" />
              {s.hero_eyebrow}
            </div>
            <h1 className="max-w-[12ch] text-balance text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl md:text-8xl lg:text-[96px]">
              {s.hero_title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl">
              {s.hero_paragraph}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#kontakt" className="transport-primary-cta">{s.hero_cta_primary} <ArrowRight className="h-5 w-5" /></a>
              <a href={`mailto:${s.email}`} className="transport-secondary-cta"><Mail className="h-5 w-5" /> {s.hero_cta_secondary}</a>
            </div>
          </div>

          <div className="mt-14 grid max-w-4xl grid-cols-1 border-y border-white/15 sm:grid-cols-3">
            {content.highlights.map(({ title, text }, index) => {
              const Icon = highlightIcons[index] || Route;
              return (
              <div key={`${title}-${index}`} className="flex items-start gap-4 border-white/15 py-5 sm:border-r sm:px-5 first:sm:pl-0 last:sm:border-r-0">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#f5a623]" />
                <div>
                  <div className="font-bold text-white">{title}</div>
                  <div className="mt-1 text-sm text-white/55">{text}</div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="sluzby" className="bg-[#eef1f3] py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <div className="transport-kicker">{content.services.eyebrow}</div>
              <h2 className="mt-4 max-w-[12ch] text-balance text-4xl font-black leading-[1.02] tracking-[-0.045em] md:text-6xl">{content.services.title}</h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-[#53616c] lg:justify-self-end">
              {content.services.intro}
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-[#cbd2d7] bg-[#cbd2d7] md:grid-cols-2">
            {content.services.items.map(({ title, text }, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
              <article key={`${title}-${index}`} className="group bg-white p-7 transition-colors hover:bg-[#f7f8f9] md:p-10">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center bg-[#101820] text-[#f5a623]"><Icon className="h-6 w-6" /></span>
                  <span className="font-mono text-xs tracking-[0.18em] text-[#8b969e]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-10 text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">{title}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-[#64717a]">{text}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="postup" className="bg-[#101820] py-20 text-white md:py-28">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="transport-kicker text-[#f5a623]">{content.process.eyebrow}</div>
          <div className="mt-4 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <h2 className="max-w-[11ch] text-balance text-4xl font-black leading-[1.02] tracking-[-0.045em] md:text-6xl">{content.process.title}</h2>
            <div className="border-t border-white/15">
              {content.process.steps.map((step, index) => (
                <div key={`${step.title}-${index}`} className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[70px_1fr_1.3fr] sm:items-start">
                  <div className="font-mono text-xs text-[#f5a623]">0{index + 1}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="leading-relaxed text-white/55">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt" className="relative overflow-hidden bg-[#f5a623] py-20 md:py-28">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[70px] border-black/5" />
        <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#101820]/60">{content.contact.eyebrow}</div>
            <h2 className="mt-4 max-w-[13ch] text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#101820] md:text-7xl">{content.contact.title}</h2>
          </div>
          <div className="border-l-2 border-[#101820] pl-6 md:pl-8">
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#101820]/55">{content.contact.directLabel}</div>
            <a href={s.phone_href} className="mt-4 block text-3xl font-black tracking-[-0.035em] text-[#101820] hover:underline md:text-4xl">{s.phone}</a>
            <a href={`mailto:${s.email}`} className="mt-3 block text-xl font-bold text-[#101820] hover:underline">{s.email}</a>
            <div className="mt-7 flex items-start gap-3 text-sm leading-relaxed text-[#101820]/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{s.address}<br />IČO {s.ic} · {s.owner_name}</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0b1218] text-white/55">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-7 text-sm md:flex-row md:items-center md:justify-between md:px-10">
          <div className="font-bold text-white">{brand}</div>
          <div>{content.footer.text}</div>
          <div>© {new Date().getFullYear()} Všechna práva vyhrazena</div>
        </div>
      </footer>
    </main>
  );
}
