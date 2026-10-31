import { useState } from "react";
import { ExecutionMethod } from "appwrite";
import SEO from "@/components/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import logoCosentini from "@/assets/logo-cosentini.png";
import {
  account,
  databases,
  functions,
  isConfigured,
  ID,
  Permission,
  Role,
  DB_ID,
  COLLECTIONS,
  FUNCTIONS,
} from "@/lib/appwrite";

const serviceTypes = [
  { value: "generico", label: "Non so quale area scegliere" },
  { value: "civile", label: "Diritto Civile" },
  { value: "amministrativo", label: "Diritto Amministrativo" },
  { value: "patrimoniale", label: "Patrimoniale & Wealth Management" },
  { value: "trust", label: "Trust" },
  { value: "231", label: "Responsabilità 231/01" },
  { value: "recupero-crediti", label: "Recupero Crediti" },
  { value: "custodia", label: "Custodia e Amministrazione Giudiziaria" },
];

const Consulenza = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState(() => {
    const requested = searchParams.get("servizio");
    return serviceTypes.some((service) => service.value === requested) ? requested : "generico";
  });
  const [message, setMessage] = useState("");
  const [consultationMode, setConsultationMode] = useState<string>("webcall");

  const isValid = fullName.trim() && email.trim() && phone.trim() && message.trim()
    && serviceTypes.some((service) => service.value === serviceType);

  /**
   * Make sure we have *some* Appwrite session before writing the doc / invoking the function.
   * If the visitor isn't logged in, create a short-lived anonymous session (idempotent: if one
   * already exists, account.get() succeeds and we skip).
   */
  const ensureSession = async () => {
    try {
      await account.get();
    } catch {
      await account.createAnonymousSession();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitted(false);
    if (!isValid) {
      setSubmissionError("Compili tutti i campi obbligatori e descriva brevemente la sua esigenza.");
      return;
    }
    if (!isConfigured) {
      setSubmissionError("Il modulo non è disponibile al momento. Può contattare lo Studio telefonicamente o via email ai recapiti indicati.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service_type: serviceType,
      message: message.trim(),
      consultation_mode: consultationMode,
      status: "pending",
    };

    try {
      await ensureSession();

      // Store the request. Per-document permissions: only admins can read/update/delete.
      await databases.createDocument(
        DB_ID,
        COLLECTIONS.consultation_requests,
        ID.unique(),
        payload,
        [
          Permission.read(Role.label("admin")),
          Permission.update(Role.label("admin")),
          Permission.delete(Role.label("admin")),
        ]
      );

      // Fire-and-forget email notification
      functions
        .createExecution(
          FUNCTIONS.send_consultation_email,
          JSON.stringify(payload),
          true, // async
          "/",
          ExecutionMethod.POST
        )
        .catch((err) => console.error("Email function error:", err));

      toast({
        title: "Richiesta inviata",
        description: "La contatteremo al più presto per concordare la consulenza.",
      });

      setFullName("");
      setEmail("");
      setPhone("");
      setServiceType("generico");
      setMessage("");
      setConsultationMode("webcall");
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmissionError("La richiesta non è stata inviata. I dati inseriti sono ancora nel modulo: riprovi o contatti lo Studio telefonicamente.");
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprovi o ci contatti telefonicamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Richiedi una Consulenza"
        description="Richiedi una consulenza legale allo Studio Legale Cosentini. Disponibile in presenza a Napoli e Roma o in videoconferenza."
        path="/consulenza"
      />
      {/* Header */}
      <nav aria-label="Navigazione della consulenza" className="bg-background">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-10" width={80} height={80} />
            <span className="font-serif text-lg font-semibold text-foreground hidden sm:inline">
              Studio Legale Cosentini
            </span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft size={16} />
              Torna al sito
            </Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Left — Info */}
          <div className="md:col-span-2">
            <div>
              <h1
                className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-[1.1] mb-4"
                style={{ textWrap: "balance" }}
              >
                Richiedi una consulenza
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Compili il modulo con le sue informazioni e la natura della sua richiesta.
                Lo Studio la contatterà per concordare data, orario e modalità della consulenza.
              </p>
            </div>

            <div>
              <div className="space-y-6">
                <h2 className="font-serif text-2xl">Preferisce parlarne?</h2>
                <p className="text-muted-foreground leading-relaxed">Può contattare direttamente una delle sedi o scriverci via email.</p>

                <div className="pt-4 border-t border-border space-y-3">
                  <a href="tel:+390817511775" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Phone size={14} />
                    Napoli: 081 751 1775
                  </a>
                  <a href="tel:+390698357515" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Phone size={14} />
                    Roma: 06 9835 7515
                  </a>
                  <a href="mailto:avvocato@cosentini.it" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Mail size={14} />
                    avvocato@cosentini.it
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6" aria-label="Richiesta di consulenza" aria-busy={isSubmitting}>
                <p className="text-sm text-muted-foreground">I campi contrassegnati con * sono obbligatori.</p>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo *</Label>
                  <Input
                    id="fullName"
                    name="name"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Mario Rossi"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mario.rossi@email.it"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      name="tel"
                      autoComplete="tel"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+39 333 1234567"
                      required
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Area di assistenza *</Label>
                  <Select value={serviceType} onValueChange={setServiceType} required>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Seleziona il tipo di consulenza" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Di cosa ha bisogno? *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Descriva brevemente la sua esigenza. Non serve una lettera formale."
                    aria-describedby="message-help"
                    required
                    maxLength={2000}
                    className="resize-y"
                  />
                  <p id="message-help" className="text-sm text-muted-foreground">Bastano poche righe. Le modalità per condividere documenti e dettagli riservati saranno concordate con lo Studio.</p>
                </div>

                <div className="space-y-3">
                  <Label id="mode-label">Modalità di consulenza preferita *</Label>
                  <RadioGroup aria-labelledby="mode-label" value={consultationMode} onValueChange={setConsultationMode} className="grid sm:grid-cols-2 gap-3">
                    <label
                      htmlFor="mode-webcall"
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        consultationMode === "webcall"
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value="webcall" id="mode-webcall" />
                      <div>
                        <p className="font-medium text-sm text-foreground">Videochiamata</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Da remoto, modalità da concordare</p>
                      </div>
                    </label>
                    <label
                      htmlFor="mode-persona"
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        consultationMode === "persona"
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value="persona" id="mode-persona" />
                      <div>
                        <p className="font-medium text-sm text-foreground">Di persona</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Presso lo Studio, su disponibilità</p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                <p className="text-sm text-muted-foreground">
                  Dopo l'invio lo Studio la ricontatterà per concordare data, orario e modalità dell'incontro. I dati saranno trattati per gestire la richiesta, come descritto nella <Link to="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link>.
                </p>

                {submissionError && <p role="alert" className="text-destructive leading-relaxed">{submissionError}</p>}
                {submitted && <div role="status" className="bg-card p-5 leading-relaxed"><p className="font-medium">Richiesta ricevuta.</p><p>Lo Studio la ricontatterà per concordare l'incontro.</p></div>}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 active:scale-[0.97] transition-transform"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Invio in corso…"
                  ) : (
                    <>
                      <Send size={16} />
                      Invia richiesta
                    </>
                  )}
                </Button>
              </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Consulenza;
