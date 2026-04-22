import { useEffect, useRef, useState } from "react";

const features = [
  { title: "Dispatched in 24 hours", description: "Orders leave our facility within one business day. Tracked, insured, delivered to your laboratory in 2–3 days domestically." },
  { title: "End-to-end encrypted checkout", description: "Bank-grade payment processing. Your laboratory information stays confidential — never sold, never shared." },
  { title: "≥99% HPLC-verified purity", description: "Every batch independently analyzed and certified. We publish the COA before we list the compound." },
  { title: "COA included by default", description: "No request forms, no waiting. Every order ships with full third-party analytical documentation." },
  { title: "Worldwide logistics", description: "Established carriers, proper handling, customs-ready paperwork. We ship where research lives." },
  { title: "No minimums", description: "From a single vial to bulk procurement — same reference-grade compound, same standard, same service." },
];

export const WhyResurrectedSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 lg:py-48 border-t border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className={`grid lg:grid-cols-12 gap-8 mb-20 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="lg:col-span-4">
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              03 — Standard
            </span>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
              The standard your <em className="italic text-muted-foreground">research demands.</em>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 max-w-6xl mx-auto border-t border-border/40">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-10 lg:p-12 border-b border-r border-border/40 transition-all duration-700 hover:bg-card/30 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start gap-8">
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground tabular-nums pt-2">
                  {String(index + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl mb-4 text-foreground leading-tight">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
