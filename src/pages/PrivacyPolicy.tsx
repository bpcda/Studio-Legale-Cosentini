import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCosentini from "@/assets/logo-cosentini.png";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-10 w-auto" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Torna al sito</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
          Informativa sulla Privacy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Ai sensi dell'art. 13 del Regolamento (UE) 2016/679 (GDPR)
        </p>

        <div className="prose prose-sm max-w-none text-foreground/90 space-y-8">
          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">1. Titolare del trattamento</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Il Titolare del trattamento dei dati è <strong className="text-foreground">Studio Legale Cosentini</strong>, con sedi operative a Napoli e Roma. 
              Per qualsiasi richiesta relativa al trattamento dei dati personali è possibile contattarci all'indirizzo email: <a href="mailto:avvocato@cosentini.it" className="text-accent hover:underline">avvocato@cosentini.it</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">2. Tipologie di dati raccolti</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              I dati personali raccolti tramite questo sito web possono includere:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Dati identificativi: nome, cognome</li>
              <li>Dati di contatto: indirizzo email, numero di telefono</li>
              <li>Dati relativi alla richiesta di consulenza: tipologia di servizio, modalità preferita, messaggio</li>
              <li>Dati di navigazione: indirizzo IP, tipo di browser, pagine visitate (tramite cookie tecnici)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">3. Finalità del trattamento</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              I dati personali sono trattati per le seguenti finalità:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li><strong className="text-foreground">Gestione delle richieste di consulenza:</strong> elaborazione, riscontro e gestione delle richieste pervenute tramite il modulo di contatto (base giuridica: esecuzione di misure precontrattuali, art. 6(1)(b) GDPR).</li>
              <li><strong className="text-foreground">Adempimento di obblighi legali:</strong> conformità a normative fiscali, antiriciclaggio e professionali (base giuridica: obbligo legale, art. 6(1)(c) GDPR).</li>
              <li><strong className="text-foreground">Funzionamento del sito web:</strong> garantire la corretta navigazione e sicurezza del sito (base giuridica: legittimo interesse, art. 6(1)(f) GDPR).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">4. Modalità del trattamento</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I dati personali sono trattati con strumenti elettronici e/o manuali, con logiche strettamente correlate alle finalità sopra indicate e, comunque, in modo da garantire la sicurezza e la riservatezza dei dati stessi. Sono adottate misure tecniche e organizzative adeguate a proteggere i dati da accessi non autorizzati, perdita, distruzione o danneggiamento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">5. Conservazione dei dati</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I dati personali saranno conservati per il tempo strettamente necessario al perseguimento delle finalità per cui sono stati raccolti. In particolare, i dati relativi alle richieste di consulenza saranno conservati per un periodo non superiore a 24 mesi dalla chiusura della pratica, salvo diversi obblighi di legge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">6. Comunicazione e diffusione dei dati</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I dati personali non saranno diffusi. Potranno essere comunicati a soggetti terzi solo nei seguenti casi: fornitori di servizi tecnici (hosting, servizi email) necessari all'erogazione dei servizi del sito; autorità giudiziarie o amministrative, nei casi previsti dalla legge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">7. Trasferimento dei dati all'estero</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Alcuni dei fornitori di servizi utilizzati dal sito potrebbero avere sede al di fuori dello Spazio Economico Europeo. In tali casi, il trasferimento dei dati avviene nel rispetto delle garanzie previste dal GDPR, incluse le Clausole Contrattuali Standard approvate dalla Commissione Europea.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">8. Diritti dell'interessato</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              Ai sensi degli artt. 15-22 del GDPR, l'interessato ha il diritto di:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Accedere ai propri dati personali e ottenerne copia</li>
              <li>Richiedere la rettifica o l'aggiornamento dei dati inesatti</li>
              <li>Richiedere la cancellazione dei dati (diritto all'oblio)</li>
              <li>Limitare il trattamento dei dati</li>
              <li>Opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso prestato in qualsiasi momento</li>
              <li>Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">www.garanteprivacy.it</a>)</li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground mt-3">
              Per esercitare i propri diritti, scrivere a: <a href="mailto:avvocato@cosentini.it" className="text-accent hover:underline">avvocato@cosentini.it</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">9. Modifiche all'informativa</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Il Titolare si riserva il diritto di apportare modifiche alla presente informativa in qualsiasi momento, dandone informazione agli utenti tramite questa pagina. Si invita pertanto a consultare regolarmente la presente pagina.
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
