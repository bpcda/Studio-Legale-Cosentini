import { Phone, Mail, MapPin, ChevronRight, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ScrollReveal from "@/components/ScrollReveal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logoCosentini from "@/assets/logo-cosentini.png";

interface TeamMember {
  id: string;
  full_name: string;
  role_title: string;
  short_description: string;
  long_description: string;
  email: string;
  phone: string;
  photo_url: string;
  display_order: number;
}

const LoStudio = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setMembers(data);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Lo Studio"
        description="Scopri lo Studio Legale Cosentini: chi siamo, le nostre competenze e il nostro team di avvocati a Napoli e Roma."
        path="/lo-studio"
      />
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-8" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              Home
            </Link>
            <Link to="/consulenza">
              <Button size="sm">Consulenza</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <p
              className="text-accent font-serif italic text-lg mb-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              "Rem tene verba sequentur"
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-primary-foreground leading-[1.08] mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "250ms", textWrap: "balance" as any }}
            >
              Lo Studio
            </h1>
            <p
              className="text-primary-foreground/70 text-base md:text-lg max-w-xl leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              Assistenza e consulenza legale qualificata con esperienza consolidata.
              Sedi operative a Napoli e Roma, operiamo su tutto il territorio nazionale.
            </p>
          </div>
        </div>
      </section>

      {/* Chi siamo */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">Chi siamo</p>
              <h2
                className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-8 leading-tight"
                style={{ textWrap: "balance" as any }}
              >
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
        </div>
      </section>

      {/* Team */}
      {members.length > 0 && (
        <section className="py-20 md:py-28 bg-card">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">Il Team</p>
                <h2
                  className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight"
                  style={{ textWrap: "balance" as any }}
                >
                  I professionisti dello studio
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, i) => (
                <ScrollReveal key={member.id} delay={i * 80}>
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="w-full text-left group rounded-xl border border-border bg-background overflow-hidden hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    {member.photo_url ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={member.photo_url}
                          alt={member.full_name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <span className="text-4xl font-serif font-semibold text-muted-foreground/40">
                          {member.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-semibold text-foreground text-lg mb-1">{member.full_name}</h3>
                      {member.role_title && (
                        <p className="text-accent text-sm font-medium mb-3">{member.role_title}</p>
                      )}
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {member.short_description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-accent text-xs font-medium mt-4">
                        Scopri di più <ChevronRight size={12} />
                      </span>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contatti rapidi */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-medium text-sm tracking-widest uppercase mb-4">Contatti</p>
              <h2
                className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight"
                style={{ textWrap: "balance" as any }}
              >
                Come raggiungerci
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6">
            <ScrollReveal delay={0}>
              <a href="tel:+390817511775" className="block group">
                <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300">
                  <Phone size={20} className="text-accent mb-4" />
                  <p className="font-medium text-foreground text-sm mb-1">Sede di Napoli</p>
                  <p className="text-foreground font-semibold">081 7511775</p>
                </div>
              </a>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <a href="tel:+390698357515" className="block group">
                <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300">
                  <Phone size={20} className="text-accent mb-4" />
                  <p className="font-medium text-foreground text-sm mb-1">Sede di Roma</p>
                  <p className="text-foreground font-semibold">06 98357515</p>
                </div>
              </a>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <a href="mailto:avvocato@cosentini.it" className="block group">
                <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:shadow-foreground/5 transition-shadow duration-300">
                  <Mail size={20} className="text-accent mb-4" />
                  <p className="font-medium text-foreground text-sm mb-1">Email</p>
                  <p className="text-accent font-semibold">avvocato@cosentini.it</p>
                </div>
              </a>
            </ScrollReveal>
          </div>

          <div className="mt-10 text-center">
            <Link to="/consulenza">
              <Button size="lg" className="active:scale-[0.97] transition-transform">
                Richiedi una consulenza
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Studio Legale Cosentini. Tutti i diritti riservati.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Member detail dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                {selectedMember.photo_url && (
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-border">
                    <img
                      src={selectedMember.photo_url}
                      alt={selectedMember.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <DialogTitle className="text-center text-xl font-serif">
                  {selectedMember.full_name}
                </DialogTitle>
                {selectedMember.role_title && (
                  <p className="text-accent text-sm font-medium text-center">{selectedMember.role_title}</p>
                )}
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {selectedMember.long_description || selectedMember.short_description}
                </p>

                {(selectedMember.email || selectedMember.phone) && (
                  <div className="pt-4 border-t border-border space-y-2">
                    {selectedMember.email && (
                      <a href={`mailto:${selectedMember.email}`} className="flex items-center gap-2 text-sm text-accent hover:underline">
                        <Mail size={14} />
                        {selectedMember.email}
                      </a>
                    )}
                    {selectedMember.phone && (
                      <a href={`tel:${selectedMember.phone}`} className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                        <Phone size={14} />
                        {selectedMember.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoStudio;
