import Link from "next/link";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { ArticleFooter, ArticleHeader } from "@/components/public/ArticleShell";

export default function ClanekDetail({ item, settings = null }) {
  return (
    <div className="transport-site min-h-screen bg-[#eef1f3] text-[#101820]">
      <ArticleHeader settings={settings} />

      <main>
        <article>
          <header className="bg-[#101820] py-16 text-white md:py-24">
            <div className="mx-auto max-w-5xl px-5 md:px-10">
              <Link href="/clanky" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-[#f5a623]">
                <ArrowLeft className="h-4 w-4" /> Zpět na články
              </Link>
              {item.tag ? <div className="transport-kicker mt-10 text-[#f5a623]">{item.tag}</div> : null}
              <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.05em] md:text-7xl">{item.title}</h1>
              {item.excerpt ? <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/65 md:text-xl">{item.excerpt}</p> : null}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-wider text-white/50">
                {item.author_name ? <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-[#f5a623]" /> {item.author_name}</span> : null}
                {item.created_date ? <time dateTime={new Date(item.created_date).toISOString()} className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#f5a623]" /> {formatDate(item.created_date)}</time> : null}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-5 py-12 md:px-10 md:py-20">
            {item.image_url ? (
              <div className="mb-12 aspect-[16/9] overflow-hidden bg-[#dfe4e7]">
                <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
              </div>
            ) : null}

            <div className="transport-article-content mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: item.content || "" }} />

            {item.gallery?.length ? (
              <section className="mx-auto mt-14 max-w-4xl border-t border-[#cbd2d7] pt-10">
                <h2 className="text-3xl font-black tracking-[-0.035em]">Galerie</h2>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {item.gallery.map((url, index) => (
                    <a key={`${url}-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden bg-[#dfe4e7]">
                      <img src={url} alt={`${item.title} – fotografie ${index + 1}`} className="h-full w-full object-cover transition-transform hover:scale-[1.03]" loading="lazy" />
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            {item.videos?.length ? (
              <section className="mx-auto mt-14 max-w-4xl border-t border-[#cbd2d7] pt-10">
                <h2 className="text-3xl font-black tracking-[-0.035em]">Videa</h2>
                <div className="mt-6 space-y-5">
                  {item.videos.map((url, index) => <video key={`${url}-${index}`} src={url} controls className="aspect-video w-full bg-black object-contain" />)}
                </div>
              </section>
            ) : null}
          </div>
        </article>
      </main>

      <ArticleFooter settings={settings} />
    </div>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Prague" }).format(new Date(value));
}
