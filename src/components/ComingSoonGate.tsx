import { useState, useEffect, ReactNode } from "react";
import { SpinningLogo3D } from "./home/SpinningLogo3D";
import { Button } from "./ui/button";

const SITE_PASSWORD = "resurrected2026";
const STORAGE_KEY = "rl-site-unlocked";

interface Props {
  children: ReactNode;
}

export const ComingSoonGate = ({ children }: Props) => {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

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

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center px-6">
      {/* radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-radial-spot)" }}
      />
      {/* hairline grid */}
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

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <SpinningLogo3D
          size={3.4}
          cameraZ={4.6}
          className="w-[320px] h-[260px] md:w-[440px] md:h-[340px] mx-auto drop-shadow-[0_0_80px_rgba(255,255,255,0.45)]"
        />

        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
          Coming soon
        </p>

        <h1 className="font-body font-bold text-foreground text-4xl md:text-5xl tracking-[-0.04em] mt-6">
          Research, <span className="text-muted-foreground font-light italic">refined.</span>
        </h1>

        <p className="font-body text-sm text-muted-foreground/80 mt-4 max-w-sm">
          Resurrected Labz is launching soon. Enter your access code to preview the site.
        </p>

        <form onSubmit={handleSubmit} className="w-full mt-10 flex flex-col gap-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            placeholder="Access code"
            autoFocus
            className="w-full px-5 py-3 bg-secondary/30 border border-border rounded-full text-center font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/40"
          />
          {error && (
            <p className="font-body text-xs text-destructive">
              Incorrect access code.
            </p>
          )}
          <Button type="submit" variant="hero" size="lg" className="w-full rounded-full">
            Enter site
          </Button>
        </form>
      </div>
    </div>
  );
};
