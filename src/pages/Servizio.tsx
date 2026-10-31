import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import services from "@/data/services.json";
import logoCosentini from "@/assets/logo-cosentini.png";
import NotFound from "./NotFound";

const Servizio = () => {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <SEO title={service.title} description={service.description} path={`/servizi/${service.slug}`} />
      <nav aria-label="Navigazione del servizio" className="bg-background">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Studio Legale Cosentini — Home">
            <img src={logoCosentini} alt="" className="h-12 w-auto" width={48} height={48} />
          </Link>
          <Link to="/#servizi" className="inline-flex items-center gap-2 min-h-11 text-sm">
            <ArrowLeft size={16} aria-hidden="true" /> Tutti i servizi
          </Link>
        </div>
      </nav>
      <main>
        <section className="bg-primary text-primary-foreground py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h1 className="font-serif text-4xl md:text-6xl leading-tight max-w-3xl">{service.title}</h1>
            <p className="text-lg leading-relaxed mt-6 max-w-2xl">{service.description}</p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to={`/consulenza?servizio=${service.serviceType}`}>
                Richiedi un appuntamento <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 md:gap-20">
          <section aria-labelledby="assistenza-title">
            <h2 id="assistenza-title" className="font-serif text-3xl md:text-4xl mb-6">Come possiamo assisterla</h2>
            <ul className="space-y-4 list-disc pl-5 leading-relaxed">
              {service.topics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </section>
          <section aria-labelledby="incontro-title" className="bg-card p-6 md:p-10">
            <h2 id="incontro-title" className="font-serif text-3xl md:text-4xl mb-6">Il primo incontro</h2>
            <p className="leading-relaxed">Descriva brevemente la sua esigenza nel modulo. Lo Studio la ricontatterà per concordare un incontro a Napoli, a Roma o in videochiamata.</p>
            <p className="leading-relaxed mt-4">Potrà indicare le date rilevanti e i documenti di cui dispone. Le modalità per condividere la documentazione saranno concordate con lo Studio.</p>
            <Link to="/lo-studio" className="inline-flex items-center gap-2 mt-6 min-h-11 underline underline-offset-4">
              Conosca lo Studio <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
      <footer className="bg-card py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-wrap justify-between gap-4 text-sm">
          <p>Studio Legale Cosentini · Napoli e Roma</p>
          <Link to="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Servizio;
