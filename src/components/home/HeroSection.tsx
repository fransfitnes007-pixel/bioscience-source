import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MolecularAnimation } from "./MolecularAnimation";
import { ArrowRight } from "lucide-react";
import resurrectedLabzLogo from "@/assets/resurrected-labz-full-logo.png";

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[52px]">
      <MolecularAnimation />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className={`mb-10 transition-all duration-1000 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <img
              src={resurrectedLabzLogo}
              alt="Resurrected Labz"
              className="h-40 md:h-64 lg:h-[22rem] w-auto mx-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.7)] drop-shadow-[0_0_80px_rgba(255,255,255,0.4)] drop-shadow-[0_0_120px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Tagline */}
          <div className={`mb-10 transition-all duration-1000 delay-300 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
              GMP Certified · 3rd-Party Tested · ≥99% Purity
            </p>
            <h1 className="font-heading text-2xl md:text-4xl font-semibold text-foreground">
              Premium Research Peptides
            </h1>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <Link to="/products">
              <Button variant="hero" size="lg" className="min-w-[180px] group">
                Shop Peptides
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="heroOutline" size="lg" className="min-w-[180px]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="w-5 h-8 rounded-full border border-foreground/20 flex items-start justify-center p-1">
          <div className="w-0.5 h-2 rounded-full bg-foreground/40 animate-[vial-float_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};
