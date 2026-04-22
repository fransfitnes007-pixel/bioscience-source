import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export const FinalCTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-40 lg:py-56 border-t border-border/40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-spot)" }} />
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            06 — Begin
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mt-8 mb-10 leading-[0.95]">
            Your research, <em className="italic text-muted-foreground">resurrected.</em>
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-14 max-w-xl mx-auto">
            Browse the research catalog. Place your order in minutes. Receive HPLC-verified compounds at your laboratory in days.
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-foreground text-background rounded-full font-body text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all duration-500"
          >
            Browse research catalog
            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
