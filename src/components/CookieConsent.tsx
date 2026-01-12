import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent-status";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentStatus) {
      // Small delay for better UX - don't show immediately on page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-up">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 pr-4">
              <h3 className="font-heading font-semibold text-foreground mb-1">
                Cookie Preferences
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your browsing experience and analyze site traffic. 
                By clicking "Accept", you consent to our use of cookies. See our{" "}
                <a 
                  href="/privacy" 
                  className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
                >
                  Privacy Policy
                </a>{" "}
                for more details.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground"
              >
                Decline
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={handleAccept}
              >
                Accept
              </Button>
            </div>

            <button
              onClick={handleDecline}
              className="absolute top-3 right-3 sm:hidden text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
