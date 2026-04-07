import { useEffect, useRef, useState } from "react";

const badges = [
  { value: "GMP", label: "Certified Manufacturing" },
  { value: "3rd Party", label: "Tested & Verified" },
  { value: "COA", label: "Every Order" },
  { value: "≥99%", label: "Purity Guaranteed" },
];

export const TrustBadgesSection = () => {
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
    <section ref={ref} className="py-16 lg:py-20 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {badges.map((badge, index) => (
            <div
              key={badge.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-20 h-20 mx-auto mb-3 rounded-full border border-border/50 bg-card/30 flex items-center justify-center">
                <span className="font-heading text-sm font-bold text-foreground tracking-wide">
                  {badge.value}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                {badge.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
