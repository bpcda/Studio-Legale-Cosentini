import { Phone, ArrowRight, Menu, X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import logoCosentini from "@/assets/logo-cosentini.png";
import { databases, isConfigured, Query, DB_ID, COLLECTIONS, normalizeDocs } from "@/lib/appwrite";
import SEO from "@/components/SEO";
import LegalRankBadge from "@/components/LegalRankBadge";

import services from "@/data/services.json";

interface HomeArticle {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  external_url?: string;
  tags?: string[];
  date: string;
}

const navItems = [
  { label: "Lo Studio", href: "/lo-studio", isRoute: true },
  { label: "Servizi", href: "#servizi" },
  { label: "Sentenze", href: "/sentenze-commentate", isRoute: true },
  { label: "Articoli", href: "/articoli", isRoute: true },
  { label: "Contatti", href: "#contatti" },
];

const Logo = ({ className = "h-10" }: { className?: string }) => (
  <img
    src={logoCosentini}
    alt="Studio Legale Cosentini - Logo"
    className={className}
    width={80}
    height={80}
    loading="eager"
  />
);

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [articles, setArticles] = useState<HomeArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!isConfigured) {
        setArticlesLoading(false);
        return;
      }
      try {
        const res = await databases.listDocuments(DB_ID, COLLECTIONS.articles, [
          Query.orderDesc("date"),
          Query.limit(3),
        ]);
        setArticles(normalizeDocs<HomeArticle>(res.documents));
      } catch (err) {
        console.error("fetchArticles error:", err);
      }
      setArticlesLoading(false);
    };
    fetchArticles();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Studio Legale Cosentini",
    description: "Studio legale con sedi a Napoli e Roma. Assistenza in diritto civile, amministrativo, recupero crediti, trust e wealth management.",
    url: "https://www.cosentini.it",
    telephone: ["+390817511775", "+390698357515"],
    email: "avvocato@cosentini.it",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Napoli",
        streetAddress: "Via Nuova del Campo 14",
        postalCode: "80141",
        addressCountry: "IT",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Roma",
        addressCountry: "IT",
      },
    ],
    areaServed: { "@type": "Country", name: "Italia" },
    knowsLanguage: ["it", "en"],
    slogan: "Rem tene verba sequentur",
  };

  return (
    <div className="min-h-screen bg-background">
      <a href="#contenuto" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-background focus:p-4">Vai al contenuto</a>
      <SEO
        path="/"
        jsonLd={jsonLd}
      />

      {/* Top bar with contacts — always visible */}
      <div className="bg-primary text-primary-foreground text-sm py-2.5">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="tel:+390817511775" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <span className="text-primary-foreground">Napoli</span>
              <span>081 7511775</span>
            </a>
            <span className="text-primary-foreground/20">·</span>
            <a href="tel:+390698357515" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <span className="text-primary-foreground">Roma</span>
              <span>06 98357515</span>
            </a>
          </div>
          <a href="mailto:avvocato@cosentini.it" className="hover:text-primary-foreground transition-colors">
            avvocato@cosentini.it
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Navigazione principale" className="sticky top-0 z-50 bg-background">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Studio Legale Cosentini - Home">
            <Logo className="h-12 w-auto" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-[13px] tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[13px] tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
            )}
            <Link
              to="/consulenza"
              className="text-[13px] tracking-wide text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
            >
              Consulenza
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden min-h-11 min-w-11 p-2 text-foreground active:scale-95 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            {menuOpen ? <X size={20} strokeWidth={1.25} /> : <Menu size={20} strokeWidth={1.25} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="menu-mobile" className="md:hidden bg-card px-6 py-6 space-y-4">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-sm text-muted-foreground py-1.5"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-sm text-muted-foreground py-1.5"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
            <Link
              to="/consulenza"
              className="block text-sm text-foreground pt-3 border-t border-border"
              onClick={() => setMenuOpen(false)}
            >
              Consulenza →
            </Link>
          </div>
        )}
      </nav>

      <main id="contenuto">
      <section className="bg-primary text-primary-foreground" aria-label="Introduzione">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 grid lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
              Studio Legale<br />Cosentini
            </h1>
            <p className="mt-6 text-lg leading-relaxed max-w-xl">
              Assistenza legale per imprese, patrimoni e persone.
              A Napoli, Roma e da remoto.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-6">
              <Button asChild size="lg" variant="secondary" className="px-5">
                <Link to="/consulenza">Richiedi un appuntamento <ArrowRight size={16} aria-hidden="true" /></Link>
              </Button>
              <a href="#servizi" className="inline-flex items-center min-h-11 underline underline-offset-4">Aree di competenza</a>
            </div>
          </div>
          <div className="bg-primary-foreground text-primary p-6 md:p-8">
            <p className="font-serif text-3xl mb-4">Al suo fianco, dal 1998.</p>
            <p className="leading-relaxed">Oltre venticinque anni di esperienza. Due sedi, un'unica idea di professione.</p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div>
                <h2 className="font-serif text-2xl mb-2">Napoli</h2>
                <a href="tel:+390817511775" className="inline-flex items-center min-h-11 text-sm underline underline-offset-4">081 7511775</a>
              </div>
              <div>
                <h2 className="font-serif text-2xl mb-2">Roma</h2>
                <a href="tel:+390698357515" className="inline-flex items-center min-h-11 text-sm underline underline-offset-4">06 98357515</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servizi" className="py-16 md:py-24 scroll-mt-20" aria-labelledby="servizi-title">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-16 items-end mb-10 md:mb-14">
            <h2 id="servizi-title" className="font-serif text-4xl md:text-5xl leading-tight">Aree di competenza</h2>
            <p className="leading-relaxed">Dalla tutela di un diritto alla gestione del patrimonio: scopra l'assistenza più vicina alla sua esigenza.</p>
          </div>
          <div className="space-y-10 md:space-y-12">
            {services.map((service) => (
              <article key={service.slug} className="grid md:grid-cols-2 gap-4 md:gap-16">
                <div>
                <h3 className="font-serif text-3xl leading-tight">
                  <Link to={`/servizi/${service.slug}`} className="hover:underline underline-offset-4">{service.title}</Link>
                </h3>
                <p className="mt-3 font-medium">{service.need}</p>
                </div>
                <div>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                <Link to={`/servizi/${service.slug}`} className="inline-flex items-center gap-2 min-h-11 mt-4 text-sm underline underline-offset-4" aria-label={`Scopri il servizio: ${service.title}`}>
                  Scopri il servizio <ArrowRight size={16} aria-hidden="true" />
                </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-14 md:py-20" aria-labelledby="studio-title">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <h2 id="studio-title" className="font-serif text-4xl md:text-5xl leading-tight">Conosca lo Studio</h2>
          <div>
            <p className="text-lg leading-relaxed">Sedi operative a Napoli e Roma, assistenza su tutto il territorio nazionale. Ogni richiesta parte dall'ascolto delle sue esigenze.</p>
            <Button asChild variant="secondary" size="lg" className="mt-6">
              <Link to="/lo-studio">Lo Studio e i professionisti <ArrowRight size={16} aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="articoli" className="py-16 md:py-24" aria-labelledby="articoli-title">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-16 items-end mb-10">
            <h2 id="articoli-title" className="font-serif text-4xl md:text-5xl leading-tight">Dal nostro osservatorio</h2>
            <p className="leading-relaxed">Articoli e approfondimenti dal mondo del diritto a cura dell'Avv. Sergio Cosentini.</p>
          </div>
          {articlesLoading ? (
            <div className="space-y-6" role="status" aria-label="Caricamento articoli">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : articles.length === 0 ? (
            <p className="bg-card p-8 text-muted-foreground">Nessun articolo disponibile al momento.</p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => {
                const excerpt = (article.excerpt || article.content || "").replace(/<[^>]*>/g, " ");
                const words = excerpt.split(/\s+/).filter(Boolean);
                const preview = words.length > 28 ? words.slice(0, 28).join(" ") + "…" : words.join(" ");
                const content = (
                  <>
                    <h3 className="font-serif text-2xl md:text-3xl leading-tight line-clamp-3 group-hover:underline underline-offset-4">{article.title}</h3>
                    <p className="text-muted-foreground mt-3 leading-relaxed">{preview}</p>
                    <span className="inline-flex items-center gap-2 mt-4 text-sm">Leggi l'approfondimento {article.external_url ? <ExternalLink size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</span>
                  </>
                );
                return (
                  <article key={article.id} className="bg-card p-6 md:p-8 grid md:grid-cols-[10rem_1fr] gap-4 md:gap-8">
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <time dateTime={article.date}>{new Date(article.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</time>
                      {article.tags?.length > 0 && <p className="mt-2">{article.tags.join(" · ")}</p>}
                    </div>
                    {article.external_url ? (
                      <a href={article.external_url} target="_blank" rel="noopener noreferrer" className="group block min-w-0" aria-label={`${article.title} (si apre in una nuova scheda)`}>{content}</a>
                    ) : (
                      <Link to={`/articoli/${article.id}`} className="group block min-w-0">{content}</Link>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          <Link to="/articoli" className="inline-flex items-center gap-2 min-h-11 mt-8 underline underline-offset-4">Tutti gli articoli <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      <section id="contatti" className="bg-primary text-primary-foreground py-14 md:py-20 scroll-mt-20" aria-labelledby="contatti-title">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 id="contatti-title" className="font-serif text-4xl md:text-5xl leading-tight">Parliamo della sua esigenza</h2>
            <p className="mt-6 leading-relaxed max-w-lg">Richieda un primo incontro in studio o da remoto. Concorderemo insieme data, orario e modalità della consulenza.</p>
            <Button asChild variant="secondary" size="lg" className="mt-8 px-5">
              <Link to="/consulenza">Richiedi un appuntamento <ArrowRight size={16} aria-hidden="true" /></Link>
            </Button>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl">Napoli</h3>
              <address className="not-italic mt-2 leading-relaxed">Via Nuova del Campo 14<br />80141 Napoli</address>
              <a href="https://www.google.com/maps/search/?api=1&query=Via+Nuova+del+Campo+14+80141+Napoli" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-11 underline underline-offset-4">Indicazioni per Napoli <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (nuova scheda)</span></a>
              <a href="tel:+390817511775" className="flex items-center gap-2 min-h-11"><Phone size={16} aria-hidden="true" />081 7511775</a>
            </div>
            <div>
              <h3 className="font-serif text-2xl">Roma</h3>
              <p className="mt-2">Contatti lo Studio per concordare l'incontro.</p>
              <a href="tel:+390698357515" className="flex items-center gap-2 min-h-11"><Phone size={16} aria-hidden="true" />06 98357515</a>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-16 md:py-20" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <Logo className="h-12 w-auto mb-5" />
              <p className="text-muted-foreground text-[15px] italic font-serif mb-3">« Rem tene, verba sequentur »</p>
              <p className="text-muted-foreground text-[13px] font-light leading-relaxed max-w-sm">
                Studio Legale Cosentini — boutique legale con sedi a
                Napoli e Roma. Consulenza strategica per imprese,
                patrimoni e persone.
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="eyebrow mb-4">Napoli</p>
              <a href="tel:+390817511775" className="block text-foreground text-[14px] font-light hover:text-accent transition-colors">081 7511775</a>
            </div>
            <div className="md:col-span-2">
              <p className="eyebrow mb-4">Roma</p>
              <a href="tel:+390698357515" className="block text-foreground text-[14px] font-light hover:text-accent transition-colors">06 98357515</a>
            </div>
            <div className="md:col-span-3">
              <p className="eyebrow mb-4">Email</p>
              <a href="mailto:avvocato@cosentini.it" className="block text-foreground text-[14px] font-light hover:text-accent transition-colors break-all">
                avvocato@cosentini.it
              </a>
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6 text-[12px] text-muted-foreground font-light">
            <p>© {new Date().getFullYear()} Studio Legale Cosentini · Tutti i diritti riservati.</p>
            <LegalRankBadge className="opacity-80 hover:opacity-100 transition-opacity" />
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
