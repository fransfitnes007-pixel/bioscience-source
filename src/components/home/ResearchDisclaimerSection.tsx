import { AlertTriangle } from "lucide-react";

export const ResearchDisclaimerSection = () => {
  return (
    <section className="py-12 border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/30 mb-4">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Research Use Only
            </span>
          </div>
          <p className="font-body text-sm text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto">
            All products sold on this website are strictly intended for research use only, for in vitro laboratory research purposes. 
            These products are not approved by the FDA for human or animal consumption, administration, or any form of bodily introduction.
            To be handled by trained professionals in controlled laboratory environments.
          </p>
        </div>
      </div>
    </section>
  );
};
