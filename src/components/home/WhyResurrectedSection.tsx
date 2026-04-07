import { useEffect, useRef, useState } from "react";
import { Zap, Shield, FileCheck, Truck, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast Shipping",
    description: "Dispatched within 24 hours, delivered in 2–3 business days — fully tracked. Your research timeline stays on schedule.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "Bank-level encrypted payment processing. Every transaction is protected end-to-end. Your data stays yours — always.",
  },
  {
    icon: Shield,
    title: "Pharmaceutical-Grade Purity",
    description: "Every compound is manufactured under strict GMP conditions and independently verified to ≥99% purity.",
  },
  {
    icon: FileCheck,
    title: "COA With Every Order",
    description: "Full Certificate of Analysis included automatically. No request needed — transparency is our default.",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description: "We ship globally with established logistics networks, proper handling, and customs-ready documentation.",
  },
  {
    icon: Truck,
    title: "No Minimum Orders",
    description: "Order what you need, when you need it. From single vials to bulk quantities — same quality, same service.",
  },
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
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Why Resurrected
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground">
            The Standard You <em className="not-italic text-muted-foreground">Demand</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-0 max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-8 border-t border-border/30 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <span className="font-heading text-sm text-muted-foreground/50 font-medium tabular-nums pt-1">
                  {String(index + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-medium mb-2 text-foreground group-hover:text-foreground/80 transition-colors">
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
