import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MolecularAnimation } from "./MolecularAnimation";
import { ArrowRight } from "lucide-react";
const taglines = ["Your Direct B2B Peptide Supplier.", "Premium Quality. Unbeatable Prices.", "Built for qualified partners."];
export const HeroSection = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTagline(prev => (prev + 1) % taglines.length);
        setIsVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <MolecularAnimation />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Wordmark */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-up">
            <span className="text-gradient">PØINT</span>
            <span className="text-foreground/90 block text-3xl md:text-4xl lg:text-5xl font-medium mt-2">
              BioSciences
            </span>
          </h1>

          {/* Rotating tagline */}
          <div className="h-12 mb-12">
            <p className={`font-body text-lg md:text-xl text-muted-foreground transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              {taglines[currentTagline]}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
            <Link to="/products">
              <Button variant="hero" size="lg" className="min-w-[180px] group">
                View Products
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/access">
              <Button variant="heroOutline" size="lg" className="min-w-[180px]">
                Apply for Wholesale Access
              </Button>
            </Link>
            <Link to="/access">
              <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
                Inquire / Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-500">
        
      </div>
    </section>;
};