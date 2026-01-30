import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const AgeVerification = () => {
  const [showModal, setShowModal] = useState(false);

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
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
          You must be 21 or older to enter
        </h2>
        <p className="font-body text-muted-foreground mb-8">
          By clicking "I am 21+" you confirm that you are at least 21 years of age.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleConfirm}
            variant="hero"
            size="lg"
            className="min-w-[140px]"
          >
            I am 21+
          </Button>
          <Button
            onClick={handleDecline}
            variant="heroOutline"
            size="lg"
            className="min-w-[140px]"
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
};
