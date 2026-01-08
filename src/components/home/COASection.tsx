import { useEffect, useRef, useState } from "react";
import { FileCheck, Shield, Award } from "lucide-react";

export const COASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-foreground">
              COAs & Purity Documentation
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Every product we facilitate comes with comprehensive documentation from verified 
              third-party suppliers, ensuring transparency and quality assurance for your research.
            </p>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-4 transition-all duration-300 hover:border-foreground/50">
                <FileCheck className="w-7 h-7 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
                Certificates of Analysis
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Third-party lab testing documentation for every batch
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-4 transition-all duration-300 hover:border-foreground/50">
                <Shield className="w-7 h-7 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
                Purity Verification
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Rigorous purity testing and verification standards
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-4 transition-all duration-300 hover:border-foreground/50">
                <Award className="w-7 h-7 text-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
                Quality Assurance
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Consistent quality through vetted supplier partnerships
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
