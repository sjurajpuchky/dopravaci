"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/api/client";
import { Image } from "@/components/ui/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

export default function ClankyPage({ initialItems = null }) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    if (initialItems !== null) return;
    api.articles
      .public()
      .then((rows) => setItems(rows || []))
      .catch(() => setItems([]));
  }, [initialItems]);

  return (
    <div className="min-h-screen bg-sand">
      <Navbar />
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-texture opacity-30" />
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-3">
            Články &amp; rady
          </div>
          <h1 className="display-mega text-brown text-5xl md:text-7xl text-balance max-w-[16ch]">
            Praktické rady pro stěhování.
          </h1>
          <p className="mt-6 text-brown-soft max-w-xl text-lg leading-relaxed">
            Odborné články a tipy z přepravy nestandardních předmětů, rozvozu nábytku
            a logistiky po Praze a okolí.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!items && (
              <div className="col-span-full font-mono text-sm text-brown-soft uppercase tracking-wider">
                Načítání článků…
              </div>
            )}
            {items && items.length === 0 && (
              <div className="col-span-full font-mono text-sm text-brown-soft uppercase tracking-wider">
                Zatím nejsou žádné publikované články.
              </div>
            )}
            {items &&
              items.map((a) => (
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
                    <h2 className="font-display font-bold text-brown text-xl leading-tight mb-3 group-hover:text-terracotta transition-colors">
                      {a.title}
                    </h2>
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
        </div>
      </section>
      <Footer />
    </div>
  );
}
