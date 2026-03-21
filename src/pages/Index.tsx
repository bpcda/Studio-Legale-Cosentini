import { Phone, Mail, MapPin, Scale, FileText, Shield, Landmark, Briefcase, Building2, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";

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
  { label: "Lo Studio", href: "#studio" },
  { label: "Servizi", href: "#servizi" },
  { label: "Contatti", href: "#contatti" },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-lg font-semibold tracking-tight">SC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium tracking-wide text-foreground">Studio Legale</span>
              <span className="block text-xs text-muted-foreground tracking-widest uppercase">Cosentini</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            <a href="mailto:avvocato@cosentini.it">
              <Button size="sm" className="active:scale-[0.97] transition-transform">
                Consulenza
              </Button>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm text-muted-foreground py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a href="mailto:avvocato@cosentini.it">
              <Button size="sm" className="w-full mt-2">Consulenza</Button>
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-16 min-h-[85vh] flex items-center">
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
              style={{ animationDelay: "250ms", textWrap: "balance" }}
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
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97] transition-transform"
                >
                  I nostri servizi
                </Button>
              </a>
              <a href="#contatti">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-transform">
                  Richiedi consulenza
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#studio"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/40 animate-bounce"
        >
          <ChevronDown size={24} />
        </a>
      </section>

      {/* About / Lo Studio */}
      <section id="studio" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">Lo Studio</p>
              <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-8 leading-tight" style={{ textWrap: "balance" }}>
                Esperienza e competenza al servizio dei vostri diritti
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-2xl mx-auto" style={{ overflowWrap: "break-word" }}>
                Lo Studio Legale Cosentini offre ai propri clienti la garanzia che le attività 
                di assistenza e consulenza derivano dalla diretta esperienza dei suoi componenti. 
                Con sedi operative a Napoli e Roma, lo studio opera su tutto il territorio nazionale 
                con un approccio rigoroso e orientato ai risultati.
              </p>
            </div>
          </ScrollReveal>

          {/* Contact cards */}
          <div className="grid sm:grid-cols-3 gap-6 mt-16">
            <ScrollReveal delay={0}>
              <div className="group p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300">
                <MapPin size={20} className="text-accent mb-4" />
                <p className="font-medium text-foreground text-sm mb-1">Napoli</p>
                <p className="text-muted-foreground text-sm">081 7511775</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="group p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300">
                <MapPin size={20} className="text-accent mb-4" />
                <p className="font-medium text-foreground text-sm mb-1">Roma</p>
                <p className="text-muted-foreground text-sm">06 98357515</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <div className="group p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300">
                <Mail size={20} className="text-accent mb-4" />
                <p className="font-medium text-foreground text-sm mb-1">Email</p>
                <a href="mailto:avvocato@cosentini.it" className="text-accent text-sm hover:underline">
                  avvocato@cosentini.it
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servizi" className="py-24 md:py-32 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4 text-center">Aree di competenza</p>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-foreground mb-16 text-center leading-tight" style={{ textWrap: "balance" }}>
              I nostri servizi
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <div className="group h-full p-8 rounded-lg bg-background border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-0.5">
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
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contatti" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="relative bg-primary rounded-lg p-12 md:p-16 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(32_60%_48%/0.1),transparent_60%)]" />
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-primary-foreground mb-4 leading-tight" style={{ textWrap: "balance" }}>
                  Hai bisogno di una consulenza legale?
                </h2>
                <p className="text-primary-foreground/70 mb-8 leading-relaxed">
                  Non esitare a contattarci. Lo studio Cosentini offre ai propri clienti 
                  la garanzia di un'assistenza qualificata e personalizzata.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:avvocato@cosentini.it">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-transform gap-2">
                      <Mail size={16} />
                      Scrivici
                    </Button>
                  </a>
                  <a href="tel:+390817511775">
                    <Button
                      variant="outline"
                      className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97] transition-transform gap-2"
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
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-serif text-sm font-semibold">SC</span>
                </div>
                <span className="font-serif text-lg font-semibold text-foreground">Studio Legale Cosentini</span>
              </div>
              <p className="text-muted-foreground text-sm italic font-serif">"Rem tene verba sequentur"</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 text-sm">
              <div>
                <p className="font-medium text-foreground mb-2">Napoli</p>
                <p className="text-muted-foreground">081 7511775</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Roma</p>
                <p className="text-muted-foreground">06 98357515</p>
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
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
