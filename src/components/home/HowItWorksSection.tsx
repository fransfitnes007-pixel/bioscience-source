import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, Search, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Apply / Get Verified",
    description: "Submit your business credentials for verification and approval to access our B2B catalog.",
  },
  {
    icon: Search,
    title: "Browse Products / Select Variations",
    description: "Explore our comprehensive catalog and select the specific variations you need.",
  },
  {
    icon: MessageSquare,
    title: "Place Order / Receive Tracking Details",
    description: "Complete your order and receive tracking details once your shipment is on its way.",
  },
];

export const HowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
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
            A streamlined process from application to quote.
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
              {/* Step number */}
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
