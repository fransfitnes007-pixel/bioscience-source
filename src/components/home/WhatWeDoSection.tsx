import { useEffect, useRef, useState } from "react";

export const WhatWeDoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6 text-foreground">
            What We Do
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            Point Biosciences is a B2B research supply facilitator connecting qualified businesses 
            to vetted third-party peptide suppliers. We streamline wholesale sourcing, documentation, 
            and fulfillment—offering pricing structures that actually make sense for your business.
          </p>
        </div>
      </div>
    </section>
  );
};
