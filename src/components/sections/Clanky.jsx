import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/api/client";
import { Image } from "@/components/ui/image";

export default function Clanky() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.articles
      .public()
      .then((rows) => setItems((rows || []).slice(0, 3)))
      .catch(() => setItems([]));
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section id="clanky" className="relative bg-cream py-20 md:py-32 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-3">
              Články &amp; rady
            </div>
            <h2 className="display-mega text-brown text-4xl md:text-5xl text-balance max-w-[16ch]">
              Praktické rady pro stěhování.
            </h2>
          </div>
          <p className="text-brown-soft max-w-md text-lg leading-relaxed">
            Odborné články a tipy z přepravy nestandardních předmětů, rozvozu nábytku
            a logistiky po Praze a okolí.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((a) => (
            <Link
              key={a.id}
              href={`/clanky/${a.slug}`}
              className="group bg-cream rounded-[24px] overflow-hidden border border-[rgba(107,79,58,0.15)] shadow-[0_10px_0_rgba(107,79,58,0.08)] hover:-translate-y-1 transition-transform flex flex-col"
            >
              {a.image_url && (
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={a.image_url}
                    alt={a.title}
                    fittingType="fill"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {a.tag && (
                    <div className="absolute top-4 left-4 bg-terracotta text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {a.tag}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display font-bold text-brown text-xl leading-tight mb-3 group-hover:text-terracotta transition-colors">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="text-brown-soft text-sm leading-relaxed mb-5 line-clamp-3">{a.excerpt}</p>
                )}
                <div className="mt-auto flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-terracotta">
                  Číst článek
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/clanky"
            className="btn-warm inline-flex items-center gap-2"
          >
            Všechny články
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
