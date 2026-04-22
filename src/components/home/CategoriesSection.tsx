import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "GLP / Metabolic",
    slug: "glp-metabolic",
    description: "Metabolic pathway research compounds.",
    products: ["Semaglutide", "Tirzepatide", "Retatrutide", "Cagrilintide"],
  },
  {
    name: "Growth Hormone",
    slug: "growth-hormone",
    description: "GHRPs, GHRHs, and IGF-1 pathway research compounds.",
    products: ["HGH Somatropin", "Ipamorelin", "CJC-1295", "Tesamorelin"],
  },
  {
    name: "Tissue Repair",
    slug: "healing-recovery",
    description: "Tissue repair and regeneration research peptides.",
    products: ["BPC-157", "TB-500", "BPC-157 + TB-500", "GHK-Cu"],
  },
  {
    name: "Neuropeptides",
    slug: "cognitive-nootropic",
    description: "Neuropeptide research compounds for in vitro study.",
    products: ["Semax", "Selank", "Pinealon", "DSIP"],
  },
  {
    name: "Dermatological",
    slug: "cosmetic-skin",
    description: "Dermatological research peptides.",
    products: ["GHK-Cu", "SNAP-8", "Epithalon", "Glutathione"],
  },
  {
    name: "Research Essentials",
    slug: "research-essentials",
    description: "Bacteriostatic water and reconstitution supplies.",
    products: ["BAC Water", "Reconstitution Kits"],
  },
];

export const CategoriesSection = () => {
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
        <div className={`grid lg:grid-cols-12 gap-8 mb-20 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="lg:col-span-4">
            <span className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              02 — Catalog
            </span>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
              Six research categories. <em className="italic text-muted-foreground">One laboratory standard.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto border-t border-border/40">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className={`group relative p-8 lg:p-10 border-b border-r border-border/40 transition-all duration-700 hover:bg-card/40 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-12">
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")} / 06
                </span>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-all duration-500 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.25} />
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-3 leading-tight">
                {category.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {category.products.slice(0, 4).map((product) => (
                  <span key={product} className="font-body text-xs text-foreground/60">
                    {product}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 font-body text-sm uppercase tracking-[0.25em] text-foreground hover:text-muted-foreground transition-colors"
          >
            View research catalog
            <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
