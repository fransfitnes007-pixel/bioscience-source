import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MolecularAnimation } from "./MolecularAnimation";
import { ArrowRight } from "lucide-react";
import resurrectedLabzLogo from "@/assets/resurrected-labz-full-logo.png";

const taglines = [
  "Premium Peptides. Unmatched Purity.",
  "99.9% Pure. Third-Party Tested.",
  "Fast Shipping. No Compromises.",
];

export const HeroSection = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setIsVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <MolecularAnimation />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo — staggered entrance */}
          <div className="mb-8 opacity-0 animate-[reveal-up_1s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
            <img
              src={resurrectedLabzLogo}
              alt="Resurrected Labz"
              className="h-48 md:h-72 lg:h-[26rem] w-auto mx-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.7)] drop-shadow-[0_0_80px_rgba(255,255,255,0.4)] drop-shadow-[0_0_120px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Rotating tagline — staggered */}
          <div className="h-12 mb-12 opacity-0 animate-[reveal-up_1s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
            <p
              className={`font-body text-lg md:text-xl text-muted-foreground transition-all duration-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {taglines[currentTagline]}
            </p>
          </div>

          {/* CTA Buttons — staggered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[reveal-up_1s_cubic-bezier(0.16,1,0.3,1)_0.7s_forwards]">
            <Link to="/products">
              <Button variant="hero" size="lg" className="min-w-[180px] group">
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="heroOutline"
                size="lg"
                className="min-w-[180px]"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-[reveal-up_1s_cubic-bezier(0.16,1,0.3,1)_1.2s_forwards]">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-foreground/40 animate-[vial-float_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};
