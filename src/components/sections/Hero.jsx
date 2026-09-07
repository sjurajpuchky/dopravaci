import React from "react";
import { Gauge } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Hero() {
  const s = useSiteSettings();
  const stats = [
    { v: s.stat1_value, l: s.stat1_label },
    { v: s.stat2_value, l: s.stat2_label },
    { v: s.stat3_value, l: s.stat3_label },
    { v: s.stat4_value, l: s.stat4_label },
  ];

  return (
    <section id="top" className="relative min-h-screen bg-hero-warm overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <Image
          src={s.hero_image_url}
          alt="Doprava a přeprava nábytku Dopravaci.cz"
          fittingType="fill"
          className="w-full h-full object-cover opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(107,79,58,0.88), rgba(107,79,58,0.43) 52%, rgba(107,79,58,0.12))",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-10 pb-16 md:pb-28 pt-32 w-full">
        <div className="max-w-[720px]">
          <div className="font-mono text-xs md:text-sm text-peach uppercase tracking-[0.14em] mb-6 animate-convoy">
            {s.hero_eyebrow}
          </div>
          <h1
            className="display-mega text-white text-[13vw] md:text-[8vw] max-w-[18ch] text-balance animate-convoy"
            style={{ animationDelay: "0.1s" }}
          >
            {s.hero_title}
          </h1>
          <p
            className="mt-6 max-w-xl text-white text-lg md:text-xl leading-relaxed animate-convoy"
            style={{ animationDelay: "0.2s" }}
          >
            {s.hero_paragraph}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-convoy" style={{ animationDelay: "0.3s" }}>
            <a href="#kalkulacka" className="btn-warm text-base uppercase tracking-wider">
              <Gauge className="w-5 h-5" />
              {s.hero_cta_primary}
            </a>
            <a href="#kontakt" className="btn-warm btn-warm-light text-base uppercase tracking-wider">
              {s.hero_cta_secondary}
            </a>
          </div>

          <div
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[850px] animate-convoy"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.l}
                className="p-5 rounded-[20px] border border-white/30 backdrop-blur"
                style={{ background: "rgba(255,248,237,0.18)" }}
              >
                <div className="font-display font-extrabold text-white text-3xl">{stat.v}</div>
                <div className="font-mono text-[11px] text-peach uppercase tracking-wider mt-1">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}