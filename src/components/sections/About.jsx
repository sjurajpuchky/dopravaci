import React from "react";
import { Sofa, Package, Wrench, Heart } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const pillars = [
  {
    icon: Sofa,
    title: "Rozvoz & doprava",
    desc: "Sedačky, skříně a objemné zboží. Vyzvedneme, dovezeme a po domluvě smontujeme.",
  },
  {
    icon: Package,
    title: "Nestandardní předměty",
    desc: "Těžké a neobvyklé kusy, které se do běžného auta nevejdou. Bojler 400 kg, pračky, palety — vše bezpečně přepravíme.",
  },
  {
    icon: Wrench,
    title: "Montáž & zámečnictví",
    desc: "Montáž i demontáž nábytku a drobné zámečnické práce. Připravíme prostor i nábytek přesně podle potřeby.",
  },
  {
    icon: Heart,
    title: "Osobní přístup",
    desc: "Přepravu vede přímo Milan Rousek. Komunikujete s člověkem, ne s call centrem.",
  },
];

export default function About() {
  const s = useSiteSettings();

  return (
    <section id="firma" className="relative bg-cream py-20 md:py-32 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-[32px] shadow-[0_16px_0_rgba(107,79,58,0.1)]">
            <Image
              src={s.about_image_url}
              alt="Rozvoz nábytku a přeprava nestandardních předmětů"
              fittingType="fill"
              className="w-full h-[380px] object-cover"
            />
          </div>
          <div>
            <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-3">{s.about_eyebrow}</div>
            <h2 className="display-mega text-brown text-4xl md:text-5xl text-balance">{s.about_title}</h2>
            <p className="mt-6 text-brown-soft text-lg leading-relaxed">{s.about_paragraph_1}</p>
            <p className="mt-4 text-brown-soft leading-relaxed">{s.about_paragraph_2}</p>
            <a href="#kontakt" className="btn-warm mt-8 inline-flex">Kontakt</a>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="softcard !p-6">
              <p.icon className="w-8 h-8 text-terracotta mb-4" strokeWidth={1.75} />
              <h3 className="font-display font-bold text-brown text-lg mb-2">{p.title}</h3>
              <p className="text-brown-soft text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}