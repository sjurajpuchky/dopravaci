"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/api/client";
import { Image } from "@/components/ui/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

export default function ClanekDetail({ initialItem = null }) {
  const { slug } = useParams();
  const [item, setItem] = useState(initialItem);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (initialItem?.slug === slug) return;
    setItem(null);
    setNotFound(false);
    api.articles
      .bySlug(slug)
      .then(setItem)
      .catch(() => setNotFound(true));
  }, [initialItem, slug]);

  return (
    <div className="bg-sand min-h-screen text-brown">
      <Navbar />

      <article className="pt-28 md:pt-36 pb-20">
        {notFound ? (
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h1 className="display-mega text-brown text-4xl mb-4">Článek nenalezen</h1>
            <p className="text-brown-soft mb-8">Tento článek neexistuje nebo nebyl publikován.</p>
            <Link href="/" className="btn-warm inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Zpět na úvod
            </Link>
          </div>
        ) : !item ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-5 md:px-10">
            <Link
              href="/#clanky"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brown-soft hover:text-terracotta mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Zpět na články
            </Link>

            {item.tag && (
              <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-4">
                {item.tag}
              </div>
            )}
            <h1 className="display-mega text-brown text-4xl md:text-5xl text-balance mb-4">
              {item.title}
            </h1>
            <div className="flex items-center gap-3 font-mono text-xs text-brown-soft uppercase tracking-wider mb-8">
              {item.author_name && <span>{item.author_name}</span>}
              {item.created_date && (
                <span>{new Date(item.created_date).toLocaleDateString("cs-CZ")}</span>
              )}
            </div>

            {item.image_url && (
              <div className="aspect-[16/9] overflow-hidden rounded-[24px] border border-[rgba(107,79,58,0.15)] mb-10">
                <Image src={item.image_url} alt={item.title} fittingType="fill" className="w-full h-full" />
              </div>
            )}

            {item.excerpt && (
              <p className="text-brown text-lg leading-relaxed mb-8 font-medium">{item.excerpt}</p>
            )}

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            />

            {item.gallery && item.gallery.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display font-bold text-brown text-2xl mb-5">Galerie</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.gallery.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square overflow-hidden rounded-[16px] border border-[rgba(107,79,58,0.15)] block"
                    >
                      <Image src={url} alt={`${item.title} – fotografie ${i + 1}`} fittingType="fill" className="w-full h-full" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {item.videos && item.videos.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display font-bold text-brown text-2xl mb-5">Videa</h2>
                <div className="space-y-5">
                  {item.videos.map((url, i) => (
                    <div key={i} className="aspect-video overflow-hidden rounded-[20px] border border-[rgba(107,79,58,0.15)] bg-black">
                      <video src={url} controls className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
