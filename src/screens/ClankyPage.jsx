import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { ArticleFooter, ArticleHeader } from "@/components/public/ArticleShell";

export default function ClankyPage({ items = [], currentPage = 1, totalPages = 1, settings = null }) {
  return (
    <div className="transport-site min-h-screen bg-[#eef1f3] text-[#101820]">
      <ArticleHeader settings={settings} />

      <main>
        <section className="relative overflow-hidden bg-[#101820] py-20 text-white md:py-28">
          <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full border-[80px] border-white/[0.025]" />
          <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
            <div className="transport-kicker text-[#f5a623]">Články a odborné informace</div>
            <h1 className="mt-5 max-w-[13ch] text-balance text-5xl font-black leading-[0.96] tracking-[-0.055em] md:text-7xl">
              Přeprava bez neznámých.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Praktické informace o dopravě, plánování tras, manipulaci s náklady a bezpečné realizaci přepravy.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1500px] px-5 md:px-10">
            {items.length === 0 ? (
              <div className="border border-[#cbd2d7] bg-white p-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-[#c97e00]" />
                <h2 className="mt-4 text-2xl font-black">Zatím nejsou publikované žádné články.</h2>
              </div>
            ) : (
              <div className="grid gap-px overflow-hidden border border-[#cbd2d7] bg-[#cbd2d7] sm:grid-cols-2 lg:grid-cols-3">
                {items.map((article) => (
                  <Link key={article.id} href={`/clanky/${article.slug}`} className="group flex min-h-full flex-col bg-white transition-colors hover:bg-[#f8f9fa]">
                    {article.image_url ? (
                      <div className="aspect-[16/9] overflow-hidden bg-[#dfe4e7]">
                        <img src={article.image_url} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-[#101820] text-[#f5a623]">
                        <BookOpen className="h-9 w-9" />
                      </div>
                    )}
                    <article className="flex flex-1 flex-col p-7">
                      <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#7a8790]">
                        <span>{article.tag || "Přeprava"}</span>
                        {article.created_date ? <time dateTime={new Date(article.created_date).toISOString()}>{formatDate(article.created_date)}</time> : null}
                      </div>
                      <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-[-0.035em] transition-colors group-hover:text-[#b66f00]">{article.title}</h2>
                      {article.excerpt ? <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#64717a]">{article.excerpt}</p> : null}
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#101820]">
                        Číst článek <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <nav className="mt-10 flex items-center justify-between border-t border-[#cbd2d7] pt-6" aria-label="Stránkování článků">
                {currentPage > 1 ? (
                  <Link href={pageHref(currentPage - 1)} className="inline-flex items-center gap-2 font-bold hover:text-[#b66f00]"><ArrowLeft className="h-4 w-4" /> Novější</Link>
                ) : <span />}
                <span className="font-mono text-xs uppercase tracking-wider text-[#64717a]">Strana {currentPage} z {totalPages}</span>
                {currentPage < totalPages ? (
                  <Link href={pageHref(currentPage + 1)} className="inline-flex items-center gap-2 font-bold hover:text-[#b66f00]">Starší <ArrowRight className="h-4 w-4" /></Link>
                ) : <span />}
              </nav>
            ) : null}
          </div>
        </section>
      </main>

      <ArticleFooter settings={settings} />
    </div>
  );
}

function pageHref(page) {
  return page <= 1 ? "/clanky" : `/clanky?page=${page}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", year: "numeric", timeZone: "Europe/Prague" }).format(new Date(value));
}
