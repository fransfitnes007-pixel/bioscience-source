import { useState, useEffect, ReactNode } from "react";
import { SpinningLogo3D } from "./home/SpinningLogo3D";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SITE_PASSWORD = "resurrected2026";
const STORAGE_KEY = "rl-site-unlocked";

interface Props {
  children: ReactNode;
}

const SMS_CONSENT_TEXT =
  "By providing my phone number and submitting this form, I agree to receive recurring automated promotional and personalized marketing text messages (e.g., discounts, special offers, updates, and reminders) from Resurrected Labs at the phone number provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe at any time. Reply HELP for assistance. View our Terms & Conditions and Privacy Policy.";

export const ComingSoonGate = ({ children }: Props) => {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      (sessionStorage.getItem(STORAGE_KEY) === "1" ||
        localStorage.getItem(STORAGE_KEY) === "1");
    setUnlocked(ok);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim().toLowerCase() === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      localStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      toast.error("Please agree to the SMS terms to claim your discount.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("sms_optins").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        sms_consent: true,
        consent_text: SMS_CONSENT_TEXT,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
      toast.success("You're in! Check your inbox soon for your 10% off code.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center px-6 py-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-radial-spot)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        <SpinningLogo3D
          size={3.4}
          cameraZ={4.6}
          className="w-[260px] h-[200px] md:w-[360px] md:h-[280px] mx-auto drop-shadow-[0_0_80px_rgba(255,255,255,0.45)]"
        />

        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
          Coming soon
        </p>

        <h1 className="font-body font-bold text-foreground text-4xl md:text-5xl tracking-[-0.04em] mt-4">
          Research, <span className="text-muted-foreground font-light italic">refined.</span>
        </h1>

        <p className="font-body text-sm text-muted-foreground/80 mt-4 max-w-md">
          Resurrected Labz is launching soon. Drop your info to lock in{" "}
          <span className="text-foreground font-semibold">10% off</span> your first order.
        </p>

        {/* Opt-in form */}
        {!submitted ? (
          <form onSubmit={handleOptIn} className="w-full mt-8 flex flex-col gap-3 text-left">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Full name"
              className="w-full px-5 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="Email address"
              className="w-full px-5 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Phone number"
              className="w-full px-5 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />

            <label className="flex items-start gap-3 text-left mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
                className="mt-1 h-4 w-4 shrink-0 accent-foreground"
              />
              <span className="font-body text-[11px] leading-relaxed text-muted-foreground">
                By providing my phone number and submitting this form, I agree to receive recurring
                automated promotional and personalized marketing text messages (e.g., discounts,
                special offers, updates, and reminders) from Resurrected Labs at the phone number
                provided. Consent is not a condition of purchase. Message frequency varies. Message
                and data rates may apply. Reply STOP to unsubscribe at any time. Reply HELP for
                assistance. View our{" "}
                <a href="/sms-terms" target="_blank" className="underline text-foreground/80 hover:text-foreground">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="underline text-foreground/80 hover:text-foreground">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full rounded-full mt-2"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Claim 10% off"}
            </Button>
          </form>
        ) : (
          <div className="w-full mt-8 p-6 border border-border rounded-lg bg-secondary/20 text-center">
            <p className="font-body text-foreground">You're on the list.</p>
            <p className="font-body text-sm text-muted-foreground mt-1">
              We'll text and email your 10% off code at launch.
            </p>
          </div>
        )}

        {/* Access code */}
        <div className="w-full mt-10 pt-8 border-t border-border">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Have an access code?
          </p>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="password"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError(false);
              }}
              placeholder="Access code"
              className="w-full px-5 py-3 bg-secondary/30 border border-border rounded-full text-center font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            {error && (
              <p className="font-body text-xs text-destructive">Incorrect access code.</p>
            )}
            <Button type="submit" variant="heroOutline" size="lg" className="w-full rounded-full">
              Enter site
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
