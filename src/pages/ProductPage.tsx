import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/cart/PriceDisplay";
import { useCart } from "@/contexts/CartContext";
import { getProductBySlug, Product, ProductVariation } from "@/lib/products-data";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";

const getUnitPrice = (variation: ProductVariation): number => {
  if (variation.price && variation.price > 0) return variation.price;
  if (variation.price10 && variation.price10 > 0) return variation.price10 / 10;
  return 0;
};

const getOriginalPrice = (price: number): number => {
  if (price === 0) return 0;
  return Math.round(price / 0.8);
};

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate("/products");
      return;
    }

    const foundProduct = getProductBySlug(slug);
    if (!foundProduct) {
      navigate("/products");
      return;
    }

    setProduct(foundProduct);
    if (foundProduct.variations.length > 0) {
      setSelectedVariation(foundProduct.variations[0]);
      setSelectedQuantity(1);
    }
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariation) {
      toast.error("Please select a variation");
      return;
    }

    const price = getPriceForTier(selectedVariation, selectedQuantity);
    if (price === 0) {
      toast.info("Price coming soon - contact us for pricing");
      return;
    }

    setIsAddingToCart(true);
    await addToCart({
      productId: product.slug,
      variationId: `${product.slug}-${selectedVariation.strength}-${selectedQuantity}`,
      productName: product.displayName,
      variationName: `${selectedVariation.strength} × ${selectedQuantity} vials`,
      quantity: 1,
      price,
    });
    setIsAddingToCart(false);
  };

  if (!product) {
    return (
      <Layout>
        <div className="pt-24 lg:pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  const currentPrice = selectedVariation ? getPriceForTier(selectedVariation, selectedQuantity) : 0;
  const originalPrice = getOriginalPrice(currentPrice);

  return (
    <Layout footerWordmark="PRODUCTS YOU MAY LIKE">
      <div className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">Back to Products</span>
          </Link>

          <div className="max-w-4xl">
            <div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {product.displayName}
              </h1>

              {product.description && (
                <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variations */}
              <div className="mb-8">
                <h3 className="font-heading text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Select Variation
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variations.map((variation, index) => (
                    <button
                      key={`${product.slug}-${variation.strength}-${index}`}
                      onClick={() => {
                        setSelectedVariation(variation);
                        setSelectedQuantity(10);
                      }}
                      className={`relative p-4 border rounded-xl text-left transition-all ${
                        selectedVariation?.strength === variation.strength
                          ? "border-foreground bg-foreground/5 ring-2 ring-foreground/20"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      {selectedVariation?.strength === variation.strength && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-background" />
                        </div>
                      )}
                      <span className="font-heading font-semibold text-foreground block mb-1">
                        {variation.strength}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        per vial
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Tiers */}
              <div className="mb-8">
                <h3 className="font-heading text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Select Quantity
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {QUANTITY_TIERS.map((tier) => {
                    const tierPrice = selectedVariation ? getPriceForTier(selectedVariation, tier) : 0;
                    const hasPrice = tierPrice > 0;
                    
                    return (
                      <button
                        key={tier}
                        onClick={() => hasPrice && setSelectedQuantity(tier)}
                        disabled={!hasPrice}
                        className={`relative p-4 border rounded-xl text-center transition-all ${
                          selectedQuantity === tier && hasPrice
                            ? "border-foreground bg-foreground/5 ring-2 ring-foreground/20"
                            : hasPrice
                            ? "border-border hover:border-foreground/50"
                            : "border-border/50 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {selectedQuantity === tier && hasPrice && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-background" />
                          </div>
                        )}
                        <span className="font-heading font-semibold text-foreground block mb-1">
                          {tier} Vials
                        </span>
                        <span className="font-body text-sm text-muted-foreground">
                          {hasPrice ? `$${tierPrice.toLocaleString()}` : "N/A"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-center gap-8 mb-8">
                <PriceDisplay 
                  price={currentPrice} 
                  originalPrice={originalPrice}
                  size="lg" 
                  showDiscount={currentPrice > 0}
                />
                <div>
                  <span className="font-body text-sm text-muted-foreground block">
                    {currentPrice > 0 ? `for ${selectedQuantity} vials` : "Price coming soon"}
                  </span>
                  <span className="font-heading text-lg font-medium text-foreground">
                    {selectedVariation?.strength}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                variant="hero"
                size="lg"
                className="w-full gap-3 text-lg py-6"
                onClick={handleAddToCart}
                disabled={currentPrice === 0 || isAddingToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? "Adding..." : currentPrice > 0 ? "Add to Cart" : "Contact for Pricing"}
              </Button>

              {/* Product Details Accordion */}
              <div className="mt-12 border-t border-border pt-8">
                <Accordion type="multiple" className="w-full">
                  {product.scientificPurpose && (
                    <AccordionItem value="purpose" className="border-border/50">
                      <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                        Scientific Research Purpose
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-muted-foreground leading-relaxed text-base">
                        {product.scientificPurpose}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {product.studiesFindings && (
                    <AccordionItem value="studies" className="border-border/50">
                      <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                        Studies Have Proven To Show
                      </AccordionTrigger>
                      <AccordionContent className="font-body text-muted-foreground leading-relaxed text-base">
                        {product.studiesFindings}
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {product.nihLink && (
                    <AccordionItem value="nih" className="border-border/50">
                      <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                        NIH Research Link
                      </AccordionTrigger>
                      <AccordionContent>
                        <a
                          href={product.nihLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 font-body text-foreground hover:text-foreground/80 transition-colors text-base underline"
                        >
                          View on PubMed
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  <AccordionItem value="coa" className="border-border/50">
                    <AccordionTrigger className="font-heading text-lg font-medium text-foreground hover:no-underline">
                      COA Photo & Lab Testing
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground text-base">
                      <p className="italic">COA documentation available upon request.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Terms disclaimer */}
              <div className="mt-12 p-4 bg-secondary/30 rounded-lg border border-border/50">
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  <strong>DISCLAIMER:</strong> This product is intended for research purposes only. 
                  NOT FOR HUMAN CONSUMPTION. NOT FOR ANIMAL TESTING OR CONSUMPTION. 
                  By purchasing this product, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{" "}
                  and confirm you are a qualified research professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
