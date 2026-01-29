import { useEffect, useRef, useState } from "react";
import { Shield, Microscope, Clock, Globe, BadgeCheck, Lock, FlaskConical, Award, CheckCircle2 } from "lucide-react";

const certifications = [
  { icon: FlaskConical, label: "GMP Compliant" },
  { icon: Award, label: "ISO 9001" },
  { icon: CheckCircle2, label: "Lab Verified" },
  { icon: Shield, label: "COA Certified" },
];

const partnerPlaceholders = ["Partner 1", "Partner 2", "Partner 3", "Partner 4"];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Verified Suppliers",
    description: "Every supplier in our network undergoes rigorous vetting for quality and compliance standards.",
  },
  {
    icon: Microscope,
    title: "Third-Party Testing",
    description: "All products include independent lab analysis with full COA documentation.",
  },
  {
    icon: Shield,
    title: "99.1%+ Purity",
    description: "We maintain strict purity standards across our entire research compound catalog.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Quotes within 24-72 hours. Streamlined fulfillment for approved partners.",
  },
  {
    icon: Globe,
    title: "Global Logistics",
    description: "Established shipping networks with proper handling and documentation.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "Encrypted communications and secure payment processing for all orders.",
  },
];

export const TrustSection = () => {
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
            Why Partners Trust Us
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Built on transparency, quality assurance, and reliable service for research businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trustPoints.map((point, index) => (
            <div
              key={point.title}
              className={`p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover-lift transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <point.icon className="w-8 h-8 text-foreground/80 mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
                {point.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certification Badges */}
        <div className={`mt-16 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h3 className="font-heading text-lg font-medium text-center mb-8 text-muted-foreground">
            Quality & Compliance Standards
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {certifications.map((cert, index) => (
              <div
                key={cert.label}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full border border-border/50 bg-card/50 flex items-center justify-center group-hover:border-foreground/30 transition-colors">
                  <cert.icon className="w-7 h-7 text-foreground/70" strokeWidth={1.5} />
                </div>
                <span className="font-body text-xs text-muted-foreground text-center max-w-[80px]">
                  {cert.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Logos Placeholder */}
        <div className={`mt-16 pt-12 border-t border-border/30 transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h3 className="font-heading text-lg font-medium text-center mb-8 text-muted-foreground">
            Trusted Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {partnerPlaceholders.map((partner, index) => (
              <div
                key={index}
                className="w-24 h-12 md:w-32 md:h-14 rounded border border-dashed border-border/40 bg-card/20 flex items-center justify-center"
              >
                <span className="font-body text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                  {partner}
                </span>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground/50 text-center mt-6">
            Partner logos coming soon
          </p>
        </div>
      </div>
    </section>
  );
};
