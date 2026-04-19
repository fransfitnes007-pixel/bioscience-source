import { useEffect, useRef, useState } from "react";

export const WhatWeDoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 lg:py-48 border-t border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 max-w-6xl mx-auto">
          <div className={`lg:col-span-4 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              01 — Approach
            </span>
          </div>
          <div className={`lg:col-span-8 transition-all duration-1000 delay-200 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-10">
              Direct from manufacturer to <em className="italic text-muted-foreground">researcher</em> — no middlemen, no markup, no compromise.
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Every compound is produced under GMP conditions, verified at ≥99% purity by independent third-party labs, and shipped with a batch-specific Certificate of Analysis. The result: research-grade material at the price it should be.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
