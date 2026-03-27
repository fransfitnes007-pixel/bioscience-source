import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

export const WhyWeStartedSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30 bg-molecular-grid">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <div className="flex items-center justify-center mb-8">
            <TrendingUp className="w-8 h-8 text-foreground/60 mr-3" strokeWidth={1.5} />
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
              Our Mission
            </h2>
          </div>

          <div className="space-y-8 text-center">
            <blockquote className="border-l-2 border-foreground/30 pl-6 text-left max-w-2xl mx-auto">
              <p className="font-body text-xl text-foreground/90 italic leading-relaxed">
                "Everyone deserves access to high-quality research peptides without the markup."
              </p>
            </blockquote>

            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                We started Resurrected because we saw an industry full of inflated prices and inconsistent quality. Our goal is simple: deliver the purest peptides at the fairest prices, with documentation you can trust.
              </p>
              
              <div className="p-6 border border-border/50 rounded-lg bg-card/30">
                <p className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-3">
                  Quality First
                </p>
                <p className="font-body text-muted-foreground">
                  Every batch is third-party tested with full Certificates of Analysis. We never cut corners on purity — because your research depends on it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};