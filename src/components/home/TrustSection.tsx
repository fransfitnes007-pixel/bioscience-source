import { useEffect, useRef, useState } from "react";
import { Shield, Microscope, Clock, Globe, BadgeCheck, Lock, FlaskConical, Award, CheckCircle2, Quote } from "lucide-react";

const certifications = [
  { icon: FlaskConical, label: "GMP Compliant" },
  { icon: Award, label: "ISO 9001" },
  { icon: CheckCircle2, label: "Lab Verified" },
  { icon: Shield, label: "COA Certified" },
];

const testimonials = [
  {
    quote: "The purity is unmatched. I've tried other suppliers and nothing compares to the consistency here.",
    author: "Alex T.",
    role: "Verified Customer",
    metric: "99.9%",
    metricLabel: "Purity"
  },
  {
    quote: "Ordered on Monday, received on Wednesday. The COA documentation gives me total confidence in what I'm getting.",
    author: "Jordan M.",
    role: "Verified Customer",
    metric: "<72h",
    metricLabel: "Delivery"
  },
  {
    quote: "Best prices I've found anywhere for this level of quality. Resurrected is my go-to now.",
    author: "Chris R.",
    role: "Verified Customer",
    metric: "5 ★",
    metricLabel: "Rating"
  },
];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Vetted Suppliers",
    description: "Every supplier in our network undergoes rigorous vetting for quality and compliance standards.",
  },
  {
    icon: Microscope,
    title: "Third-Party Testing",
    description: "All products include independent lab analysis with full COA documentation.",
  },
  {
    icon: Shield,
    title: "99.9% Purity",
    description: "We maintain strict purity standards across our entire research compound catalog.",
  },
  {
    icon: Clock,
    title: "Fast Shipping",
    description: "Orders ship within 24-72 hours with full tracking information sent to your email.",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description: "We ship globally with established logistics networks and proper handling.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "Encrypted payments and secure processing for every transaction.",
  },
];

export const TrustSection = () => {
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
            Why Customers Trust Us
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Built on transparency, quality assurance, and reliable service.
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
            {certifications.map((cert) => (
              <div key={cert.label} className="flex flex-col items-center gap-2 group">
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

        {/* Testimonials */}
        <div className={`mt-20 transition-all duration-700 delay-600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-center mb-4 text-foreground">
            What Our Customers Say
          </h3>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Real feedback from real customers.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm relative group hover-lift"
              >
                <Quote className="w-8 h-8 text-foreground/10 absolute top-4 right-4" />
                <div className="mb-4">
                  <span className="font-heading text-3xl font-bold text-foreground">{testimonial.metric}</span>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{testimonial.metricLabel}</p>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-border/30">
                  <p className="font-heading text-sm font-medium text-foreground">{testimonial.author}</p>
                  <p className="font-body text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className={`mt-16 transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "50+", label: "Products" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "4.9/5", label: "Customer Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 border border-border/30 rounded-lg bg-card/20">
                <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};