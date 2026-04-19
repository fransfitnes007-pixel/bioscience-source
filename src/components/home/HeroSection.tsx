import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import resurrectedLogo from "@/assets/resurrected-logo.png";

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle radial spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-spot)" }} />

      {/* Hairline grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div
            className={`flex items-center justify-center gap-3 mb-10 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-px w-8 bg-foreground/30" />
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Resurrected Labz · Est. 2024
            </span>
            <span className="h-px w-8 bg-foreground/30" />
          </div>

          {/* Display headline */}
          <h1
            className={`font-display text-[14vw] sm:text-[10vw] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] leading-[0.9] text-center text-foreground transition-all duration-[1200ms] ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            Resurrected
          </h1>

          <p
            className={`font-display italic text-center text-2xl md:text-4xl text-muted-foreground -mt-2 md:-mt-4 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            research, refined.
          </p>

          {/* Subhead */}
          <p
            className={`font-body text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto text-center mt-12 leading-relaxed transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "650ms" }}
          >
            Pharmaceutical-grade research peptides. ≥99% purity, third-party verified, shipped in days — not weeks.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "850ms" }}
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-body text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all duration-500 min-w-[200px]"
            >
              Browse the catalog
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-foreground/40 text-foreground rounded-full font-body text-sm font-medium tracking-wide transition-all duration-500 min-w-[200px]"
            >
              Our standard
            </Link>
          </div>

          {/* Stat strip */}
          <div
            className={`mt-24 grid grid-cols-3 max-w-2xl mx-auto border-t border-border/40 pt-8 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            {[
              { v: "≥99%", l: "Verified purity" },
              { v: "24h", l: "Order dispatch" },
              { v: "GMP", l: "Manufactured" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-3xl md:text-4xl text-foreground">{s.v}</div>
                <div className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1400ms" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-foreground/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};
