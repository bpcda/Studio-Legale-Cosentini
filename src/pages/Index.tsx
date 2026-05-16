import { Phone, Mail, MapPin, Scale, FileText, Shield, Landmark, Briefcase, Building2, ChevronDown, Menu, X, ExternalLink, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/ScrollReveal";
import { useState, useEffect } from "react";
import logoCosentini from "@/assets/logo-cosentini.png";
import { databases, isConfigured, Query, DB_ID, COLLECTIONS, normalizeDocs } from "@/lib/appwrite";
import SEO from "@/components/SEO";

const services = [
  {
    icon: Scale,
    title: "Diritto Civile",
    description:
      "Assistenza in tutti i settori istituzionali del diritto civile. Diritti reali, usucapioni, servitù, comunione e condominio, azioni a difesa della proprietà e del possesso.",
  },
  {
    icon: Landmark,
    title: "Diritto Amministrativo",
    description:
      "Inadempimento contrattuale, vizio del bene o servizio fornito, ritardo nell'esecuzione delle prestazioni e tutela avanti ai tribunali amministrativi.",
  },
  {
    icon: Shield,
    title: "Responsabilità Sociale d'Impresa",
    description:
      "Modelli Organizzativi 231/01. Consulenza e assistenza nell'implementazione dei modelli di organizzazione, gestione e controllo.",
  },
  {
    icon: FileText,
    title: "Recupero Crediti",
    description:
      "Tutela contrattuale del credito, clausole contrattuali contro i rischi di mancato pagamento e diritto dell'esecuzione forzata.",
  },
  {
    icon: Briefcase,
    title: "Trust & Wealth Management",
    description:
      "Ideazione, creazione e gestione di Trust. Consulenza strategica nella gestione e valorizzazione di asset immobiliari e patrimoniali.",
  },
  {
    icon: Building2,
    title: "Custodia e Amministrazione Giudiziaria",
    description:
      "Servizi di custodia e amministrazione giudiziaria con competenza e affidabilità consolidate nel tempo.",
  },
];

const navItems = [
  { label: "Lo Studio", href: "/lo-studio", isRoute: true },
  { label: "Servizi", href: "#servizi" },
  { label: "Sentenze", href: "/sentenze-commentate", isRoute: true },
  { label: "Articoli", href: "/articoli", isRoute: true },
  { label: "Contatti", href: "#contatti" },
];

// Placeholder articles — will be replaced by LinkedIn feed
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
  const [articles, setArticles] = useState<any[]>([]);
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
          Query.limit(6),
        ]);
        setArticles(normalizeDocs(res.documents));
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        path="/"
        jsonLd={jsonLd}
      />

      {/* Top bar with contacts — always visible */}
      <div className="bg-primary text-primary-foreground text-xs py-2 border-b border-primary-foreground/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-5">
            <a href="tel:+390817511775" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={12} />
              <span>Napoli: 081 7511775</span>
            </a>
            <a href="tel:+390698357515" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone size={12} />
              <span>Roma: 06 98357515</span>
            </a>
          </div>
          <a href="mailto:avvocato@cosentini.it" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <Mail size={12} />
            <span>avvocato@cosentini.it</span>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Studio Legale Cosentini - Home">
            <Logo className="h-12 w-auto" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
            )}
            <Link to="/consulenza">
              <Button size="sm" className="active:scale-[0.97] transition-transform">
                Consulenza
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Apri menu di navigazione"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-sm text-muted-foreground py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-sm text-muted-foreground py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
            <Link to="/consulenza">
              <Button size="sm" className="w-full mt-2">Consulenza</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero — editorial, institutional */}
      <section className="relative min-h-[88vh] flex items-center bg-primary overflow-hidden" aria-label="Introduzione">
        {/* very subtle architectural texture: vertical hairlines */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary-foreground)) 1px, transparent 1px)",
            backgroundSize: "120px 100%",
          }}
          aria-hidden
        />
        <div className="absolute inset-y-0 left-0 w-px bg-primary-foreground/10" aria-hidden />
        <div className="absolute inset-y-0 right-0 w-px bg-primary-foreground/10" aria-hidden />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-28 md:py-40 w-full">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-9">
              <p
                className="eyebrow text-primary-foreground/60 mb-10 opacity-0 animate-fade-in-up flex items-center gap-3"
                style={{ animationDelay: "80ms" }}
              >
                <span className="inline-block w-8 h-px bg-primary-foreground/40" />
                Napoli · Roma · dal 1998
              </p>
              <h1
                className="font-serif font-light text-primary-foreground leading-[1.02] mb-10 opacity-0 animate-fade-in-up text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight"
                style={{ animationDelay: "200ms", textWrap: "balance" as any }}
              >
                Studio Legale
                <br />
                <span className="italic font-normal text-primary-foreground/90">Cosentini</span>
              </h1>
              <p
                className="font-serif italic text-primary-foreground/70 text-lg md:text-xl mb-12 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "320ms" }}
              >
                « Rem tene, verba sequentur »
              </p>
              <p
                className="text-primary-foreground/65 text-base md:text-[17px] max-w-xl mb-14 leading-[1.75] font-light opacity-0 animate-fade-in-up"
                style={{ animationDelay: "440ms" }}
              >
                Una boutique legale italiana dedicata alla consulenza
                strategica per imprese, patrimoni e persone. Oltre venticinque
                anni di esperienza, due sedi, un'unica idea di professione.
              </p>
              <div
                className="flex flex-wrap items-center gap-8 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "560ms" }}
              >
                <Link
                  to="/consulenza"
                  className="group inline-flex items-center gap-3 text-sm tracking-wide text-primary-foreground border-b border-primary-foreground/40 pb-1.5 hover:border-primary-foreground transition-colors"
                >
                  Richiedi un appuntamento
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <a
                  href="#servizi"
                  className="text-sm tracking-wide text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  Aree di competenza
                </a>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#servizi"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors"
          aria-label="Scorri verso il basso"
        >
          <ChevronDown size={20} strokeWidth={1.25} />
        </a>
      </section>

      {/* Services — editorial grid with hairline dividers */}
      <section id="servizi" className="py-28 md:py-40 bg-background" aria-label="Aree di competenza">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="grid md:grid-cols-12 gap-8 mb-20 md:mb-28 items-end">
              <div className="md:col-span-4">
                <p className="eyebrow mb-6 flex items-center gap-3">
                  <span className="rule-accent" />
                  01 — Practice
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-[1.05] tracking-tight" style={{ textWrap: "balance" as any }}>
                  Aree di
                  <br />
                  <span className="italic">competenza</span>
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <p className="text-muted-foreground text-base md:text-[17px] leading-[1.8] font-light max-w-lg">
                  Un'assistenza selettiva, costruita su una conoscenza
                  approfondita di ciascuna materia. Lavoriamo accanto a
                  imprenditori, istituzioni e famiglie con lo stesso rigore
                  con cui un artigiano si dedica al proprio mestiere.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="hairline mb-px" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 border-l border-border">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 60}>
                <article className="group h-full p-10 md:p-12 border-r border-b border-border bg-background transition-colors duration-500 hover:bg-card">
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="font-serif italic text-accent/70 text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-[28px] font-light text-foreground mb-5 leading-[1.15] tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-[14px] leading-[1.75] font-light" style={{ overflowWrap: "break-word" }}>
                    {service.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Articles / LinkedIn — editorial */}
      <section id="articoli" className="py-28 md:py-40 bg-card" aria-label="Articoli e pubblicazioni">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="grid md:grid-cols-12 gap-8 mb-20 items-end">
              <div className="md:col-span-7">
                <p className="eyebrow mb-6 flex items-center gap-3">
                  <span className="rule-accent" />
                  02 — Pubblicazioni
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-[1.05] tracking-tight" style={{ textWrap: "balance" as any }}>
                  Articoli e <span className="italic">approfondimenti</span>
                </h2>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <p className="text-muted-foreground text-[15px] leading-[1.8] font-light">
                  Aggiornamenti e analisi dal mondo del diritto a cura
                  dell'Avv. Sergio Cosentini.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {articlesLoading ? (
            <div className="grid md:grid-cols-3 gap-px bg-border">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-8 bg-card space-y-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border-y border-border">
              <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" strokeWidth={1.25} />
              <p className="font-light">Nessun articolo pubblicato al momento.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 border-t border-l border-border">
              {articles.map((article, i) => {
                const isExt = !!article.external_url;
                const excerpt = (article.excerpt || article.content || "").replace(/<[^>]*>/g, "");
                const words = excerpt.split(/\s+/).filter(Boolean);
                const truncated = words.length > 28 ? words.slice(0, 28).join(" ") + "…" : excerpt;

                const Wrapper: any = isExt ? "a" : Link;
                const wrapperProps = isExt
                  ? { href: article.external_url, target: "_blank", rel: "noopener noreferrer" }
                  : { to: `/articoli/${article.id}` };

                return (
                  <ScrollReveal key={article.id} delay={i * 80}>
                    <Wrapper
                      {...wrapperProps}
                      className="group h-full flex flex-col p-8 md:p-10 border-r border-b border-border bg-card hover:bg-background transition-colors duration-500"
                    >
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">
                        <time dateTime={article.date}>
                          {new Date(article.date).toLocaleDateString("it-IT", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </time>
                        {isExt && (
                          <span className="ml-auto text-accent/70">Esterno</span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl font-light text-foreground mb-4 leading-[1.2] tracking-tight">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-[14px] leading-[1.75] font-light flex-1" style={{ overflowWrap: "break-word" }}>
                        {truncated}
                      </p>
                      <span className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-foreground border-b border-foreground/30 pb-1 self-start group-hover:border-foreground transition-colors">
                        Leggi
                        {isExt ? <ExternalLink size={11} strokeWidth={1.5} /> : <span>→</span>}
                      </span>
                    </Wrapper>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          <ScrollReveal delay={200}>
            <div className="text-center mt-16">
              <Link
                to="/articoli"
                className="inline-flex items-center gap-3 text-sm tracking-wide text-foreground border-b border-foreground/40 pb-1.5 hover:border-foreground transition-colors"
              >
                Tutti gli articoli
                <span>→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA — institutional, no gradients */}
      <section id="contatti" className="py-28 md:py-40 bg-background" aria-label="Contattaci">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="relative bg-primary px-10 py-20 md:px-20 md:py-28 overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, hsl(var(--primary-foreground)) 1px, transparent 1px)",
                  backgroundSize: "100px 100%",
                }}
                aria-hidden
              />
              <div className="relative z-10 grid md:grid-cols-12 gap-10 items-end">
                <div className="md:col-span-7">
                  <p className="eyebrow text-primary-foreground/50 mb-8 flex items-center gap-3">
                    <span className="inline-block w-8 h-px bg-primary-foreground/40" />
                    03 — Contatti
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-primary-foreground leading-[1.05] tracking-tight" style={{ textWrap: "balance" as any }}>
                    Una <span className="italic">conversazione</span>
                    <br />
                    può cambiare un esito.
                  </h2>
                </div>
                <div className="md:col-span-4 md:col-start-9">
                  <p className="text-primary-foreground/65 mb-10 leading-[1.8] font-light text-[15px]">
                    Ogni mandato comincia con un ascolto attento. Vi
                    invitiamo a fissare un primo incontro, in studio o
                    da remoto.
                  </p>
                  <div className="flex flex-col gap-5">
                    <Link
                      to="/consulenza"
                      className="group inline-flex items-center justify-between gap-3 text-sm tracking-wide text-primary-foreground border-b border-primary-foreground/40 pb-2 hover:border-primary-foreground transition-colors"
                    >
                      Richiedi consulenza
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    <a
                      href="tel:+390817511775"
                      className="inline-flex items-center justify-between gap-3 text-sm tracking-wide text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      <span className="flex items-center gap-2"><Phone size={13} strokeWidth={1.5} /> Napoli — 081 7511775</span>
                    </a>
                    <a
                      href="tel:+390698357515"
                      className="inline-flex items-center justify-between gap-3 text-sm tracking-wide text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      <span className="flex items-center gap-2"><Phone size={13} strokeWidth={1.5} /> Roma — 06 98357515</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Logo className="h-10 w-auto" />
              </div>
              <p className="text-muted-foreground text-sm italic font-serif">"Rem tene verba sequentur"</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 text-sm">
              <div>
                <p className="font-medium text-foreground mb-2">Napoli</p>
                <a href="tel:+390817511775" className="text-muted-foreground hover:text-foreground transition-colors">081 7511775</a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Roma</p>
                <a href="tel:+390698357515" className="text-muted-foreground hover:text-foreground transition-colors">06 98357515</a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Email</p>
                <a href="mailto:avvocato@cosentini.it" className="text-accent hover:underline">
                  avvocato@cosentini.it
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Studio Legale Cosentini. Tutti i diritti riservati.</p>
            <div className="flex gap-6">
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
