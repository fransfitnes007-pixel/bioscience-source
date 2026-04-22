import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, Truck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Research Catalog",
    description: "Explore our catalog of reference-grade peptides and select the compounds and variations your research requires.",
  },
  {
    icon: ShoppingCart,
    title: "Place Your Order",
    description: "Add compounds to your cart, sign in or create a laboratory account, and submit your order through encrypted checkout.",
  },
  {
    icon: Truck,
    title: "Tracked Laboratory Dispatch",
    description: "Your order ships within 24 hours with full tracking and a batch-specific Certificate of Analysis included.",
  },
];

export const HowItWorksSection = () => {
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
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30 bg-molecular-grid">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Three steps from catalog to laboratory bench.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative p-8 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover-lift transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-heading font-semibold text-sm">
                {index + 1}
              </div>
              <step.icon className="w-10 h-10 text-foreground/80 mb-6" strokeWidth={1.5} />
              <h3 className="font-heading text-xl font-medium mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
