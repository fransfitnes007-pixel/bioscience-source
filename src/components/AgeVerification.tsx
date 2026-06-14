import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LegalPopup } from "@/components/LegalPopup";
import resurrectedLogo from "@/assets/resurrected-logo.png";

export const AgeVerification = () => {
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalPopup, setLegalPopup] = useState<"terms" | "privacy" | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem("age-verified");
    if (!verified) {
      setShowModal(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("age-verified", "true");
    setShowModal(false);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl p-8 md:p-12 max-w-md mx-4 text-center shadow-2xl animate-scale-in">
        <img 
          src={resurrectedLogo} 
          alt="Resurrected" 
          className="h-16 md:h-20 w-auto mx-auto mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
        />
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
          You must be 21 or older to enter
        </h2>
        <p className="font-body text-muted-foreground mb-4">
          By clicking "I am 21+" you confirm that you are at least 21 years of age.
        </p>

        <label className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors text-left mb-6 ${agreedToTerms ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-secondary/20 hover:border-foreground/30"}`}>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-border accent-foreground"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            By checking this box, I acknowledge and agree to the{" "}
            <button
              type="button"
              onClick={() => setLegalPopup("terms")}
              className="underline text-foreground hover:opacity-80"
            >
              Terms &amp; Conditions
            </button>
            ,{" "}
            <button
              type="button"
              onClick={() => setLegalPopup("privacy")}
              className="underline text-foreground hover:opacity-80"
            >
              Privacy Policy
            </button>
            , and confirm that all products are sold strictly for laboratory research use only — not for human or animal consumption. I am 21 years of age or older.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleConfirm}
            variant="hero"
            size="lg"
            disabled={!agreedToTerms}
            className="min-w-[140px] rounded-full"
          >
            I am 21+
          </Button>
          <Button
            onClick={handleDecline}
            variant="heroOutline"
            size="lg"
            className="min-w-[140px] rounded-full"
          >
            Exit
          </Button>
        </div>
      </div>

      {legalPopup && (
        <LegalPopup
          type={legalPopup}
          onClose={() => setLegalPopup(null)}
        />
      )}
    </div>
  );
};
