import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who can apply for wholesale access?",
    answer: "We work exclusively with verified B2B partners including licensed clinics, research institutions, medical spas, compounding pharmacies, and established resellers. All applicants undergo a verification process to ensure compliance with our quality and business standards.",
  },
  {
    question: "What documentation do you provide?",
    answer: "Every product comes with comprehensive documentation including Certificates of Analysis (COAs) from third-party labs, purity verification reports, and batch-specific testing data. Documentation is available upon request and included with all orders.",
  },
  {
    question: "What are your minimum order quantities?",
    answer: "Minimum orders start at 10 units per variation. We offer tiered pricing at 10, 20, and 30 unit quantities with progressive discounts for larger orders. Custom bulk pricing is available for qualified high-volume partners.",
  },
  {
    question: "How long does the verification process take?",
    answer: "Most applications are reviewed within 24-72 hours. Once approved, you'll have immediate access to our full catalog and wholesale pricing. The verification process includes business documentation review and compliance verification.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, wire transfers, and ACH payments for approved partners. All transactions are processed through secure, encrypted payment systems. Net terms may be available for established accounts.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to qualified partners globally. International orders include proper documentation and are processed through established logistics networks. Shipping costs and delivery times vary by destination.",
  },
  {
    question: "What is your return policy?",
    answer: "We stand behind our product quality. If there are any issues with purity or documentation, we work directly with partners to resolve them. All returns must be initiated within 30 days of receipt with proper documentation.",
  },
  {
    question: "How do I request a custom quote?",
    answer: "Once verified, you can request quotes directly through our catalog by selecting products and quantities. For custom bulk orders or special requirements, contact our team through the inquiry form for personalized pricing.",
  },
];

export const FAQSection = () => {
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
    <section ref={ref} className="py-24 lg:py-32 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about partnering with Point Biosciences.
          </p>
        </div>

        <div className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border/50"
              >
                <AccordionTrigger className="font-heading text-left text-foreground hover:no-underline hover:text-foreground/80 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
