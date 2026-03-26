import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Simply browse our product catalog, add items to your cart, and proceed to checkout. Create a free account during checkout to track your orders and receive shipping updates.",
  },
  {
    question: "What documentation do you provide?",
    answer: "Every product comes with comprehensive documentation including Certificates of Analysis (COAs) from third-party labs, purity verification reports, and batch-specific testing data.",
  },
  {
    question: "What are your minimum order quantities?",
    answer: "Our products have varying minimum quantities starting as low as 10 units per variation. We also offer quantity-based discounts — the more you order, the more you save.",
  },
  {
    question: "How fast is shipping?",
    answer: "Most orders ship within 24-72 hours. You'll receive tracking information via email as soon as your order is dispatched. Delivery times vary by location.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards processed through our secure payment system. All transactions are encrypted and protected.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship worldwide. International shipping costs and delivery times vary by destination. All orders include proper documentation.",
  },
  {
    question: "What is your return policy?",
    answer: "We stand behind our product quality. If there are any issues with purity or documentation, we'll work with you to resolve them. Returns must be initiated within 30 days of receipt.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us anytime via email. Once you have an account, you can also message us directly through your order dashboard for order-specific questions.",
  },
];

export const FAQSection = () => {
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
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about ordering from Resurrected.
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