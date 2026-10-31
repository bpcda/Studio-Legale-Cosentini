import { ArrowLeft, ArrowRight, ExternalLink, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { databases, isConfigured, Query, DB_ID, COLLECTIONS, normalizeDocs } from "@/lib/appwrite";
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
}

const LoStudio = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchMembers = async () => {
      try {
        if (isConfigured) {
          const res = await databases.listDocuments(DB_ID, COLLECTIONS.team_members, [
            Query.orderAsc("display_order"),
            Query.limit(100),
          ]);
          if (active) setMembers(normalizeDocs<TeamMember>(res.documents));
        }
      } catch (err) {
        console.error("fetchMembers error:", err);
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMembers();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Lo Studio" description="Conosca lo Studio Legale Cosentini, i professionisti e le sedi di Napoli e Roma. Consulenze anche da remoto." path="/lo-studio" />
      <nav aria-label="Navigazione dello Studio" className="bg-background">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Studio Legale Cosentini — Home">
            <img src={logoCosentini} alt="" className="h-12 w-auto" width={48} height={48} />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 min-h-11 text-sm"><ArrowLeft size={16} aria-hidden="true" />Home</Link>
            <Button asChild size="sm"><Link to="/consulenza">Consulenza</Link></Button>
          </div>
        </div>
      </nav>
      <main>
        <section className="bg-primary text-primary-foreground py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">Lo Studio</h1>
            <div>
              <p className="text-lg leading-relaxed">Dal 1998, assistenza legale per imprese, patrimoni e persone. Due sedi a Napoli e Roma, operatività su tutto il territorio nazionale.</p>
              <p className="font-serif italic text-xl mt-6">« Rem tene, verba sequentur »</p>
            </div>
          </div>
        </section>
        <section aria-labelledby="professionisti-title" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h2 id="professionisti-title" className="font-serif text-4xl md:text-5xl mb-6">I professionisti</h2>
            <p className="max-w-2xl leading-relaxed mb-10">Le attività di assistenza e consulenza dello Studio si fondano sull'esperienza diretta dei suoi componenti.</p>
            {loading ? (
              <div role="status" aria-label="Caricamento professionisti" className="space-y-4"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-24 w-full" /></div>
            ) : members.length > 0 ? (
              <div className="space-y-12">
                {members.map((member) => (
                  <article key={member.id} className={`grid gap-6 md:gap-10 ${member.photo_url ? "md:grid-cols-[14rem_1fr]" : "md:grid-cols-1"}`}>
                    {member.photo_url && <img src={member.photo_url} alt={member.full_name} className="w-full max-w-sm aspect-[4/5] object-cover" loading="lazy" />}
                    <div>
                      <h3 className="font-serif text-3xl">{member.full_name}</h3>
                      {member.role_title && <p className="font-medium mt-2">{member.role_title}</p>}
                      <p className="leading-relaxed mt-4 whitespace-pre-line max-w-2xl">{member.short_description}</p>
                      {member.long_description && member.long_description !== member.short_description && (
                        <details className="mt-4">
                          <summary className="cursor-pointer min-h-11 py-2 underline underline-offset-4">Profilo completo di {member.full_name}</summary>
                          <p className="leading-relaxed whitespace-pre-line max-w-2xl mt-3">{member.long_description}</p>
                        </details>
                      )}
                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        {member.email && <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 min-h-11 break-all text-sm"><Mail size={16} aria-hidden="true" />{member.email}</a>}
                        {member.phone && <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 min-h-11 text-sm"><Phone size={16} aria-hidden="true" />{member.phone}</a>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-card p-6 md:p-10">
                <h3 className="font-serif text-3xl">Avv. Sergio Cosentini</h3>
                <p className="leading-relaxed mt-4 max-w-2xl">A cura dell'Avv. Sergio Cosentini gli articoli e gli approfondimenti giuridici pubblicati sul sito dello Studio.</p>
                <Link to="/articoli" className="inline-flex items-center gap-2 min-h-11 mt-4 underline underline-offset-4">Legga le pubblicazioni <ArrowRight size={16} aria-hidden="true" /></Link>
                {loadError && <p role="status" className="text-sm mt-4">I profili non sono disponibili al momento. Per informazioni sui professionisti contatti lo Studio.</p>}
              </div>
            )}
          </div>
        </section>
        <section className="bg-card py-14 md:py-20" aria-labelledby="incontro-title">
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 md:gap-16">
            <h2 id="incontro-title" className="font-serif text-4xl md:text-5xl leading-tight">Si parte dall'ascolto</h2>
            <div>
              <p className="leading-relaxed">Ogni mandato comincia con una conversazione. Descriva la sua esigenza: lo Studio la ricontatterà per concordare un primo incontro, in presenza o in videochiamata.</p>
              <Button asChild size="lg" className="mt-6 px-5"><Link to="/consulenza">Richiedi un appuntamento <ArrowRight size={16} aria-hidden="true" /></Link></Button>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24" aria-labelledby="sedi-title">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h2 id="sedi-title" className="font-serif text-4xl md:text-5xl mb-10">Le nostre sedi</h2>
            <div className="grid md:grid-cols-2 gap-10 md:gap-16">
              <div>
                <h3 className="font-serif text-3xl">Napoli</h3>
                <address className="not-italic mt-4 leading-relaxed">Via Nuova del Campo 14<br />80141 Napoli</address>
                <a href="https://www.google.com/maps/search/?api=1&query=Via+Nuova+del+Campo+14+80141+Napoli" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-11 mt-3 underline underline-offset-4">Indicazioni per Napoli <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (nuova scheda)</span></a>
                <a href="tel:+390817511775" className="flex items-center gap-2 min-h-11"><Phone size={16} aria-hidden="true" />081 7511775</a>
              </div>
              <div>
                <h3 className="font-serif text-3xl">Roma</h3>
                <p className="mt-4 leading-relaxed">Contatti lo Studio per concordare l'appuntamento e ricevere le indicazioni per raggiungere la sede.</p>
                <a href="tel:+390698357515" className="flex items-center gap-2 min-h-11 mt-3"><Phone size={16} aria-hidden="true" />06 98357515</a>
              </div>
            </div>
            <a href="mailto:avvocato@cosentini.it" className="inline-flex items-center gap-2 min-h-11 mt-8 break-all"><Mail size={16} aria-hidden="true" />avvocato@cosentini.it</a>
          </div>
        </section>
      </main>
      <footer className="bg-card py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-wrap justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Studio Legale Cosentini</p>
          <div className="flex gap-6"><Link to="/privacy-policy">Privacy Policy</Link><Link to="/cookie-policy">Cookie Policy</Link></div>
        </div>
      </footer>
    </div>
  );
};

export default LoStudio;
