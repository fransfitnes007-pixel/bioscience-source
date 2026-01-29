import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Beaker, Brain, Heart, Sparkles, Zap, Activity } from "lucide-react";

const categories = [
  {
    icon: Activity,
    name: "GLP / Metabolic",
    slug: "glp-metabolic",
    description: "GLP-1 agonists, dual/tri-agonists, and metabolic research compounds for glucose and weight management studies.",
    products: ["Semaglutide", "Tirzepatide", "Retatrutide", "Cagrilintide"],
  },
  {
    icon: Zap,
    name: "Growth Hormone",
    slug: "growth-hormone",
    description: "GHRPs, GHRHs, and related peptides for growth hormone secretion and IGF-1 pathway research.",
    products: ["HGH Somatropin", "Ipamorelin", "CJC-1295", "Tesamorelin"],
  },
  {
    icon: Heart,
    name: "Healing & Recovery",
    slug: "healing-recovery",
    description: "Tissue repair and regeneration peptides for wound healing and recovery research applications.",
    products: ["BPC-157", "TB-500", "BPC-157 + TB-500", "GHK-Cu"],
  },
  {
    icon: Brain,
    name: "Cognitive & Nootropic",
    slug: "cognitive-nootropic",
    description: "Neuropeptides and nootropic compounds for cognitive function and neurological research.",
    products: ["Semax", "Selank", "Pinealon", "DSIP"],
  },
  {
    icon: Sparkles,
    name: "Cosmetic & Skin",
    slug: "cosmetic-skin",
    description: "Anti-aging peptides and compounds for dermatological and aesthetic research applications.",
    products: ["GHK-Cu", "SNAP-8", "Epithalon", "Glutathione"],
  },
  {
    icon: Beaker,
    name: "Research Essentials",
    slug: "research-essentials",
    description: "Bacteriostatic water, syringes, and essential supplies for research preparation.",
    products: ["BAC Water", "Reconstitution Kits"],
  },
];

export const CategoriesSection = () => {
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
            Product Categories
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Comprehensive research compound catalog across major peptide and metabolic categories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className={`group p-6 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm hover-lift transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <category.icon className="w-8 h-8 text-foreground/80" strokeWidth={1.5} />
                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-heading text-lg font-medium mb-2 text-foreground">
                {category.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.products.slice(0, 3).map((product) => (
                  <span
                    key={product}
                    className="px-2 py-1 text-xs font-medium bg-foreground/5 text-foreground/70 rounded"
                  >
                    {product}
                  </span>
                ))}
                {category.products.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    +{category.products.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-body text-foreground hover:text-foreground/80 transition-colors group"
          >
            View Full Catalog
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
