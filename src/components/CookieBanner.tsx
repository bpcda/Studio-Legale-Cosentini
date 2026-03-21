import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500"
      role="dialog"
      aria-label="Consenso cookie"
    >
      <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card shadow-lg p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <p className="text-sm text-foreground leading-relaxed">
              Questo sito utilizza cookie tecnici necessari al funzionamento. 
              Non utilizziamo cookie di profilazione o marketing. 
              Per maggiori informazioni consulta la nostra{" "}
              <Link to="/cookie-policy" className="text-accent hover:underline font-medium">
                Cookie Policy
              </Link>{" "}
              e la{" "}
              <Link to="/privacy-policy" className="text-accent hover:underline font-medium">
                Privacy Policy
              </Link>.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={accept}
                className="active:scale-[0.97] transition-transform"
              >
                Accetta
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={reject}
                className="active:scale-[0.97] transition-transform"
              >
                Solo necessari
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
