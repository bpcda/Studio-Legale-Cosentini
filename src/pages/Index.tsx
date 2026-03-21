import { Phone, Mail, MapPin, Scale, FileText, Shield, Landmark, Briefcase, Building2, ChevronDown, Menu, X, ExternalLink, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/ScrollReveal";
import { useState, useEffect } from "react";
import logoCosentini from "@/assets/logo-cosentini.png";
import { supabase } from "@/lib/supabase";

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
  const { articles, isLoading: articlesLoading } = useLinkedInArticles();

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
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center" aria-label="Introduzione">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(32_60%_48%/0.08),transparent_60%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p
              className="text-accent font-serif italic text-lg md:text-xl mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              "Rem tene verba sequentur"
            </p>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold text-primary-foreground leading-[1.05] mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "250ms", textWrap: "balance" as any }}
            >
              Studio Legale Cosentini
            </h1>
            <p
              className="text-primary-foreground/70 text-base md:text-lg max-w-lg mb-10 leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              Assistenza e consulenza legale qualificata con esperienza consolidata.
              Sedi a Napoli e Roma.
            </p>
            <div
              className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "550ms" }}
            >
              <a href="#servizi">
                <Button
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 active:scale-[0.97] transition-transform"
                >
                  I nostri servizi
                </Button>
              </a>
              <Link to="/consulenza">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-transform">
                  Richiedi consulenza
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Link
          to="/lo-studio"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/40 animate-bounce"
          aria-label="Scorri verso il basso"
        >
          <ChevronDown size={24} />
        </Link>
      </section>

      {/* Services */}
      <section id="servizi" className="py-24 md:py-32 bg-card" aria-label="Servizi legali">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4 text-center">Aree di competenza</p>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-16 text-center leading-tight" style={{ textWrap: "balance" as any }}>
              I nostri servizi
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <article className="group h-full p-8 rounded-lg bg-background border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-0.5">
                  <service.icon
                    size={28}
                    strokeWidth={1.5}
                    className="text-accent mb-5 transition-transform duration-300 group-hover:scale-105"
                  />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed" style={{ overflowWrap: "break-word" }}>
                    {service.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Articles / LinkedIn */}
      <section id="articoli" className="py-24 md:py-32" aria-label="Articoli e pubblicazioni">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4 text-center">Pubblicazioni</p>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-4 text-center leading-tight" style={{ textWrap: "balance" as any }}>
              Articoli e approfondimenti
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
              Aggiornamenti e analisi dal mondo del diritto a cura dell'Avv. Sergio Cosentini.
            </p>
          </ScrollReveal>

          {articlesLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-6 rounded-lg border border-border bg-card space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {articles.slice(0, 5).map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 100}>
                  <article className="group h-full flex flex-col p-6 rounded-lg border border-border bg-card hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar size={12} />
                      <time dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      {article.source && (
                        <span className="ml-auto text-accent/70 text-[11px] font-medium uppercase tracking-wider">{article.source}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1" style={{ overflowWrap: "break-word" }}>
                      {article.excerpt}
                    </p>
                    <a
                      href={article.url}
                      className="inline-flex items-center gap-1.5 text-sm text-accent font-medium mt-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Leggi l'articolo
                      <ExternalLink size={13} />
                    </a>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <a
                href="https://www.linkedin.com/in/scosentini/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2 active:scale-[0.97] transition-transform">
                  Segui su LinkedIn
                  <ExternalLink size={14} />
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section id="contatti" className="py-24 md:py-32 bg-card" aria-label="Contattaci">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="relative bg-primary rounded-lg p-12 md:p-16 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(32_60%_48%/0.1),transparent_60%)]" />
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-primary-foreground mb-4 leading-tight" style={{ textWrap: "balance" as any }}>
                  Hai bisogno di una consulenza legale?
                </h2>
                <p className="text-primary-foreground/70 mb-8 leading-relaxed">
                  Non esitare a contattarci. Lo studio Cosentini offre ai propri clienti
                  la garanzia di un'assistenza qualificata e personalizzata.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/consulenza">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-transform gap-2">
                      <Mail size={16} />
                      Richiedi consulenza
                    </Button>
                  </Link>
                  <a href="tel:+390817511775">
                    <Button
                      variant="outline"
                      className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 active:scale-[0.97] transition-transform gap-2"
                    >
                      <Phone size={16} />
                      081 7511775
                    </Button>
                  </a>
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
