import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/cart/PriceDisplay";
import { useCart } from "@/contexts/CartContext";
import { getProductBySlug, getRelatedProducts, Product, ProductVariation } from "@/lib/products-data";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";
import { getLabelImage } from "@/lib/product-label-images";
import { useAuth } from "@/contexts/AuthContext";
import { useB2BPricing, lookupB2BTiers, type B2BTier } from "@/hooks/useB2BPricing";

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
  const { user, isB2B } = useAuth();
  const { byKey: b2bPricingMap } = useB2BPricing();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedB2BTier, setSelectedB2BTier] = useState<B2BTier | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const b2bTiers = useMemo<B2BTier[] | null>(() => {
    if (!isB2B || !product || !selectedVariation) return null;
    return lookupB2BTiers(b2bPricingMap, product.name, product.displayName, selectedVariation.strength);
  }, [isB2B, product, selectedVariation, b2bPricingMap]);

  useEffect(() => {
    if (b2bTiers && b2bTiers.length > 0) {
      setSelectedB2BTier((prev) => prev && b2bTiers.find(t => t.tierId === prev.tierId) ? prev : b2bTiers[0]);
    } else {
      setSelectedB2BTier(null);
    }
  }, [b2bTiers]);

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

    if (isB2B && b2bTiers && b2bTiers.length > 0) {
      if (!selectedB2BTier) {
        toast.error("Please select a wholesale kit size");
        return;
      }
      const cartItem = {
        productId: product.slug,
        variationId: `${product.slug}-${selectedVariation.strength}-b2b-${selectedB2BTier.vials}`,
        productName: product.displayName,
        variationName: `${selectedVariation.strength} · ${selectedB2BTier.vials} vial wholesale kit`,
        quantity: 1,
        price: selectedB2BTier.priceCents / 100,
      };
      setIsAddingToCart(true);
      await addToCart(cartItem);
      setIsAddingToCart(false);
      return;
    }

    const unitPrice = getUnitPrice(selectedVariation);
    if (unitPrice === 0) {
      toast.info("Price coming soon - contact us for pricing");
      return;
    }

    const cartItem = {
      productId: product.slug,
      variationId: `${product.slug}-${selectedVariation.strength}`,
      productName: product.displayName,
      variationName: `${selectedVariation.strength} (1 vial)`,
      quantity: selectedQuantity,
      price: unitPrice,
    };

    setIsAddingToCart(true);
    await addToCart(cartItem);
    setIsAddingToCart(false);

    if (!user) {
      navigate("/account?redirect=/products");
    }
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

  const isB2BMode = isB2B && b2bTiers && b2bTiers.length > 0;
  const unitPrice = selectedVariation ? getUnitPrice(selectedVariation) : 0;
  const lineTotal = isB2BMode && selectedB2BTier
    ? selectedB2BTier.priceCents / 100
    : unitPrice * selectedQuantity;
  const originalPrice = isB2BMode && selectedB2BTier
    ? selectedB2BTier.marketPriceCents / 100
    : getOriginalPrice(lineTotal);

  return (
    <Layout>
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
              {(() => {
                const labelSrc = getLabelImage(product.slug, selectedVariation?.strength);
                if (!labelSrc) return null;
                return (
                  <div className="mb-8 overflow-hidden rounded-xl border border-border bg-white max-w-md">
                    <img
                      src={labelSrc}
                      alt={`${product.displayName}${selectedVariation ? ` ${selectedVariation.strength}` : ""} label`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                );
              })()}
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
                        setSelectedQuantity(1);
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

              {/* Quantity / Wholesale tier */}
              {isB2BMode ? (
                <div className="mb-8">
                  <h3 className="font-heading text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Wholesale Kit Size
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {b2bTiers!.map((tier) => {
                      const active = selectedB2BTier?.tierId === tier.tierId;
                      return (
                        <button
                          key={tier.tierId}
                          type="button"
                          onClick={() => setSelectedB2BTier(tier)}
                          className={`relative p-4 border rounded-xl text-left transition-all ${
                            active
                              ? "border-foreground bg-foreground/5 ring-2 ring-foreground/20"
                              : "border-border hover:border-foreground/50"
                          }`}
                        >
                          <span className="font-heading font-semibold text-foreground block mb-1">
                            {tier.vials} vials
                          </span>
                          <span className="font-body text-xs text-muted-foreground block">
                            ${(tier.priceCents / 100).toLocaleString()}
                          </span>
                          <span className="font-body text-[10px] text-muted-foreground/70">
                            ${(tier.priceCents / 100 / tier.vials).toFixed(2)} / vial
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-3 uppercase tracking-wider">
                    Wholesale partner pricing · 10 vial MOQ
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <h3 className="font-heading text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Quantity (Vials)
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 border border-border rounded-xl text-xl font-heading hover:border-foreground/50 transition-colors"
                      disabled={unitPrice === 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      disabled={unitPrice === 0}
                      className="w-24 h-12 text-center border border-border rounded-xl bg-background font-heading text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((q) => q + 1)}
                      className="w-12 h-12 border border-border rounded-xl text-xl font-heading hover:border-foreground/50 transition-colors"
                      disabled={unitPrice === 0}
                    >
                      +
                    </button>
                    {unitPrice > 0 && (
                      <span className="font-body text-sm text-muted-foreground ml-2">
                        ${unitPrice.toFixed(2)} / vial
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Price Display */}
              <div className="flex items-center gap-8 mb-8">
                <PriceDisplay
                  price={lineTotal}
                  originalPrice={originalPrice}
                  size="lg"
                  showDiscount={lineTotal > 0}
                />
                <div>
                  <span className="font-body text-sm text-muted-foreground block">
                    {lineTotal > 0
                      ? isB2BMode && selectedB2BTier
                        ? `${selectedB2BTier.vials} vial kit · ${selectedVariation?.strength}`
                        : `${selectedQuantity} × ${selectedVariation?.strength}`
                      : "Price coming soon"}
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
                disabled={lineTotal === 0 || isAddingToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? "Adding..." : lineTotal > 0 ? "Add to Cart" : "Contact for Pricing"}
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

        {/* Related products */}
        {(() => {
          const related = getRelatedProducts(product.slug, 3);
          if (related.length === 0) return null;
          return (
            <section className="container mx-auto px-4 lg:px-8 mt-24">
              <div className="border-t border-border/40 pt-16">
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-10">
                  Products you may like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </div>
            </section>
          );
        })()}
      </div>
    </Layout>
  );
};

export default ProductPage;
