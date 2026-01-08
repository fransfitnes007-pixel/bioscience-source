import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface COADocument {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
  is_public: boolean;
}

const About = () => {
  const [coaDocuments, setCoaDocuments] = useState<COADocument[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchCOAs = async () => {
      const { data } = await supabase
        .from("coa_documents")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });
      
      if (data) setCoaDocuments(data);
    };

    fetchCOAs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      <div className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              About Point Biosciences
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              A B2B wholesale facilitator built for qualified research partners.
            </p>
          </div>

          {/* Why We Started */}
          <section
            id="why"
            ref={(el: HTMLDivElement | null) => { sectionRefs.current["why"] = el; }}
            className={`max-w-3xl mx-auto mb-20 transition-all duration-700 ${
              visibleSections.has("why") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              Why We Started
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Many businesses operating in the research supply space are overcharged by suppliers 
                without realizing it. Hidden markups, inefficient supply chains, and lack of transparent 
                pricing have become the norm—and most companies simply accept it.
              </p>
              <p>
                We built Point Biosciences as a B2B-only wholesale facilitator with a fundamentally 
                different approach: pricing that actually makes sense. By streamlining the connection 
                between qualified businesses and vetted third-party suppliers, we eliminate unnecessary 
                intermediaries and their associated costs.
              </p>
              <p className="text-foreground font-medium">
                Our partners have seen profit margin improvements of 300–500% through smarter wholesale 
                sourcing and our streamlined fulfillment process. That's not a marketing claim—it's the 
                natural result of removing inefficiency from the supply chain.
              </p>
            </div>
          </section>

          {/* How We Operate */}
          <section
            id="operate"
            ref={(el: HTMLDivElement | null) => { sectionRefs.current["operate"] = el; }}
            className={`max-w-3xl mx-auto mb-20 transition-all duration-700 ${
              visibleSections.has("operate") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              How We Operate
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Point Biosciences functions as a distributor and facilitator, connecting qualified 
                businesses to vetted third-party peptide suppliers. We do not manufacture, produce, 
                or own any products listed on our platform.
              </p>
              <p>
                Our role is to provide comprehensive support throughout the procurement process:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Documentation coordination and verification</li>
                <li>Communication between partners and suppliers</li>
                <li>Streamlined order coordination and fulfillment tracking</li>
                <li>Quality assurance through COA verification</li>
              </ul>
              <p>
                This model allows us to focus entirely on what matters: ensuring our B2B partners 
                receive quality products at fair wholesale pricing with minimal friction.
              </p>
            </div>
          </section>

          {/* COAs & Purity Documentation */}
          <section
            id="coa"
            ref={(el: HTMLDivElement | null) => { sectionRefs.current["coa"] = el; }}
            className={`max-w-3xl mx-auto mb-20 transition-all duration-700 ${
              visibleSections.has("coa") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              COAs & Purity Documentation
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Transparency and quality assurance are foundational to our operation. All products 
              facilitated through Point Biosciences come with Certificates of Analysis from 
              third-party laboratories.
            </p>

            {coaDocuments.length > 0 ? (
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 font-heading text-sm font-medium text-foreground">
                  <span>Document</span>
                  <span>Date</span>
                  <span>Action</span>
                </div>
                {coaDocuments.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-3 gap-4 p-4 border-t border-border/30 items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-body text-foreground text-sm truncate">{doc.title}</span>
                    </div>
                    <span className="font-body text-muted-foreground text-sm">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-body text-sm text-foreground hover:text-foreground/80 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-border/50 rounded-lg text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-body text-muted-foreground">
                  COA documents are available to approved B2B partners.
                </p>
              </div>
            )}
          </section>

          {/* Apply CTA */}
          <section
            id="apply"
            ref={(el: HTMLDivElement | null) => { sectionRefs.current["apply"] = el; }}
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
              visibleSections.has("apply") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              Apply for Wholesale Access
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Qualified businesses can apply for B2B wholesale access to our complete catalog 
              with transparent pricing.
            </p>
            <Link to="/access">
              <Button variant="hero" size="lg" className="group">
                Apply Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
