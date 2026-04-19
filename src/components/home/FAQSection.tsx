import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "How do I place an order?", answer: "Browse our catalog, add items to your cart, and check out. Create an account during checkout to track shipments and reorder in one click." },
  { question: "What documentation comes with my order?", answer: "Every product ships with a third-party Certificate of Analysis, purity verification, and batch-specific testing data — included by default, never on request." },
  { question: "Are there order minimums?", answer: "No minimums. Order a single vial or hundreds — pricing scales with quantity, but quality never does." },
  { question: "How fast does it ship?", answer: "Most orders dispatch within 24 hours. Domestic delivery in 2–3 business days. Tracking sent automatically the moment your order leaves." },
  { question: "What payment methods are accepted?", answer: "All major credit and debit cards, processed through Stripe with 256-bit SSL encryption. We never see, store, or sell your payment data." },
  { question: "Do you ship internationally?", answer: "Yes — worldwide. Customs-ready documentation included. Transit times and rates vary by destination." },
  { question: "What if there's an issue with my order?", answer: "Buyer Protection covers damaged, lost, or non-delivered orders for a full refund or replacement. Add it at checkout for complete peace of mind." },
  { question: "How do I get support?", answer: "Email support@resurrected.com or message us directly from your account dashboard for order-specific questions." },
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
    <section ref={ref} className="py-32 lg:py-48 border-t border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className={`grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="lg:col-span-4">
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              05 — Questions
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-6 leading-[1.05]">
              Common <em className="italic text-muted-foreground">questions.</em>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border/40"
                >
                  <AccordionTrigger className="font-display text-xl md:text-2xl text-left text-foreground hover:no-underline hover:text-muted-foreground py-7 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-base text-muted-foreground leading-relaxed pb-7 max-w-2xl">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
