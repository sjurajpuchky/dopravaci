import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const BASE = "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/";

const items = [
  {
    img: `${BASE}200000024-6ae996ae9b/IMG_0233.jpeg?ph=9b5be8ccee`,
    tag: "MONTÁŽ NÁBYTKU",
    meta: "SEDAČKA · SMONTOVÁNO",
    title: "Montáž nábytku po rozvozu",
    excerpt: "Sedačku i skříň nejen dovezeme, ale i smontujeme. Po domluvě kompletní montáž přesně na místo.",
  },
  {
    img: `${BASE}200000026-7bfdb7bfdd/IMG_0232.jpeg?ph=9b5be8ccee`,
    tag: "DEMONTÁŽ & ODVOZ",
    meta: "STARÝ NÁBYTEK · VYKLIZENÍ",
    title: "Demontáž a odvoz starého nábytku",
    excerpt: "Potřebujete se zbavit starého kusu? Demontujeme, odvezeme a vyklidíme prostor.",
  },
  {
    img: `${BASE}200000028-7a1f07a1f2/IMG_0468.jpeg?ph=9b5be8ccee`,
    tag: "PŘEPRAVA PALET",
    meta: "8 PALET · 17 m³ · 4,20 × 2,00 × 2,10 m",
    title: "Přeprava palet a objemného zboží",
    excerpt: "Dodávkou přepravíme až 8 palet o objemu 17 m³. Délka 4,20 m, šířka 2,00 m, výška 2,10 m.",
  },
  {
    img: `${BASE}200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee`,
    tag: "NESTANDARDNÍ PŘEDMĚTY",
    meta: "BOJLER · 400 KG",
    title: "Těžký bojler 400 kg bez zvedáku",
    excerpt: "Těžké a neobvyklé předměty přepravíme opatrně a bezpečně. Bojler 400 kg je pro nás běžná rutina.",
  },
  {
    img: `${BASE}200000030-e3335e3336/IMG_0835.jpeg?ph=9b5be8ccee`,
    tag: "DROBNÉ ZÁMEČNICTVÍ",
    meta: "PŘÍPRAVA · MONTÁŽ",
    title: "Drobné zámečnické práce",
    excerpt: "Při stěhování zařídíme i drobné zámečnické práce, ať je vše připraveno přesně podle potřeby.",
  },
  {
    img: `${BASE}200000010-5795457957/dodavka%20%201-5.jpeg?ph=9b5be8ccee`,
    tag: "ROZVOZ DODÁVKOU",
    meta: "PRAHA & OKOLÍ",
    title: "Rozvoz sedaček, skříní a objemného zboží",
    excerpt: "Rychlý rozvoz po Praze a okolí. Vyzvedneme z obchodu i bytu a dovezeme až do nového domova.",
  },
];

function Card({ a }) {
  return (
    <article className="group shrink-0 w-[85vw] sm:w-[400px] bg-cream rounded-[24px] overflow-hidden border border-[rgba(107,79,58,0.15)] shadow-[0_10px_0_rgba(107,79,58,0.08)] transition-transform hover:-translate-y-1">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={a.img}
          alt={a.title}
          fittingType="fill"
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-terracotta text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
          {a.tag}
        </div>
      </div>
      <div className="p-6">
        <div className="font-mono text-[10px] text-terracotta uppercase tracking-wider mb-2">{a.meta}</div>
        <h3 className="font-display font-bold text-brown text-xl leading-tight mb-3 group-hover:text-terracotta transition-colors">
          {a.title}
        </h3>
        <p className="text-brown-soft text-sm leading-relaxed mb-5">{a.excerpt}</p>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-terracotta">
          Zobrazit detail
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
}

export default function Articles() {
  return (
    <section id="realizace" className="relative bg-sand-light py-20 md:py-32 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-3">Realizace</div>
            <h2 className="display-mega text-brown text-4xl md:text-5xl text-balance max-w-[14ch]">
              Věci dorazí v pořádku.
            </h2>
          </div>
          <p className="text-brown-soft max-w-md text-lg leading-relaxed">
            Fotogalerie z reálných přeprav a rozvozů. Od montáže sedaček přes přepravu palet
            až po těžký bojler 400 kg.
          </p>
        </div>
      </div>

      <div className="relative marquee-pause overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#F6D5A6] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#F6D5A6] to-transparent z-10" />
        <div className="flex w-max animate-marquee-realizace">
          {[0, 1].map((g) => (
            <div key={g} className="flex gap-6 pr-6 shrink-0" aria-hidden={g === 1}>
              {items.map((a, i) => (
                <Card key={`${g}-${i}`} a={a} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}