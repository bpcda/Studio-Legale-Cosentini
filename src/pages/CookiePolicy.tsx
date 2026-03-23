import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCosentini from "@/assets/logo-cosentini.png";
import SEO from "@/components/SEO";

const CookiePolicy = () => {
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
          Cookie Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Ai sensi dell'art. 13 del Regolamento (UE) 2016/679 e della Direttiva 2002/58/CE (ePrivacy)
        </p>

        <div className="prose prose-sm max-w-none text-foreground/90 space-y-8">
          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">1. Cosa sono i cookie</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I cookie sono piccoli file di testo che i siti web visitati inviano al dispositivo dell'utente (computer, tablet, smartphone), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie permettono al sito di ricordare le azioni e preferenze dell'utente nel tempo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">2. Tipologie di cookie utilizzati</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Cookie tecnici (necessari)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Sono essenziali per il funzionamento del sito e non possono essere disabilitati. Includono cookie di sessione per la navigazione, cookie di preferenze (es. scelta della lingua, consenso ai cookie) e cookie di sicurezza. Non richiedono il consenso dell'utente (art. 122, comma 1, D.Lgs. 196/2003 e Linee Guida del Garante del 10 giugno 2021).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Cookie di autenticazione</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Utilizzati per gestire le sessioni di accesso alle aree riservate del sito (es. dashboard amministrativa). Sono classificati come cookie tecnici e non richiedono consenso.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Cookie analitici (opzionali)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Questo sito attualmente non utilizza cookie analitici di terze parti. Qualora venissero implementati in futuro, il banner di consenso verrà aggiornato di conseguenza e sarà richiesto il consenso esplicito dell'utente prima della loro installazione.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Cookie di profilazione</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Questo sito <strong className="text-foreground">non utilizza</strong> cookie di profilazione o di marketing.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">3. Cookie di terze parti</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Il sito utilizza servizi di terze parti che potrebbero installare cookie propri:
            </p>
            <div className="mt-3 rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium text-foreground">Servizio</th>
                    <th className="text-left px-4 py-2 font-medium text-foreground">Finalità</th>
                    <th className="text-left px-4 py-2 font-medium text-foreground">Tipo</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-border">
                    <td className="px-4 py-2">Supabase</td>
                    <td className="px-4 py-2">Autenticazione e database</td>
                    <td className="px-4 py-2">Tecnico</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">4. Gestione dei cookie</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              L'utente può gestire le preferenze sui cookie in qualsiasi momento attraverso le impostazioni del proprio browser. Di seguito i link alle istruzioni per i browser più diffusi:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Microsoft Edge</a></li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground mt-3">
              La disabilitazione dei cookie tecnici potrebbe compromettere il funzionamento di alcune aree del sito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">5. Base giuridica</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I cookie tecnici sono installati sulla base del legittimo interesse del Titolare (art. 6(1)(f) GDPR) e non richiedono il consenso dell'utente. Eventuali cookie analitici o di profilazione verranno installati solo previo consenso esplicito dell'utente (art. 6(1)(a) GDPR), raccolto tramite il banner presente sul sito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">6. Diritti dell'interessato</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Per l'esercizio dei diritti relativi al trattamento dei dati personali tramite cookie, si rimanda alla nostra{" "}
              <Link to="/privacy-policy" className="text-accent hover:underline">Informativa sulla Privacy</Link>.
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

export default CookiePolicy;
