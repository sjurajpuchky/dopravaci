import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { api } from "@/api/client";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let activeReq = true;
    api.gallery
      .public()
      .then((rows) => {
        if (activeReq) {
          setPhotos((rows || []).filter((p) => p && p.src));
          setLoading(false);
        }
      })
      .catch(() => {
        if (activeReq) setLoading(false);
      });
    return () => { activeReq = false; };
  }, []);

  const close = () => setActive(null);
  const prev = () => setActive((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setActive((i) => (i === null ? null : (i + 1) % photos.length));

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="galerie" className="bg-cream py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-terracotta font-mono text-xs uppercase tracking-[0.14em] mb-3">Fotogalerie</div>
            <h2 className="display-mega text-brown text-4xl md:text-5xl text-balance max-w-[16ch]">
              Stěhování a přeprava v obrazech.
            </h2>
          </div>
          <p className="text-brown-soft max-w-md text-lg leading-relaxed">
            Reálné záběry z naší praxe — od rozvozu nábytku dodávkou až po přepravu těžkých a nestandardních předmětů.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="col-span-full text-center text-brown-soft py-16">Zatím nejsou žádné fotografie.</div>
          ) : null}
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-[18px] border border-[rgba(107,79,58,0.15)] shadow-[0_8px_0_rgba(107,79,58,0.06)] transition-transform hover:-translate-y-1"
            >
              <Image
                src={p.src}
                alt={p.alt || `Realizace stěhování a přepravy ${i + 1}`}
                fittingType="fill"
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(107,79,58,0.55)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 left-3 bg-terracotta text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {p.tag}
              </div>
              <div className="absolute bottom-3 right-3 w-9 h-9 bg-cream/90 text-terracotta rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[rgba(40,28,20,0.92)] flex items-center justify-center p-4 md:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 text-peach hover:text-terracotta transition-colors"
            aria-label="Zavřít"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-8 text-peach hover:text-terracotta transition-colors"
            aria-label="Předchozí"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-8 text-peach hover:text-terracotta transition-colors"
            aria-label="Další"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[active].src}
              alt={photos[active].alt || `Realizace stěhování a přepravy ${active + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-[16px]"
            />
            <figcaption className="text-center mt-4 text-peach font-mono text-sm uppercase tracking-wider">
              {photos[active].alt || "Realizace stěhování a přepravy"}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
