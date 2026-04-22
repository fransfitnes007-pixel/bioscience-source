import { Product, ProductVariation } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductDetailProps {
  product: Product;
  selectedVariation: ProductVariation | null;
  onSelectVariation: (variation: ProductVariation) => void;
  onInquire: () => void;
  onClose: () => void;
}

export const ProductDetail = ({
  product,
  selectedVariation,
  onSelectVariation,
  onInquire,
  onClose,
}: ProductDetailProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-lg animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-8 pr-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
              {product.displayName}
            </h2>

            {/* Variations */}
            <div className="mb-6">
              <h3 className="font-heading text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Select Variation
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((variation) => (
                  <button
                    key={variation.strength}
                    onClick={() => onSelectVariation(variation)}
                    className={`px-4 py-3 border rounded-lg font-body text-sm transition-all ${
                      selectedVariation?.strength === variation.strength
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50 text-foreground"
                    }`}
                  >
                    <span className="font-medium">{variation.strength}</span>
                    <span className="text-xs opacity-70 block">
                      MOQ: {variation.moq} vials
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inquire button */}
            <Button
              variant="hero"
              size="lg"
              onClick={onInquire}
              disabled={!selectedVariation}
              className="w-full md:w-auto"
            >
              {selectedVariation ? "Request Research Quote" : "Select a variation"}
            </Button>
          </div>

          {/* Accordion sections */}
          <Accordion type="single" collapsible className="w-full">
            {product.description && (
              <AccordionItem value="description" className="border-border/50">
                <AccordionTrigger className="font-heading text-base font-medium text-foreground hover:no-underline">
                  Compound Description
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
            )}

            {product.scientificPurpose && (
              <AccordionItem value="purpose" className="border-border/50">
                <AccordionTrigger className="font-heading text-base font-medium text-foreground hover:no-underline">
                  Scientific Research Purpose
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                  {product.scientificPurpose}
                </AccordionContent>
              </AccordionItem>
            )}

            {product.studiesFindings && (
              <AccordionItem value="studies" className="border-border/50">
                <AccordionTrigger className="font-heading text-base font-medium text-foreground hover:no-underline">
                  Studies Have Proven To Show
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                  {product.studiesFindings}
                </AccordionContent>
              </AccordionItem>
            )}

            {product.nihLink && (
              <AccordionItem value="nih" className="border-border/50">
                <AccordionTrigger className="font-heading text-base font-medium text-foreground hover:no-underline">
                  NIH Research Link
                </AccordionTrigger>
                <AccordionContent>
                  <a
                    href={product.nihLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 font-body text-foreground hover:text-foreground/80 transition-colors underline"
                  >
                    View on PubMed
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="coa" className="border-border/50">
              <AccordionTrigger className="font-heading text-base font-medium text-foreground hover:no-underline">
                COA Photo & Lab Testing
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                <p className="italic">COA documentation available upon request.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="font-body text-sm text-muted-foreground font-medium">
              <strong>FOR IN VITRO LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN OR ANIMAL CONSUMPTION, ADMINISTRATION, OR ANY FORM OF BODILY INTRODUCTION. NOT FDA APPROVED. TO BE HANDLED BY TRAINED PROFESSIONALS IN CONTROLLED LABORATORY ENVIRONMENTS.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
