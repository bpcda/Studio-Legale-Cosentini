import { useState } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Video, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/ScrollReveal";
import logoCosentini from "@/assets/logo-cosentini.png";

const serviceTypes = [
  { value: "generico", label: "Consulenza Generica" },
  { value: "civile", label: "Diritto Civile" },
  { value: "amministrativo", label: "Diritto Amministrativo" },
  { value: "patrimoniale", label: "Patrimoniale & Wealth Management" },
  { value: "trust", label: "Trust" },
  { value: "231", label: "Responsabilità 231/01" },
  { value: "recupero-crediti", label: "Recupero Crediti" },
  { value: "custodia", label: "Custodia e Amministrazione Giudiziaria" },
];

const MESSAGE_TEMPLATE = `Gentile Studio Legale Cosentini,

desidero richiedere una consulenza in merito a:

[Descriva brevemente la sua esigenza]

Resto a disposizione per concordare data e orario.

Cordiali saluti`;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const Consulenza = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState(MESSAGE_TEMPLATE);
  const [consultationMode, setConsultationMode] = useState<string>("webcall");

  const isValid = fullName.trim() && email.trim() && phone.trim() && serviceType && message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service_type: serviceType,
      message: message.trim(),
      consultation_mode: consultationMode,
    };

    try {
      // Try Supabase first
      if (SUPABASE_URL && SUPABASE_KEY) {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/consultation_requests`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          // Trigger email edge function (fire-and-forget)
          fetch(`${SUPABASE_URL}/functions/v1/send-consultation-email`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }).catch(() => {});
        }
      }

      toast({
        title: "Richiesta inviata",
        description: "La contatteremo al più presto per concordare la consulenza.",
      });

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setServiceType("");
      setMessage(MESSAGE_TEMPLATE);
      setConsultationMode("webcall");
    } catch {
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
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-10" width={80} height={80} />
            <span className="font-serif text-lg font-semibold text-foreground hidden sm:inline">
              Studio Legale Cosentini
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 active:scale-[0.97] transition-transform">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Torna al sito</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Left — Info */}
          <div className="md:col-span-2">
            <ScrollReveal>
              <h1
                className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-[1.1] mb-4"
                style={{ textWrap: "balance" } as any}
              >
                Richiedi una Consulenza
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Compili il modulo con le sue informazioni e la natura della sua richiesta.
                Lo Studio la contatterà per concordare data, orario e modalità della consulenza.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="space-y-6">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Modalità disponibili
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                    <div className="p-2 rounded-md bg-accent/10 text-accent mt-0.5">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Videochiamata</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                        Consulenza da remoto via piattaforma da concordare con lo Studio.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                    <div className="p-2 rounded-md bg-accent/10 text-accent mt-0.5">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Di persona</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                        Presso la sede di Napoli o Roma, in base alle disponibilità dello Studio.
                      </p>
                    </div>
                  </div>
                </div>

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
            </ScrollReveal>
          </div>

          {/* Right — Form */}
          <div className="md:col-span-3">
            <ScrollReveal delay={80}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Mario Rossi"
                    required
                    maxLength={100}
                  />
                </div>

                {/* Email + Phone row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
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
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+39 333 1234567"
                      required
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Service type */}
                <div className="space-y-2">
                  <Label>Tipo di servizio *</Label>
                  <Select value={serviceType} onValueChange={setServiceType} required>
                    <SelectTrigger>
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

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    required
                    maxLength={2000}
                    className="resize-y"
                  />
                </div>

                {/* Consultation mode */}
                <div className="space-y-3">
                  <Label>Modalità di consulenza preferita *</Label>
                  <RadioGroup value={consultationMode} onValueChange={setConsultationMode} className="grid sm:grid-cols-2 gap-3">
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

                <p className="text-xs text-muted-foreground">
                  La modalità, la data e l'orario della consulenza saranno concordati direttamente con lo Studio.
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 active:scale-[0.97] transition-transform"
                  disabled={!isValid || isSubmitting}
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
            </ScrollReveal>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Consulenza;
