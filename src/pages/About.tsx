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
              About Resurrected
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium research peptides with uncompromising quality standards.
            </p>
          </div>

          {/* Our Mission */}
          <section
            id="why"
            ref={(el: HTMLDivElement | null) => { sectionRefs.current["why"] = el; }}
            className={`max-w-3xl mx-auto mb-20 transition-all duration-700 ${
              visibleSections.has("why") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              Our Mission
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                The research peptide market has long been plagued by inconsistent quality, opaque pricing, 
                and unreliable suppliers. We founded Resurrected to change that — delivering premium products 
                with full transparency at prices that make sense.
              </p>
              <p>
                Every product we sell is backed by third-party testing and Certificates of Analysis. 
                We believe you shouldn't have to guess about what you're getting — you should know.
              </p>
              <p className="text-foreground font-medium">
                Our commitment: 99.9% purity, honest pricing, fast shipping, and documentation 
                you can trust. Every time.
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
              Quality You Can Count On
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                We source from vetted, certified suppliers and verify every batch through independent 
                third-party laboratories. Our quality assurance process includes:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Third-party purity testing on every batch</li>
                <li>Full Certificates of Analysis available for all products</li>
                <li>Secure, climate-controlled storage and shipping</li>
                <li>Rigorous supplier vetting and ongoing quality monitoring</li>
              </ul>
              <p>
                When you order from Resurrected, you're getting products that meet the highest 
                standards in the industry — guaranteed.
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
              Transparency is fundamental to who we are. All products come with Certificates of 
              Analysis from independent third-party laboratories.
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
                  COA documents will be available here soon.
                </p>
              </div>
            )}
          </section>

          {/* CTA */}
          <section
            id="cta"
            ref={(el: HTMLDivElement | null) => { sectionRefs.current["cta"] = el; }}
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
              visibleSections.has("cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              Ready to Order?
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Browse our full catalog of premium research peptides.
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg" className="group">
                Shop Products
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