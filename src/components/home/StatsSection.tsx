import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "99.9%", label: "Purity · 3rd Party Tested" },
  { value: "50+", label: "Research Compounds" },
  { value: "24-72h", label: "Shipping Turnaround" },
  { value: "10K+", label: "Happy Customers" },
];

export const StatsSection = () => {
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
    <section ref={ref} className="py-16 lg:py-24 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              <p className="font-body text-sm md:text-base text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};